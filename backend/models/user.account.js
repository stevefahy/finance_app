const mongoose = require("mongoose");

const useraccountSchema = mongoose.Schema({
  name: { type: String, required: false },
  balance: { type: String, required: false },
  currency: { type: String, required: false },
  date_start: { type: String, required: false },
  date_end: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("UserAccount", useraccountSchema);
