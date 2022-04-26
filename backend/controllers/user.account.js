const UserAccount = require("../models/user.account");

exports.createAccount = (req, res) => {
  if (process.env.PRODUCTION !== "true") {
    url = req.protocol + "://" + req.get("host");
  }
  const useraccount = new UserAccount({
    name: req.body.name,
    balance: req.body.balance,
    currency: req.body.currency,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    user: req.body.user
  });
  useraccount.save()
    .then(createdAccount => {
      res.status(201).json({
        message: "Account added successfully",
        account: {
          ...createdAccount.toObject(),
          id: createdAccount._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a account failed!"
      });
    });
};

exports.getAccounts = (req, res) => {
  UserAccount.find({ user: req.query.userId })
    .then(documents => {
      fetchedAccounts = documents;
      res.status(200).json({
        message: "User Accounts fetched successfully!",
        accounts: fetchedAccounts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User Accounts failed!"
      });
    });
}

exports.getAccount = (req, res) => {
  UserAccount.find({ _id: req.params.id })
    .then(documents => {
      fetchedAccount = documents;
      res.status(200).json({
        message: "User Account fetched successfully!",
        accounts: fetchedAccount
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User Account failed!"
      });
    });
}

exports.updateAccount = (req, res, next) => {
  const account = new UserAccount({
    _id: req.params.id,
    name: req.body.name,
    balance: req.body.balance,
    currency: req.body.currency,
    date_start: req.body.date_start,
    date_end: req.body.date_end,
    user: req.body.user
  });
  UserAccount.updateOne({ _id: req.params.id, user: req.body.user }, account)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "Account Update successful!"
        });
      } else {
        res.status(401).json({ message: "Account Update Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate account!"
      });
    });
};

exports.deleteAccount = (req, res, next) => {
  UserAccount.deleteOne({ _id: req.params.id, user: req.userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Account Deletion successful!" });
      } else {
        res.status(401).json({ message: "Account Deletion Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting Account failed!"
      });
    });
};
