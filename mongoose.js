const mongoose = require('mongoose');
const hashAndPushIP = require('./ipHandler').hashAndPushIP;
const compareMultipleIPs = require('./ipHandler').compareMultipleIPs;

const stockSchema = new mongoose.Schema({
  stock: String,
  ips: [String]
});

const Stocks = mongoose.model('Stocks', stockSchema);

const stockHandler = (ip, stock, like, salt, done) => {
  Stocks.findOne({ stock: stock }, async (err, doc) => {
    if (err) return console.error(err);
    if (!doc) {
      const newStock = new Stocks({ stock: stock, ips: [] });
      if (like === 'true') await hashAndPushIP(newStock, ip, salt);
      await newStock.save();
      try {
        done(null, newStock.ips.length);
      } catch (e) {
        console.error(e);
      }
      return;
    }
    if (like === 'true') {
      const hasIP = await compareMultipleIPs(doc.ips.length, doc.ips, ip);
      if (!hasIP) {
        await hashAndPushIP(doc, ip, salt);
        await doc.save();
      }
    }
    try {
      done(null, doc.ips.length);
    } catch (e) {
      console.error(e);
    }
  });
}

exports.stockHandler = stockHandler;