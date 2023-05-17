const express = require("express");
const db = require('./db');
const app = express();
const port = 3000;
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

app.post('/register', async (req, res) =>
{
    const firstname = req.body.firstname;
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    try {
        const sql = 'INSERT INTO user (firstname, name, password, email) VALUES (?, ?, ?, ?)';
        const result = await db.pool.query(sql, [firstname, name, password, email]);
        res.send('GG tu es inscrit');
    } catch (err) {
        throw err;
    }
    DisplayDataTable(db.pool, 'user');
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

app.get('/user', async (req, res) => {
    DisplayAllUser(db.pool, 'user', res);
});

app.use((req, res, next) => {
    res.status(404).send('404 Not Found.');
});

app.use((err, req, res, next) => {
    res.status(500).send('Internal Server Error.');
});

app.listen(port, () => {
    console.log(`listening at http :// localhost : ${port}`);
});
