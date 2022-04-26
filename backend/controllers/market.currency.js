const request = require('request');

exports.loadCurrency = (req, res) => {
  let currency_1 = req.body.currency_1;
  let currency_2 = req.body.currency_2;
  const options = {
    method: 'GET',
    url: process.env.CURRENCY_URL,
    qs: { to_currency: currency_2, function: 'CURRENCY_EXCHANGE_RATE', from_currency: currency_1 },
    headers: {
      'x-rapidapi-key': process.env.C_XRAPIDAPIKEY,
      'x-rapidapi-host': process.env.C_XRAPIDAPIHOST,
      useQueryString: true
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      // Return a general error
      return res.status(401).json({
        message: "mcurrency_error_general"
      });
    }
    let body_j = JSON.parse(body);
    if (body_j["Error Message"]) {
      // Return a general error
      return res.status(401).json({
        message: "mcurrency_error_general",
        params: body_j["Error Message"]
      });
    }
    // Currency Exchange rate not found
    if (!body_j["Realtime Currency Exchange Rate"]) {
      // Return currency error
      return res.status(401).json({
        message: "mcurrency_error_nocurrency_found",
        params: currency_1 + ' To ' + currency_2
      });
    }
    // Otherwise return the currency data.
    res.status(201).json({
      message: "Currency loaded successfully",
      currency: {
        ...JSON.parse(body)
      }
    });
  });
}
