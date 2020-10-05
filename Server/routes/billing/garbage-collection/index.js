let baseAddress = '/api/billing/garbage-collection'
module.exports = app => {
    app.use(`${baseAddress}/invoice`, require('./invoice'));
    app.use(`${baseAddress}/tariff`, require('./tariff'));
}; 

