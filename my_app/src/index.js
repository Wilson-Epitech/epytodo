const express = require("express");
const db = require('./db');
const app = express();
const port = 3000;
let user_email = 'NULL';
var bodyParser = require('body-parser');

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

app.post('/register', async (req, res) => {
  let conn;
  try {
      conn = await db.pool.getConnection();
      const firstname = req.body.firstname;
      const name = req.body.name;
      const password = req.body.password;
      const email = req.body.email;
      const mail_sql = 'SELECT email FROM user WHERE email = ?';
      const check_mail = await conn.query(mail_sql, [email]);
      if (check_mail.length > 0) {
          res.send("Account already exists");
      } else {
          const sql = 'INSERT INTO user (firstname, name, password, email) VALUES (?, ?, ?, ?)';
          const insert_infos = await conn.query(sql, [firstname, name, password, email]);
          res.send("GG tu es inscrit");
      }
  } catch (err) {
      throw err;
  } finally {
      if (conn) {
          conn.release();
      }
  }
});

app.post('/login', async (req, res) => {
  let conn;
  try {
      conn = await db.pool.getConnection();
      const email = req.body.email;
      const password = req.body.password;
      const mail_sql = 'SELECT email FROM user WHERE email = ?';
      const password_sql = 'SELECT password FROM user WHERE password = ?';
      const check_mail = await conn.query(mail_sql, [email]);
      const check_password = await conn.query(password_sql, [password]);
      if (check_mail.length > 0 && check_password.length > 0) {
          res.send("Connecté bg");
          user_email = email;
      } else {
          res.send("Informations incorrectes bg");
      }
  } catch (err) {
      throw(err);
  } finally {
      if (conn) {
          conn.release();
      }
  }
});

app.delete('/users/:id', async (req, res) =>
{
  let conn;
  try {
    conn = await db.pool.getConnection();
    const id = req.params.id;
    const sql = 'DELETE FROM user WHERE id = ?';
    console.log(id);
    await db.pool.query(sql, [id]);
    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    throw err;
  }
  DisplayDataTable(db.pool, 'user');
});

app.delete('/todos/:id', async (req, res) =>
{
  let conn;
  try {
    conn = await db.pool.getConnection();
    const id = req.params.id;
    const sql = 'DELETE FROM todo WHERE id = ?';
    console.log(id);
    await db.pool.query(sql, [id]);
    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    throw err;
  }
  DisplayDataTable(db.pool, 'todo');
});

async function DisplayAllUser(pool, tableName, res) {
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

async function DisplayUserInfoByEmail(pool, tableName, res, user_email) {
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


async function DisplayUserInfoById(pool, tableName, res, id) {
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

async function displayTableContent(pool, tableName, res) {
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

app.get('/user', async (req, res) => {
  console.log(user_email);
  DisplayUserInfoByEmail(db.pool, 'user', res, user_email);
  DisplayUserDataTableByEmail(db.pool, 'user', user_email);
});

app.get('/todos', async (req, res) =>
{
    displayTableContent(db.pool, 'todo', res);
});

app.get('/users/:identifier', async (req, res) => {
  const identifier = req.params.identifier;
  if (identifier.includes('@')) {
    DisplayUserInfoByEmail(db.pool, 'user', res, identifier);
    DisplayUserDataTableByEmail(db.pool, 'user', identifier);
  } else {
    console.log(identifier);
    DisplayUserInfoById(db.pool, 'user', res, identifier);
    DisplayUserDataTableById(db.pool, 'user', identifier);
  }
});

app.get('/user/todos', async (req, res) => {
  console.log(user_id);
  DisplayUserInfoById(db.pool, 'todo', res, user_id);
});


app.get('/todos/:identifier', async (req, res) => {
  const identifier = req.params.identifier;
  DisplayUserInfoById(db.pool, 'todo', res, identifier);
  DisplayUserDataTableById(db.pool, 'todo', identifier);
});

app.get('/user', async (req, res) => {
    DisplayAllUser(db.pool, 'user', res);
});

app.use((req, res, next) => {
    res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
    res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`listening at http :// localhost : ${port}`);
});
