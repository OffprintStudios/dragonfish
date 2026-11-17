import Vapor
import Fluent
import struct Foundation.Date

struct BlogObject: Content {
    var id: String?
    var authorID: String?
    var authorName: String
    var authorAvatar: String
    var title: String
    var body: String
    var words: Int64
    var views: Int64
    var likes: Int64
    var dislikes: Int64
    var nsfw: Bool
    var license: ContentLicense
    var allowComments: Bool
    var editedOn: Date?
    var publishedOn: Date?
    var createdAt: Date?
    var updatedAt: Date?
}