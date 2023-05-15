const express = require("express");
const app = express();
const port = 3000;

// app.get("/", (req, res) => {
//     res.send("Hello World !");
// });

// app.get('/name/:nom', (req, res) => {
//     const nom = req.params.nom;
//     res.send(`Bonjour ${nom} !`);
// });

// app.get('/date', (req, res) => {
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     res.send(`${year}-${month}-${day}`);
// });

app.get("/", (req, res) => {
    res.send("Hello World !");
});


app.get('/name/:nom', (req, res) => {
    const nom = req.params.nom;
    res.format({
        'application/json': function() {
            res.send({'msg': `Bonjour ${nom} !`});
        },
        'text/html': function() {
            res.send(`<h1>Bonjour ${nom} !</h1>`);
        }
    })
});


app.listen(port, () => {
    console.log(`listening at http :// localhost : ${port}`);
});