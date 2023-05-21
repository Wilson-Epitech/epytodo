const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const globals = require('../../middleware/global.js');
const app = express.Router();

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
    const token = jwt.sign(get_id[0].id, process.env.SECRET);
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
    const check_password = await conn.query(password_sql, [email]);
    const id_sql = 'SELECT id FROM user WHERE email = ?'
    const check_id = await conn.query(id_sql, [email]);
    if (check_mail.length > 0 && check_password.length > 0) {
      const result = await bcrypt.compare(password, check_password[0].password);
        if (result) {
          globals.setLoggedUserEmail(email);
          globals.setLoggedUserId(check_id[0].id);
          const id_sql = 'SELECT id FROM user WHERE email = ?';
          const get_id = await conn.query(id_sql, [email]);
          const token = jwt.sign(get_id[0].id, process.env.SECRET);
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

module.exports = app;