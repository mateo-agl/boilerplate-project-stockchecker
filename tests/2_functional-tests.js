const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Viewing one stock', (done) => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body.stockData, ['stock', 'price', 'likes']);
        done();
      });
  });
  test('Viewing one stock and liking it', (done) => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body.stockData, ['stock', 'price', 'likes']);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });
  test('Viewing the same stock and liking it again', (done) => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body.stockData, ['stock', 'price', 'likes']);
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });
  test('Viewing two stocks', (done) => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body.stockData[0], ['stock', 'price', 'rel_likes']);
        assert.hasAllKeys(res.body.stockData[1], ['stock', 'price', 'rel_likes']);
        done();
      });
  });
  test('Viewing two stocks and liking them', (done) => {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body.stockData[0], ['stock', 'price', 'rel_likes']);
        assert.hasAllKeys(res.body.stockData[1], ['stock', 'price', 'rel_likes']);
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[0].rel_likes, 0);
        done();
      });
  });
});
