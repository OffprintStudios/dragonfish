import Vapor
import Fluent

struct ProfileController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let profiles = routes.grouped("profiles")

        profiles.group(":id") { route in 
            route.get("", use: getProfile)
        }
    }

    @Sendable
    func getProfile(request: Request) async throws -> ProfileObject {
        let id = request.parameters.get("id")!

        guard let profile = try await Profile.find(id, on: request.db) else {
            throw Abort(.notFound, reason: "You are lost in a sea of faces, traveler. Where will you go next?")
        }

        return profile.toObject()
    }
}