const mssql = require('mssql');
const winston = require('winston');

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
        winston.info('Connected to database server!')
    } catch (err) {
        winston.error(err);
        process.exit(-1);
    }
})();