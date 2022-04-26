const express = require("express");

const marketCurrencyController = require("../controllers/market.currency");

const router = express.Router();

router.post("", marketCurrencyController.loadCurrency);

module.exports = router;
