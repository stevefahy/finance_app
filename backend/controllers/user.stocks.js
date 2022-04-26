const UserStock = require("../models/user.stock");

exports.createStock = (req, res) => {

  if (process.env.PRODUCTION !== "true") {
    url = req.protocol + "://" + req.get("host");
  }
  const userstock = new UserStock({
    ticker: req.body.ticker,
    price: req.body.price,
    price_close: req.body.price_close,
    currency: req.body.currency,
    forex: req.body.forex,
    forex_close: req.body.forex_close,
    amount: req.body.amount,
    fee: req.body.fee,
    dividend_yield: req.body.dividend_yield,
    status: req.body.status,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    user: req.body.user
  });
  userstock.save()
    .then(createdStock => {
      res.status(201).json({
        message: "User Stock added successfully",
        stock: {
          ...createdStock.toObject(),
          id: createdStock._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a User stock failed!"
      });
    });
};

exports.getStocks = (req, res) => {
  UserStock.find({ user: req.query.userId })
    .then(documents => {
      fetchedStocks = documents;
      res.status(200).json({
        message: "User Stocks fetched successfully!",
        stocks: fetchedStocks
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User stocks failed!"
      });
    });
}

exports.getStock = (req, res) => {
  UserStock.find({ _id: req.params.id })
    .then(documents => {
      fetchedStocks = documents;
      res.status(200).json({
        message: "User Stock fetched successfully!",
        stocks: fetchedStocks
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User stock failed!"
      });
    });
}

exports.updateStock = (req, res, next) => {
  const stock = new UserStock({
    _id: req.body._id,
    ticker: req.body.ticker,
    price: req.body.price,
    price_close: req.body.price_close,
    currency: req.body.currency,
    forex: req.body.forex,
    forex_close: req.body.forex_close,
    amount: req.body.amount,
    fee: req.body.fee,
    dividend_yield: req.body.dividend_yield,
    status: req.body.status,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    user: req.body.user
  });

  UserStock.updateOne({ _id: req.params.id, user: req.body.user }, stock)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "Stock Update successful!"
        });
      } else {
        res.status(401).json({ message: "Stock Update Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate stock!"
      });
    });
};

exports.deleteStock = (req, res, next) => {
  UserStock.deleteOne({ _id: req.params.id, user: req.userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Stock Deletion successful!" });
      } else {
        res.status(401).json({ message: "Stock Deletion Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting stock failed!"
      });
    });
};
