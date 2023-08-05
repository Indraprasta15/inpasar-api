const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const db = require("./models/bundle.model");

app.use("/public", express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

db.sequelize.sync({ force: false });

const produkRouter = require("./routes/produk");
app.use("/produk", produkRouter);

const kategoriRouter = require("./routes/kategori");
app.use("/kategori", kategoriRouter);

const frontendRouter = require("./routes/frontend");
app.use("/frontend", frontendRouter);

const transaksiRouter = require("./routes/transaksi");
app.use("/transaksi", transaksiRouter);

module.exports = app;
