import Vapor
import Fluent
import SwiftSoup
import Argon2Swift
import JWT
import Queues

struct AuthController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let auth = routes.grouped("auth")

        auth.grouped(Account.authenticator()).post("log-in", use: self.logIn)
        auth.post("sign-up", use: self.signUp)
        auth.post("forgot-password", use: self.sendResetEmail)
        auth.patch("reset-password", use: self.resetPassword)
        auth.patch("confirm-email", use: self.confirmEmail)
    }

    @Sendable
    func logIn(request: Request) async throws -> AccountObject {
        let account = try request.auth.require(Account.self)
        guard let rememberMe = request.headers.first(name: "X-Offprint-Remember-Me") else {
            throw Abort(.badRequest, reason: "Missing duration setting.")
        }

        if account.emailConfirmed {
            guard let duration = Session.Duration(rawValue: rememberMe) else {
                throw Abort(.badRequest, reason: "Malformed duration setting.")
            }

            let session = Session(duration: duration)
            try await account.$sessions.create(session, on: request.db)

            let token = try Session.Token(for: account, with: session, expiration: session.$expiresOn.value!)

            return await account.toObject(with: try request.jwt.sign(token))
        } else {
            let confirmationCode = OneTimeCode(kind: .emailConfirmation, expiresOn: Date().addingTimeInterval(TOKEN_EXPIRATION))
            try await account.$codes.create(confirmationCode, on: request.db)

            try await request.queue.dispatch(
            EmailJob.self, 
                .init(
                    to: account.$email.value!,
                    name: nil, 
                    token: confirmationCode.$id.value,
                    kind: .confirmation
                ),
                maxRetryCount: 3
            )

            throw Abort(.methodNotAllowed, reason: "Can't let you in without confirming your email address, so we took the liberty of sending you a new code.")
        }
    }

    @Sendable
    func signUp(request: Request) async throws -> HTTPStatus {
        try Account.RegisterForm.validate(content: request)
        
        let formInfo = try request.content.decode(Account.RegisterForm.self)
        if formInfo.ageCheck != true {
            throw Abort(.unauthorized, reason: "You must be at least 13 years of age or older to register.")
        }
        if formInfo.termsAgree != true {
            throw Abort(.unauthorized, reason: "You must agree to the Terms of Service, Privacy Policy, and Offprint Constitution in order to register.")
        }

        let newAccount = Account(with: formInfo)
        try await newAccount.save(on: request.db)

        let confirmationCode = OneTimeCode(kind: .emailConfirmation, expiresOn: Date().addingTimeInterval(TOKEN_EXPIRATION))
        try await newAccount.$codes.create(confirmationCode, on: request.db)

        try await request.queue.dispatch(
            EmailJob.self, 
            .init(
                to: newAccount.$email.value!,
                name: nil, 
                token: confirmationCode.$id.value,
                kind: .confirmation
            ),
            maxRetryCount: 3
        )

        return .ok
    }

    @Sendable
    func sendResetEmail(request: Request) async throws -> HTTPResponseStatus {
        struct ResetInfo: Content, Validatable {
            let email: String

            static func validations(_ validations: inout Validations) {
                validations.add("email", as: String.self, is: .email)
            }
        }

        try ResetInfo.validate(content: request)
        let resetInfo = try request.content.decode(ResetInfo.self)

        guard let account = try await Account.query(on: request.db)
            .filter(\.$email == resetInfo.email)
            .first() else {
                throw Abort(.badRequest, reason: "You gotta include the email address we're supposed to check, come on now")
            }

        let passwordReset = OneTimeCode(kind: .passwordReset, expiresOn: Date().addingTimeInterval(TOKEN_EXPIRATION))
        try await account.$codes.create(passwordReset, on: request.db)

        try await request.queue.dispatch(
            EmailJob.self,
            .init(
                to: account.$email.value!, 
                name: nil, 
                token: passwordReset.$id.value, 
                kind: .reset
            ),
            maxRetryCount: 3
        )

        return .ok
    }

    @Sendable
    func resetPassword(request: Request) async throws -> HTTPResponseStatus {
        struct PasswordInfo: Content, Validatable {
            let token: String
            let newPassword: String

            static func validations(_ validations: inout Validations) {
                validations.add("newPassword", as: String.self, is: .count(8...))
            }
        }

        try PasswordInfo.validate(content: request)
        let passwordInfo = try request.content.decode(PasswordInfo.self)
        let cleanToken = try SwiftSoup.clean(passwordInfo.token, .none())!
        let cleanPassword = try SwiftSoup.clean(passwordInfo.newPassword, .none())!

        guard let code = try await OneTimeCode.query(on: request.db)
            .filter(\.$id == cleanToken)
            .filter(\.$kind == .passwordReset)
            .filter(\.$expiresOn > Date())
            .first() else {
                throw Abort(.badRequest, reason: "You're missing crucial information to process this request")
            }

        guard let account = try await Account.find(code.$account.id, on: request.db) else {
            throw Abort(.badRequest, reason: "You're missing crucial information to process this request")
        }

        guard let hashedPassword = try? Argon2Swift.hashPasswordString(password: cleanPassword, salt: Salt.newSalt(), type: Argon2Type.id) else {
            throw Abort(.internalServerError, reason: "Failed to create your account. Contact an administrator for assistance.")
        }
        account.password = hashedPassword.encodedString().trimmingCharacters(in: CharacterSet(charactersIn: "\0"))

        try await request.db.transaction { transaction in 
            try await account.update(on: transaction)
            try await code.delete(on: transaction)
        }
        
        return .ok
    }

    @Sendable
    func confirmEmail(request: Request) async throws -> HTTPResponseStatus {
        struct ConfirmInfo: Content {
            let token: String
        }

        let confirmInfo = try request.content.decode(ConfirmInfo.self)
        let cleanToken = try SwiftSoup.clean(confirmInfo.token, .none())!

        print(cleanToken)

        guard let code = try await OneTimeCode.query(on: request.db)
            .filter(\.$id == cleanToken)
            .filter(\.$kind == .emailConfirmation)
            .filter(\.$expiresOn > Date())
            .first() else {
                throw Abort(.badRequest, reason: "You're missing crucial information to process this request")
            }

        guard let account = try await Account.find(code.$account.id, on: request.db) else {
            throw Abort(.badRequest, reason: "You're missing crucial information to process this request")
        }

        account.emailConfirmed = true

        try await request.db.transaction { transaction in 
            try await account.update(on: transaction)
            try await code.delete(on: transaction)
        }

        return .ok
    }
}