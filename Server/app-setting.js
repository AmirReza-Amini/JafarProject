module.exports = {
  portNo: 4001,
  db: {
    mongo: {
      main: {
        name: "NeginDB",
        address: "localhost:27017",
      },
      log: {
        name: "NeginDB_log",
        address: "localhost:27017",
      },
    },
    sqlConfig: {
      driver: "mssql",
      config: {
        user: "sa",
        password: "qwe123!@#",
        server: "172.16.34.10\\sql2014",
        database: "NeginDb",
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 60000,
        },
        options:{
          encrypt:true,
          enableArithAbort:true
        }
      },
    },
  },
  jwtExpireTime: 3000,
  tokenHashKey: "8c10%$#f9be0b053082",
  requiresAuth: true,
  jwtSecret: "9057c4f0-b57e-4320-9a7e-c028bc3e54cb",
};
