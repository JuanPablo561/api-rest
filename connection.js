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

// Devuelve un pool reutilizable (se crea solo la primera vez)
async function getConnection() {
  if (pool) return pool;
  pool = await new sql.ConnectionPool(dbSettings).connect();
  return pool;
}

module.exports = { sql, getConnection };
