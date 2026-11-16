import Vapor
import Fluent
import struct Foundation.UUID
import struct Foundation.Date

struct ProfileObject: Content {
    var id: String?
    var username: String
    var avatar: String
    var bannerArt: String?
    var bio: String
    var tagline: String
    var works: Int64
    var blogs: Int64
    var followers: Int64
    var following: Int64
    var links: [String]
    var createdAt: Date?

    func toModel() -> Profile {
        let model = Profile()

        model.id = self.id
        model.username = self.username
        model.avatar = self.avatar
        model.bannerArt = self.bannerArt
        model.bio = self.bio
        model.tagline = self.tagline
        model.links = self.links
        model.createdAt = self.createdAt

        return model
    }
}