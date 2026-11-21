import NIOSSL
import Fluent
import FluentPostgresDriver
import Leaf
import Vapor
import JWT
import Queues
import QueuesRedisDriver
import Redis
import SotoS3

/// configures your application
func configure(_ app: Application) async throws {
    // uncomment to serve files from /Public folder
    // app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    app.logger.notice("Starting Dragonfish API...")
    app.routes.defaultMaxBodySize = "3mb"

    // Setting port
    app.http.server.configuration.port = Int(Environment.get("PORT") ?? "8080")!

    // Setting up JWT signing
    app.logger.notice("Assigning secret key ...")
    let key = Environment.get("SECRET_KEY") ?? "aSecret"
    await app.jwt.keys.add(hmac: .init(from: key), digestAlgorithm: .sha256)

    // Setting up database connection
    app.logger.notice("Connecting to database ...")
    if let databaseURL = Environment.get("DATABASE_URL") {
        var tlsConfig: TLSConfiguration = .makeClientConfiguration()
        tlsConfig.certificateVerification = .none
        let nioSSLContext = try NIOSSLContext(configuration: tlsConfig)

        var postgresConfig = try SQLPostgresConfiguration(url: databaseURL)
        postgresConfig.coreConfiguration.tls = .prefer(nioSSLContext)

        app.databases.use(.postgres(configuration: postgresConfig, connectionPoolTimeout: .seconds(30)), as: .psql)
    } else {
        try app.databases.use(.postgres(url: "postgresql://postgres@localhost/dragonfish", connectionPoolTimeout: .seconds(30)), as: .psql)
    }

    // Running migrations
    app.logger.notice("Running migrations ...")
    app.migrations.add([
        Account.Create(),
        Profile.Create(),
        Profile.CreateIndexes(),
        Follower.Create(),
        Badge.Create(),
        ProfileBadge.Create(),
        Session.Create(),
        OneTimeCode.Create(),
        Tag.Create(),
        Tag.CreateIndexes(),
        ContentLicense.CreateEnum(),
        ContentRating.CreateEnum(),
        ContentVisibility.CreateEnum(),
        Blog.Create(),
        Blog.CreateIndexes(),
        BlogTag.Create(),
        FavoriteBlog.Create(),
        BlogVote.Create(),
        BlogVote.CreateTrigger(),
        TrendingBlog.CreateView(),
        ApprovalStatus.CreateEnum(),
        CompletionStatus.CreateEnum(),
        WorkCategory.CreateEnum(),
        WorkKind.CreateEnum(),
    ])
    try await app.autoMigrate()

    // Adding model middleware
    app.logger.notice("Initializing model middleware ...")
    app.databases.middleware.use(Account.Middleware(), on: .psql)
    app.databases.middleware.use(Profile.Middleware(), on: .psql)
    app.databases.middleware.use(Follower.Middleware(), on: .psql)
    app.databases.middleware.use(Badge.Middleware(), on: .psql)
    app.databases.middleware.use(Tag.Middleware(), on: .psql)
    app.databases.middleware.use(Blog.Middleware(), on: .psql)

    // Registering Leaf templates
    app.logger.notice("Registering Leaf templates ...")
    app.views.use(.leaf)

    // Initializing job queues and Redis
    app.logger.notice("Initializing job queues and Redis ...")
    let redisConfig = try RedisConfiguration(
        url: Environment.get("REDIS_URL") ?? "redis://127.0.0.1:6379",
        pool: RedisConfiguration.PoolOptions(connectionRetryTimeout: .minutes(1))
    )
    app.redis.configuration = redisConfig
    app.queues.use(.redis(redisConfig))

    // Registering jobs
    app.logger.notice("Registering jobs ...")
    app.queues.add(EmailJob())

    // CORS configuration
    app.logger.notice("Initializing CORS configuration ...")
    let corsConfig = CORSMiddleware.Configuration(
        allowedOrigin: .any([
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://offprint.cafe",
            "https://www.offprint.cafe",
            "https://staging.offprint.cafe",
            "https://dev.offprint.cafe",
        ]),
        allowedMethods: [.GET, .POST, .PUT, .PATCH, .DELETE, .OPTIONS],
        allowedHeaders: [.accept, .authorization, .contentType, .origin, .xRequestedWith, .userAgent, .accessControlAllowOrigin],
        allowCredentials: true
    )
    let cors = CORSMiddleware(configuration: corsConfig)
    app.middleware.use(cors, at: .beginning)

    // Configuring AWS
    app.logger.notice("Configuring storage buckets ...")
    app.aws.client = AWSClient(
        credentialProvider: .static(
            accessKeyId: Environment.get("BUCKET_ACCESS_KEY") ?? "nil",
            secretAccessKey: Environment.get("BUCKET_SECRET") ?? "nil"
        ),
        httpClient: HTTPClient.shared
    )

    // Register routes
    app.logger.notice("Registering routes ...")
    try routes(app)

    // Print all routes to console
    for route in app.routes.all {
        let path = route.path.map { String($0.description) }
        app.logger.info("Route registered: /\(path.joined(separator: "/")) [\(route.method.rawValue)]")
    }

    // Restarting any available jobs
    app.logger.notice("Restarting any pending jobs ...")
    try app.queues.startInProcessJobs(on: .default)
}
