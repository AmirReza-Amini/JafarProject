module.exports = {
    portNo: 4000,
    db: {
        mongo: {
            main: {
                name: 'neginDb',
                address: 'localhost:27017'
            },
            log: {
                name: 'neginDb_log',
                address: 'localhost:27017'
            }
        },
        sqlConfig: {
            driver: 'mssql',
            config: {
                user: 'sa',
                password: '8854po',
                server: '172.24.17.15',
                database: 'NeginDb'
            }
        }
    },
    jwtExpireTime: 3000,
    tokenHashKey: 'YOUR_TOKEN_HASH_KEY',
    jwtSecret: "YOUR_JWT_SECRET_KEY"


}
