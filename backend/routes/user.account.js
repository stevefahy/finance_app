const checkAuth = require("../middleware/check-auth");
const express = require("express");
const UserAccountController = require("../controllers/user.account");

const router = express.Router();

router.get("", UserAccountController.getAccounts);

router.get("/:id", UserAccountController.getAccount);

router.put("/:id", UserAccountController.updateAccount);

router.post("", UserAccountController.createAccount);

router.delete("/:id", checkAuth, UserAccountController.deleteAccount);

module.exports = router;
