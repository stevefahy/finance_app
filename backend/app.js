const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const app = express();

var multer = require('multer');
var upload = multer();
app.use(upload.single());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const marketStocksRoutes = require("./routes/market.stocks");
const marketCurrencyRoutes = require("./routes/market.currency");
const userStocksRoutes = require("./routes/user.stocks");
const userRoutes = require("./routes/user");
const userTaxRoutes = require("./routes/user.tax");
const userAccountRoutes = require("./routes/user.account");

const dburl = process.env.DBURL;

const dboptions = JSON.parse(process.env.DBOPTIONS);

mongoose
  .connect(
    dburl, dboptions
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.log(err);
  });

app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/market-stocks", marketStocksRoutes);
app.use("/api/market-currency", marketCurrencyRoutes);
app.use("/api/user-stocks", userStocksRoutes);
app.use("/api/user-tax", userTaxRoutes);
app.use("/api/user-account", userAccountRoutes);
app.use("/api/user", userRoutes);

const MIN = -99;
const MAX = 900;

app.get('/api/data', (req, res) => {
  const index = parseInt(req.query.index, 10);
  const count = parseInt(req.query.count, 10);
  if (isNaN(index) || isNaN(count)) {
    return res.send([]);
  }
  const start = Math.max(MIN, index);
  const end = Math.min(index + count - 1, MAX);
  if (start > end) {
    return res.send([]);
  }
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push({ id: i, text: 'item #' + i });
  }
  res.send(result);
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"))
});

module.exports = app;
