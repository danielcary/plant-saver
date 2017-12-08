const mssql = require('mssql');

const config = {
    server: process.env.DBCONN_SERVER,
    database: process.env.DBCONN_DATABASE,
    user: process.env.DBCONN_USER,
    password: process.env.DBCONN_PASSWORD,
    port: 1433,
    options: {
        encrypt: true
    }
};

// wait for connection to database
(async () => {
    try {
        await mssql.connect(config);
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }
})();