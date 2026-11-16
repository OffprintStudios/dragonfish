export interface Profile {
    readonly id: string
    username: string
    avatar: string
    bannerArt?: string
    bio: string
    tagline: string
    works: number
    blogs: number
    followers: number
    following: number
    links: string[]
    createdAt: Date
}