const express = require("express");

const MarketStockController = require("../controllers/market.stocks");

const router = express.Router();

router.post("", MarketStockController.getStock);

module.exports = router;
