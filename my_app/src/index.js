const express = require("express");
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const secretkey = 'secretkey';
let user_email = 'NULL';

app.use(express.static('./front-end'));
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

async function DisplayDataTable(pool, tableName)
{
  let conn;
  try {
      conn = await pool.getConnection();
      const rows = await conn.query(`SELECT * FROM ${tableName}`);
      if (rows.length === 0) {
        console.log(`Aucune donnée trouvée dans la table '${tableName}'.`);
        return;
      }
      console.log(`Données de la table '${tableName}':`);
      console.log(rows);
  } catch (error) {
      console.error(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}':`, error);
  } finally {
      if (conn) {
        conn.release();
      }
  }
}

async function DisplayUserDataTableByEmail(pool, tableName, user_email)
{
  let conn;
  try {
      conn = await pool.getConnection();
      const sql = `SELECT * FROM ${tableName} WHERE email = ?`;
      const rows = await conn.query(sql, [user_email]);
      if (rows.length === 0) {
        console.log(`Aucune donnée trouvée dans la table '${tableName}'.`);
        return;
      }
      console.log(`Données de la table '${tableName}':`);
      rows.forEach((row) => {
        console.log(row);
      });
  } catch (error) {
      console.error(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}':`, error);
  } finally {
      if (conn) {
        conn.release();
      }
  }
}

async function DisplayUserDataTableById(pool, tableName, identifier)
{
  let conn;
  try {
      conn = await pool.getConnection();
      const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
      const rows = await conn.query(sql, [identifier]);
      if (rows.length === 0) {
        console.log(`Aucune donnée trouvée dans la table '${tableName}'.`);
        return;
      }
      console.log(`Données de la table '${tableName}':`);
      rows.forEach((row) => {
        console.log(row);
      });
  } catch (error) {
      console.error(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}':`, error);
  } finally {
      if (conn) {
        conn.release();
      }
  }
}

async function DisplayAllUser(pool, tableName, res)
{
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${tableName}`);
    if (rows.length === 0) {
      res.send(`Aucune donnée trouvée dans la table '${tableName}'.`);
      return;
    }
    const data = rows.map((row) => {
      const user = {
        email: row.email,
        name: row.name,
        firstname: row.firstname,
        password: row.password
      };
      return JSON.stringify(user, null, 2);
    }).join('\n\n');
    res.send(`Données de la table '${tableName}':\n${data}`);
  } catch (error) {
    res.send(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}'.`);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

async function DisplayUserInfoByEmail(pool, tableName, res, user_email)
{
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = `SELECT * FROM ${tableName} WHERE email = ?`;
    const rows = await conn.query(sql, [user_email]);
    if (rows.length === 0) {
      res.send(`Aucune donnée trouvée dans la table '${tableName}'.`);
      return;
    }
    const data = rows.map((row) => {
      const user = {
        id: row.id,
        email: row.email,
        password: row.password,
        firstname: row.firstname,
        created : row.created_at,
      };
      return JSON.stringify(user, null, 2);
    }).join('\n\n');
    res.send(`Données de la table '${tableName}':\n${data}`);
  } catch (error) {
    res.send(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}'.`);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

async function DisplayUserInfoById(pool, tableName, res, id)
{
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const rows = await conn.query(sql, [id]);
    if (rows.length === 0) {
      res.send(`Aucune donnée trouvée dans la table '${tableName}'.`);
      return;
    }
    const data = rows.map((row) => {
      const user = {
        id: row.id,
        email: row.email,
        password: row.password,
        firstname: row.firstname,
        created : row.created_at,
      };
      return JSON.stringify(user, null, 2);
    }).join('\n\n');
    res.send(`Données de la table '${tableName}':\n${data}`);
  } catch (error) {
    res.send(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}'.`);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

async function displayTableContent(pool, tableName, res)
{
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = `SELECT * FROM ${tableName}`;
    const rows = await conn.query(sql);
    if (rows.length === 0) {
      res.send(`Aucune donnée trouvée dans la table '${tableName}'.`);
      return;
    }
    const data = rows.map((row) => {
      const rowData = {};
      for (const column in row) {
        rowData[column] = row[column];
      }
      return JSON.stringify(rowData, null, 2);
    }).join('\n\n');
    res.send(`Données de la table '${tableName}':\n${data}`);
  } catch (error) {
    res.send(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}'.`);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

function verify_token(req, res)
{
  if (!req.headers.authorization) {
    res.status(400).json({msg: "No token, authorization denied"});
    return false;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(token, secretkey);
    if (verify) {
      return true;
    } else {
      res.status(400).send({msg:"Token is not valid"});
      return false;
    }
  } catch (error) {
    res.status(400).send({msg:"Token is not valid"});
    return false;
  }
}

app.post('/register', async (req, res) =>
{
  const firstname = req.body.firstname;
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  if (!firstname || !name || !password || !email) {
    return res.status(400).json({msg: 'Bad parameter'});
  }
  let conn;
  try {
    conn = await db.pool.getConnection();
    const mail_sql = 'SELECT email FROM user WHERE email = ?';
    const check_mail = await conn.query(mail_sql, [email]);
    if (check_mail.length > 0) {
      return res.status(400).json({msg: 'Account already exists'});
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    const sql = 'INSERT INTO user (firstname, name, password, email) VALUES (?, ?, ?, ?)';
    const insert_infos = await conn.query(sql, [firstname, name, hash, email]);
    const id_sql = 'SELECT id FROM user WHERE email = ?';
    const get_id = await conn.query(id_sql, [email]);
    const token = jwt.sign(get_id[0].id, secretkey);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({token: token});
  } catch (err) {
      throw (err);
  } finally {
      if (conn) {
          conn.release();
        }
      }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send({msg: 'Bad parameter'});
  }
  let conn;
  try {
    conn = await db.pool.getConnection();
    const mail_sql = 'SELECT email FROM user WHERE email = ?';
    const password_sql = 'SELECT password FROM user WHERE email = ?';
    const check_mail = await conn.query(mail_sql, [email]);
    const check_password = await conn.query(password_sql, [password]);
    if (check_mail.length > 0 && check_password.length > 0) {
      const result = await bcrypt.compare(password, check_password[0].password);
        if (result) {
          user_email = email;
          const id_sql = 'SELECT id FROM user WHERE email = ?';
          const get_id = await conn.query(id_sql, [email]);
          const token = jwt.sign(get_id[0].id, secretkey);
          res.setHeader('Authorization', `Bearer ${token}`);
          res.status(200).json({token: token});
        } else {
          res.status(400).send({msg: 'Invalid Credentials'});
        }
      } else {
        res.status(400).send({msg: 'Invalid Credentials'});
      }
    } catch (err) {
      throw (err);
    } finally {
      if (conn) {
        conn.release();
      }
    }
});

app.get('/user', async (req, res) => {
  if (verify_token(req, res)) {
    DisplayAllUser(db.pool, 'user', res);
  }
});

/*
app.get('/user', async (req, res) =>
{
  console.log(user_email);
  DisplayUserInfoByEmail(db.pool, 'user', res, user_email);
  DisplayUserDataTableByEmail(db.pool, 'user', user_email);
});
*/

app.get('/user/todos', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  console.log(user_id);
  DisplayUserInfoById(db.pool, 'todo', res, user_id);
});

app.get('/users/:identifier', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  try {
    const identifier = req.params.identifier;
    if (!identifier) {
      return res.status(400).send({msg: 'Bad parameter'});
    }
    conn = await db.pool.getConnection();
    if (identifier.includes('@')) {
      const email_sql = 'SELECT email FROM user WHERE email = ?';
      const check_email = await conn.query(email_sql, [identifier]);
      if (check_email.length > 0) {
      DisplayUserInfoByEmail(db.pool, 'user', res, identifier);
      DisplayUserDataTableByEmail(db.pool, 'user', identifier);
      } else {
        res.status(404).json({ msg: `Not found` });
      }
    } else {
        const id_sql = 'SELECT id FROM user WHERE id = ?';
        const check_id = await conn.query(id_sql, [identifier]);
        if (check_id.length > 0) {
          DisplayUserInfoById(db.pool, 'user', res, identifier);
          DisplayUserDataTableById(db.pool, 'user', identifier);
        } else {
          res.status(404).json({ msg: `Not found` });
        }
    }
  } catch (err) {
    throw (err);
  } finally {
    if (conn) {
        conn.release();
    }
  }
});

app.put('/users/:id', async (req, res) =>
{
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const name = req.body.name;
  if (!verify_token(req, res)) {
    return;
  }
  if (!firstname || !name || !password || !email) {
    return res.status(400).json({ msg: "Bad parameter"});
  }
  let conn;
  try {
    const id = req.params.id;
    conn = await db.pool.getConnection();
    const id_sql = 'SELECT id FROM user WHERE id = ?';
    const check_id = await conn.query(id_sql, [id]);
    if (check_id.length > 0) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      const sql = "UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?";
      const update_info = await conn.query(sql, [email, hash, firstname, name, id]);
      DisplayUserInfoById(db.pool, 'user', res, id);
    } else {
      res.status(404).json({ msg: `Not found` });
    }
  } catch (err) {
    throw (err);
  } finally {
    if (conn) {
        conn.release();
    }
  }
});

app.delete('/users/:id', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  let conn;
  try {
    conn = await db.pool.getConnection();
    const id = req.params.id;
    const id_sql = 'SELECT id FROM user WHERE id = ?';
    const check_id = await conn.query(id_sql, [id]);
    if (check_id.length > 0) {
      const delete_sql = 'DELETE FROM user WHERE id = ?';
      await conn.query(delete_sql, [id]);
      res.status(200).json({ msg: `Successfully deleted record number: ${id}` });
    } else {
      res.status(404).json({ msg: `Not found` });
    }
  } catch (err) {
    throw (err);
  }
  DisplayDataTable(db.pool, 'user');
});

app.get('/todos', async (req, res) =>
{
  if (verify_token(req, res)) {
    displayTableContent(db.pool, 'todo', res);
  }
});

app.get('/todos/:identifier', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  const identifier = req.params.identifier;
  DisplayUserInfoById(db.pool, 'todo', res, identifier);
  DisplayUserDataTableById(db.pool, 'todo', identifier);
});

app.delete('/todos/:id', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  let conn;
  try {
    conn = await db.pool.getConnection();
    const id = req.params.id;
    const id_sql = 'SELECT id FROM user WHERE id = ?';
    const check_id = await conn.query(id_sql, [id]);
    if (check_id.length > 0) {
      const delete_sql = 'DELETE FROM todo WHERE id = ?';
      await conn.query(delete_sql, [id]);
      res.status(200).json({ msg: `Successfully deleted record number: ${id}` });
    } else {
      res.status(404).json({ msg: `Not found` });
    }
  } catch (err) {
    throw (err);
  }
  DisplayDataTable(db.pool, 'todo');
});

app.use((req, res, next) =>
{
  res.status(404).send('Not found');
});

app.use((err, req, res, next) =>
{
  res.status(500).send('Internal server error');
});

app.listen(port, () =>
{
  console.log(`listening at http :// localhost : ${port}`);
});
