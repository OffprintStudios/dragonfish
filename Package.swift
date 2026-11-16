// swift-tools-version:6.4
import PackageDescription

let package = Package(
    name: "Dragonfish",
    platforms: [
       .macOS(.v13)
    ],
    dependencies: [
        // 💧 A server-side Swift web framework.
        .package(url: "https://github.com/vapor/vapor.git", from: "4.121.4"),
        // 🗄 An ORM for SQL and NoSQL databases.
        .package(url: "https://github.com/vapor/fluent.git", from: "4.13.0"),
        // 🐘 Fluent driver for Postgres.
        .package(url: "https://github.com/vapor/fluent-postgres-driver.git", from: "2.12.0"),
        // 🍃 An expressive, performant, and extensible templating language built for Swift.
        .package(url: "https://github.com/vapor/leaf.git", from: "4.5.1"),
        // 🔵 Non-blocking, event-driven networking for Swift. Used for custom executors
        .package(url: "https://github.com/apple/swift-nio.git", from: "2.101.0"),
        // Vapor JWT package
        .package(url: "https://github.com/vapor/jwt.git", from: "5.2.0"),
        // Argon2 password hasher
        .package(url: "https://github.com/tmthecoder/Argon2Swift.git", branch: "main"),
        // User-Agent Parser
        .package(url: "https://github.com/malcommac/UAParserSwift.git", from: "1.2.1"),
        // NanoID generation
        .package(url: "https://github.com/OffprintStudios/NanoID.git", from: "1.0.0"),
        // SwiftSoup HTML sanitization
        .package(url: "https://github.com/scinfu/SwiftSoup.git", from: "2.14.3"),
        // Soto AWS library
        .package(url: "https://github.com/soto-project/soto.git", from: "7.17.0"),
        // Job queues
        .package(url: "https://github.com/vapor/queues-redis-driver.git", from: "1.1.2"),
        // Redis
        .package(url: "https://github.com/vapor/redis.git", from: "4.14.0")
    ],
    targets: [
        .executableTarget(
            name: "Dragonfish",
            dependencies: [
                .product(name: "Fluent", package: "fluent"),
                .product(name: "FluentPostgresDriver", package: "fluent-postgres-driver"),
                .product(name: "Leaf", package: "leaf"),
                .product(name: "Vapor", package: "vapor"),
                .product(name: "NIOCore", package: "swift-nio"),
                .product(name: "NIOPosix", package: "swift-nio"),
                .product(name: "JWT", package: "jwt"),
                .product(name: "Argon2Swift", package: "Argon2Swift"),
                .product(name: "UAParserSwift", package: "UAParserSwift"),
                .product(name: "NanoID", package: "NanoID"),
                .product(name: "SwiftSoup", package: "SwiftSoup"),
                .product(name: "SotoS3", package: "soto"),
                .product(name: "QueuesRedisDriver", package: "queues-redis-driver"),
                .product(name: "Redis", package: "redis")
            ],
            swiftSettings: swiftSettings
        ),
        .testTarget(
            name: "DragonfishTests",
            dependencies: [
                .target(name: "Dragonfish"),
                .product(name: "VaporTesting", package: "vapor"),
            ],
            swiftSettings: swiftSettings
        )
    ]
)

var swiftSettings: [SwiftSetting] { [
    .enableUpcomingFeature("ExistentialAny"),
    .enableUpcomingFeature("InternalImportsByDefault"),
    .enableUpcomingFeature("MemberImportVisibility"),
    .enableUpcomingFeature("InferIsolatedConformances"),
    .enableUpcomingFeature("ImmutableWeakCaptures"),
] }
