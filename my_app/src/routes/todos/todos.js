const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const globals = require('../../middleware/global.js');
const app = express.Router();

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
        user_id : row.user_id,
        status : row.status,
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

async function DisplayTodoInfoById(pool, tableName, res, id)
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
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        due_time: row.due_time,
        user_id: row.user_id,
        status: row.status
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

async function DisplayTodoInfoByUserId(pool, tableName, res, user_id)
{
  let conn;
  try {
    conn = await pool.getConnection();
    const sql = `SELECT * FROM ${tableName} WHERE user_id = ?`;
    const rows = await conn.query(sql, [user_id]);
    if (rows.length === 0) {
      res.send(`Aucune donnée trouvée dans la table '${tableName}'.`);
      return;
    }
    const data = rows.map((row) => {
      const user = {
        id: row.id,
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        due_time: row.due_time,
        user_id: row.user_id,
        status: row.status
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

async function DisplayLastTodoCreated(pool, tableName, res, user_id)
{
  let conn;
  try {
    conn = await pool.getConnection();
    const found_last_id_sql = `SELECT MAX(id) AS max_number FROM ${tableName} WHERE user_id = ?`;
    const last_todo_id = await conn.query(found_last_id_sql, [user_id]);
    const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
    const rows = await conn.query(sql, [last_todo_id[0].max_number]);
    if (rows.length === 0) {
      res.send(`Aucune donnée trouvée dans la table '${tableName}'.`);
      return;
    }
    const data = rows.map((row) => {
      const user = {
        id: row.id,
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        due_time: row.due_time,
        user_id: row.user_id,
        status: row.status
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
      const rowData = {
        id: row.id,
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        due_time: row.due_time,
        user_id: row.user_id,
        status: row.status
      };
      return JSON.stringify(rowData, null, 2);
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

app.get('/todos', async (req, res) =>
{
  if (verify_token(req, res)) {
    displayTableContent(db.pool, 'todo', res);
  }
});

app.get('/user/todos', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  const id = globals.getLoggedUserId()  ;
  DisplayTodoInfoById(db.pool, 'todo', res, id);
});

app.get('/todos/:identifier', async (req, res) =>
{
  if (!verify_token(req, res)) {
    return;
  }
  const identifier = req.params.identifier;
  DisplayTodoInfoById(db.pool, 'todo', res, identifier);
  DisplayUserDataTableById(db.pool, 'todo', identifier);
});

app.post('/todos', async (req, res) =>
{
  if (!verify_token(req, res)) {
      return;
  }
  const title = req.body.title;
  const description = req.body.description;
  const due_time = req.body.due_time;
  const user_id = req.body.user_id;
  const todo_status = req.body.status;
  if (!title || !description || !due_time || !user_id || !todo_status) {
    return res.status(400).json({ msg: "Bad parameter"});
  }
  const not_started_str = "not started";
  const todo_str = "todo";
  const in_progress_str = "in progress";
  const done_str = "done";
  if (not_started_str.localeCompare(todo_status) != 0 && todo_str.localeCompare(todo_status) != 0
  && in_progress_str.localeCompare(todo_status) != 0 && done_str.localeCompare(todo_status) != 0) {
    return res.status(400).json({ msg: "Bad parameter"});
  }
  try {
    const id_sql = 'SELECT id FROM user WHERE id = ?';
    const check_id = await db.pool.query(id_sql, [user_id]);
    if (check_id.length === 0) {
      return res.status(404).json({ msg: `Not found` });
    }
    const sql = 'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)';
    const result = await db.pool.query(sql, [title, description, due_time, user_id, todo_status]);
  } catch (err) {
    throw err;
  }
  DisplayLastTodoCreated(db.pool, 'todo', res, user_id);
  DisplayDataTable(db.pool, 'todo');
});

app.put('/todos/:id', async (req, res) =>
{
  if (!verify_token(req, res)) {
      return;
  }
  const title = req.body.title;
  const description = req.body.description;
  const due_time = req.body.due_time;
  const user_id = req.body.user_id;
  const todo_status = req.body.status;
  if (!title || !description || !due_time || !user_id || !todo_status) {
    return res.status(400).json({ msg: "Bad parameter"});
  }
  const not_started_str = "not started";
  const todo_str = "todo";
  const in_progress_str = "in progress";
  const done_str = "done";
  if (not_started_str.localeCompare(todo_status) != 0 && todo_str.localeCompare(todo_status) != 0
  && in_progress_str.localeCompare(todo_status) != 0 && done_str.localeCompare(todo_status) != 0) {
    return res.status(400).json({ msg: "Bad parameter"});
  }
  try {
    const todo_id = req.params.id;
    const id_sql1 = 'SELECT id FROM todo WHERE id = ?';
    const check_id1 = await db.pool.query(id_sql1, [todo_id]);
    if (check_id1.length === 0) {
      return res.status(400).json({ msg: 'Not found'});
    }
    const id_sql2 = 'SELECT id FROM user WHERE id = ?';
    const check_id2 = await db.pool.query(id_sql2, [user_id]);
    if (check_id2.length === 0) {
      return res.status(404).json({ msg: `Not found` });
    }
    const sql = 'UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?';
    const result = await db.pool.query(sql, [title, description, due_time, user_id, todo_status, todo_id]);
    DisplayTodoInfoById(db.pool, 'todo', res, todo_id);
  } catch (err) {
    throw err;
  }
  DisplayDataTable(db.pool, 'todo');
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
    const id_sql = 'SELECT id FROM todo WHERE id = ?';
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

module.exports = app;