const sql = require('mssql');
const { db } = require('../config');

const dbSettings = {
  user: db.user,
  password: db.password,
  server: db.server,
  port: db.port,
  database: db.database,
  options: {
    encrypt: db.encrypt,
    trustServerCertificate: db.trustCert,
  },
};

let pool = null;

async function getConnection() {
  if (pool) return pool;
  pool = await new sql.ConnectionPool(dbSettings).connect();
  return pool;
}

module.exports = { sql, getConnection };
