const request = require('request');

exports.getStock = (req, res) => {
  let tickers = req.body.ticker;
  const options = {
    method: 'GET',
    url: process.env.STOCKURL_1,
    qs: { symbols: tickers },
    headers: {
      'X-API-KEY': process.env.XAPIKEY,
      useQueryString: true
    }
  };
  request(options, function (error, response, body) {
    let ticker_array = tickers.split(',');
    let body_j = { ...JSON.parse(body) }
    if (error) {
      // Return a general error
      return res.status(401).json({
        message: "mstock_error_general"
      });
    }
    if (body_j.message == 'Limit Exceeded') {
      return res.status(401).json({
        message: "mstock_error_limit"
      });
    }
    let stocks_found = [];
    let stocks_not_found = [];
    for (let i = 0; i < ticker_array.length; i++) {
      let found = body_j.quoteResponse.result.filter(
        (a) => a.symbol === ticker_array[i].toUpperCase()
      );
      if (found.length > 0) {
        stocks_found.push(found[0]);
      } else {
        stocks_not_found.push(ticker_array[i]);
      }
    }
    // Return an error if any stocks are not found
    if (stocks_not_found.length > 0) return res.status(401).json({
      message: "mstock_error_no_stock_found",
      params: stocks_not_found
    });
    // Al stocks found. Return the stocks
    res.status(201).json({
      message: "Stock loaded successfully",
      stock: {
        ...JSON.parse(body)
      }
    });
  });
}
