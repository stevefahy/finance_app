const mongoose = require("mongoose");

const usertaxSchema = mongoose.Schema({
  tax_type: { type: String, required: false },
  rate: { type: String, required: false },
  credit: { type: String, required: false },
  date_start: { type: String, required: false },
  date_end: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("UserTax", usertaxSchema);
