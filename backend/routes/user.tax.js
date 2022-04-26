const checkAuth = require("../middleware/check-auth");
const express = require("express");
const UserTaxController = require("../controllers/user.tax");

const router = express.Router();

router.get("", UserTaxController.getTaxs);

router.get("/:id", UserTaxController.getTax);

router.put("/:id", UserTaxController.updateTax);

router.post("", UserTaxController.createTax);

router.delete("/:id", checkAuth, UserTaxController.deleteTax);

module.exports = router;
