import Vapor
import Fluent
import Queues

struct EmailInfo: Codable {
    let to: String
    let name: String?
    let token: String?
    let kind: Kind
}

struct EmailJob: AsyncJob {
    typealias Payload = EmailInfo

    func dequeue(_ context: QueueContext, _ payload: Payload) async throws {
        let baseUrl = Environment.get("SITE_BASE_URL") ?? "http://localhost:3000"

        let subject = switch payload.kind {
            case .confirmation:
                "Welcome to Offprint!"
            case .reset:
                "Reset Your Offprint Password"
        }

        let body = switch payload.kind {
            case .confirmation:
                """
                    <div>
                        <h1>Welcome to Offprint!</h1>
                        <p>
                            On behalf of all of us on the dev team, we're so glad that you're here.
                        </p>
                        <p>
                            But first, we're gonna need to confirm your account. To get started, click the link below to verify your email address. Won't take more than a few seconds.
                        </p>
                        <a href="\(baseUrl)/confirm-email?token=\(payload.token ?? "")">Verify Your Email Address</a>
                        <p>
                            Just a reminder: this code expires in one hour, so be sure to get everything all squared away before then. And with that, we hope you enjoy!
                        </p>
                    </div>
                """
            case .reset:
                """
                    <div>
                        <h1>Reset Your Offprint Password</h1>
                        <p>
                            Hey there! We've gotten word that you want to reset your Offprint password. If that's what you want, hit the link below to get started.
                        </p>
                        <a href="\(baseUrl)/reset-password?token=\(payload.token ?? "")">Reset Your Password</a>
                        <p>
                            Otherwise, feel free to ignore this message. It'll expire after 1 hour.
                        </p>
                    </div>
                """
        }

        _ = try await context.application.email.sendEmail(
            to: [payload.to], 
            subject: subject, 
            htmlBody: body, 
            textBody: nil
        )
    }
}

extension EmailInfo {
    enum Kind: Codable {
        case confirmation
        case reset
    }
}