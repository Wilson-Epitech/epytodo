const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const globals = require('../../middleware/global.js');
const app = express.Router();

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
        created_at: row.created_at,
        firstname: row.firstname,
        name: row.name
      };
      return JSON.stringify(user, null, 2);
    }).join('\n\n');
    res.send(`${data}`);
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
        created_at: row.created_at,
        firstname: row.firstname,
        name: row.name
      };
      return JSON.stringify(user, null, 2);
    }).join('\n\n');
    res.send(`${data}`);
  } catch (error) {
    res.send(`Une erreur s'est produite lors de l'affichage des données de la table '${tableName}'.`);
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

function verify_token(req, res)
{
  if (!req.headers.authorization) {
    res.status(400).json({msg: "No token, authorization denied"});
    return false;
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(token, process.env.SECRET);
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

app.get('/user', async (req, res) =>
{
    if (!verify_token(req, res)) {
        return;
    }
    const user_email = globals.getLoggedUserEmail();
    DisplayUserInfoByEmail(db.pool, 'user', res, user_email);
    DisplayUserDataTableByEmail(db.pool, 'user', user_email);
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
});

module.exports = app;