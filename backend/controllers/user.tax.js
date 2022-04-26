const UserTax = require("../models/user.tax");

exports.createTax = (req, res) => {
  if (process.env.PRODUCTION !== "true") {
    url = req.protocol + "://" + req.get("host");
  }
  const usertax = new UserTax({
    tax_type: req.body.tax_type,
    rate: req.body.rate,
    credit: req.body.credit,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    user: req.body.user
  });
  usertax.save()
    .then(createdTax => {
      res.status(201).json({
        message: "Tax added successfully",
        tax: {
          ...createdTax.toObject(),
          id: createdTax._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a tax failed!"
      });
    });
};

exports.getTaxs = (req, res) => {
  UserTax.find({ user: req.query.userId })
    .then(documents => {
      fetchedTaxs = documents;
      res.status(200).json({
        message: "User Taxs fetched successfully!",
        taxs: fetchedTaxs
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User Taxs failed!"
      });
    });
}

exports.getTax = (req, res) => {
  UserTax.find({ _id: req.params.id })
    .then(documents => {
      fetchedTax = documents;
      res.status(200).json({
        message: "User Tax fetched successfully!",
        taxs: fetchedTax
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User Tax failed!"
      });
    });
}

exports.updateTax = (req, res, next) => {
  const tax = new UserTax({
    _id: req.body._id,
    tax_type: req.body.tax_type,
    rate: req.body.rate,
    credit: req.body.credit,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    user: req.body.user
  });
  UserTax.updateOne({ _id: req.params.id, user: req.body.user }, tax)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "Tax Update successful!"
        });
      } else {
        res.status(401).json({ message: "Tax Update Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate tax!"
      });
    });
};

exports.deleteTax = (req, res, next) => {
  UserTax.deleteOne({ _id: req.params.id, user: req.userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Tax Deletion successful!" });
      } else {
        res.status(401).json({ message: "Tax Deletion Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting Tax failed!"
      });
    });
};
