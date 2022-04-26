const mongoose = require("mongoose");

const userstockSchema = mongoose.Schema({
  ticker: { type: String, required: false },
  price: { type: String, required: false },
  price_close: { type: String, required: false },
  currency: { type: String, required: false },
  forex: { type: String, required: false },
  forex_close: { type: String, required: false },
  amount: { type: String, required: false },
  fee: { type: String, required: false },
  dividend_yield: { type: String, required: false },
  status: { type: String, required: false },
  date_start: { type: String, required: false },
  date_end: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("UserStock", userstockSchema);
