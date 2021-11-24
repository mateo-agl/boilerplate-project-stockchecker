'use strict';
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const stockHandler = require('../mongoose').stockHandler;

module.exports = function(app) {
  app.route('/api/stock-prices')
    .get((req, res, next) => {
      let stock = req.query.stock;
      if (typeof stock == 'object') return next();
      stock = stock.toUpperCase();
      const ip = req.ip, like = req.query.like, salt = 7,
        url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
      xhr.onload = () => {
        const price = JSON.parse(xhr.responseText).latestPrice;
        if (!price) return res.json({ stockData: { error: "external source error" } });
        stockHandler(ip, stock, like, salt, (err, likes) => {
          if (err) return console.error(err);
          res.json({ stockData: { stock: stock, price: price, likes: likes } });
        });
      }
      xhr.open('GET', url);
      xhr.send();
    }, (req, res) => {
      const ip = req.ip, stockArr = req.query.stock, like = req.query.like, salt = 7;
      const objs = Promise.all(stockArr.map(stock => {
        const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
        stock = stock.toUpperCase();
        return new Promise((resolve) => {
          xhr.onload = () => {
            const price = JSON.parse(xhr.responseText).latestPrice;
            if (!price) return resolve({ error: "external source error" });
            stockHandler(ip, stock, like, salt, (err, likes) => {
              if (err) return console.error(err);
              resolve({ stock: stock, price: price, rel_likes: likes });
            });
          }
          xhr.open('GET', url, false);
          xhr.send();
        });
      }));
      objs.then(arr => {
        if (!arr[0].rel_likes || !arr[1].rel_likes) return res.json({ stockData: arr });
        const rel_likes = arr[0].rel_likes - arr[1].rel_likes;
        arr[0].rel_likes = rel_likes;
        arr[1].rel_likes = -rel_likes;
        res.json({ stockData: arr });
      });
    });
};