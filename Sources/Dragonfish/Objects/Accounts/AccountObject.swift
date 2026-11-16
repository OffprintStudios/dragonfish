import Vapor
import Fluent
import struct Foundation.UUID
import struct Foundation.Date

struct AccountObject: Content {
    var id: UUID?
    var roles: [Account.Roles]
    var termsAgree: Bool
    var emailConfirmed: Bool
    var createdAt: Date?
    var updatedAt: Date?
    var token: String?

    func toModel() -> Account {
        let model = Account()

        model.id = self.id
        model.email = "REDACTED"
        model.password = "REDACTED"
        model.roles = self.roles
        model.termsAgree = self.termsAgree
        model.emailConfirmed = self.emailConfirmed
        model.createdAt = self.createdAt
        model.updatedAt = self.updatedAt

        return model
    }
}