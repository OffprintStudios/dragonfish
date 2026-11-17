import Vapor
import Fluent

struct ProfileController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let profiles = routes.grouped("profiles")

        profiles.group(":id") { route in 
            route.get("", use: getProfile)
            route.grouped(IdentityGuard(needs: [.user], optional: true)).get("blogs", use: getBlogs)
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

    @Sendable
    func getBlogs(request: Request) async throws -> Page<BlogObject> {
        let id = request.parameters.get("id")!
        let includesNSFW = request.query[Bool.self, at: "nsfw"] ?? false

        if let account = request.user?.account {
            if let profile = try await account.$profiles.query(on: request.db).filter(\.$id == id).first() {
                return try await profile.$blogs.query(on: request.db).paginate(for: request).map { $0.toObject() }
            }
        }

        let validStates: [ContentVisibility] = [.profile, .public]
        var query = Blog.query(on: request.db)
            .with(\.$author)
            .filter(\.$author.$id == id)
            .filter(\.$visibility ~~ validStates)
            .filter(\.$publishedOn != nil)
            .filter(\.$publishedOn <= Date())
        if !includesNSFW {
            query = query.filter(\.$nsfw == false)
        }
        return try await query.paginate(for: request).map { $0.toObject() }
    }
}