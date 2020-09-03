module.exports = {
    apps: [{
        name: "pulpd",
        script: "/opt/pulpd/site/main.js",
        cwd: "/opt/pulpd/site/",
        env_production: {
            "NODE_ENV": "production"
        },

    }]
}