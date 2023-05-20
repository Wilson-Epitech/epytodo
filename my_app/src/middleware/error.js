const express = require("express");
const app = express.Router();

app.use((req, res, next) =>
{
  res.status(404).json({msg: 'Not found'});
});

app.use((err, req, res, next) =>
{
  res.status(500).json({msg: 'Internal server error'});
});

module.exports = app;