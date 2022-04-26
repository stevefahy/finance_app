const checkAuth = require("../middleware/check-auth");

const express = require("express");

const UserStockController = require("../controllers/user.stocks");

const router = express.Router();

router.get("", UserStockController.getStocks);

router.get("/:id", UserStockController.getStock);

router.put("/:id", UserStockController.updateStock);

router.post("", UserStockController.createStock);

router.delete("/:id", checkAuth, UserStockController.deleteStock);

module.exports = router;
