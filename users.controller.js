const { sql, getConnection } = require('../database/connection');
const { hashPassword } = require('../utils/password');

const isDuplicate = (error) => error.number === 2627 || error.number === 2601;

// GET /users
const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT id, name, email, created_at FROM users');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /users/:id
const getUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT id, name, email, created_at FROM users WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email y password son obligatorios' });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('name', sql.NVarChar(100), name)
      .input('email', sql.NVarChar(150), email)
      .input('password', sql.NVarChar(255), hashPassword(password))
      .query(`INSERT INTO users (name, email, password)
              OUTPUT INSERTED.id, INSERTED.name, INSERTED.email
              VALUES (@name, @email, @password)`);
    res.status(201).json(result.recordset[0]);
  } catch (error) {
    if (isDuplicate(error)) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'name y email son obligatorios' });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.NVarChar(100), name)
      .input('email', sql.NVarChar(150), email)
      .input('password', sql.NVarChar(255), password ? hashPassword(password) : null)
      .query(`UPDATE users
              SET name = @name, email = @email, password = COALESCE(@password, password)
              OUTPUT INSERTED.id, INSERTED.name, INSERTED.email
              WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    if (isDuplicate(error)) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM users OUTPUT DELETED.id WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado', id: result.recordset[0].id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
