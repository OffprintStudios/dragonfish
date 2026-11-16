import Vapor

/* Models */
struct ResendPayload: Content {
    let from: String
    let to: [String]
    let subject: String
    let html: String
    let text: String?

    init(from: String, to: [String], subject: String, html: String, text: String? = nil) {
        self.from = from
        self.to = to
        self.subject = subject
        self.html = html
        self.text = text
    }
}

struct ResendResponse: Content {
    let id: String
}

struct ResendErrorResponse: Content {
    let statusCode: Int?
    let message: String
    let name: String?
}

/* Service */
protocol EmailService {
    func sendEmail(to recipient: [String], subject: String, htmlBody: String, textBody: String?) async throws -> ResendResponse
}

struct ResendClient: EmailService {
    var app: Application

    func sendEmail(to recipient: [String], subject: String, htmlBody: String, textBody: String?) async throws -> ResendResponse {
        guard let apiKey = Environment.get("RESEND_API_KEY") else {
            app.logger.error("RESEND_API_KEY is not set in environment.")
            throw Abort(.internalServerError, reason: "Email service configuration error")
        }
        
        let payload = ResendPayload(
            from: "Beatriz from Offprint <no-reply@offprint.cafe>",
            to: recipient,
            subject: subject,
            html: htmlBody,
            text: textBody
        )
        
        let response = try await app.client.post("https://api.resend.com/emails") { clientReq in
            try clientReq.content.encode(payload, as: .json)
            clientReq.headers.bearerAuthorization = BearerAuthorization(token: apiKey)
        }
        
        guard response.status == .ok || response.status == .created else {
            let errorDetail = try? response.content.decode(ResendErrorResponse.self)
            app.logger.error("Resend API error: \(errorDetail?.message ?? "Unknown error")")
            throw Abort(response.status, reason: errorDetail?.message ?? "Failed to send email")
        }
        
        // Decodes into ResendResponse using Content (Decodable)
        return try response.content.decode(ResendResponse.self)
    }
}

/* Extensions */
extension Application {
    var email: any EmailService {
        ResendClient(app: self)
    }
}

extension Request {
    var email: any EmailService {
        self.application.email
    }
}