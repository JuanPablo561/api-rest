const { sql, getConnection } = require('../database/connection');
const { verifyPassword } = require('../utils/password');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email y password son obligatorios' });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('email', sql.NVarChar(150), email)
      .query('SELECT id, name, email, password FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Login exitoso',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };
