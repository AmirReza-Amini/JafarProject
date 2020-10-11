let baseAddress = '/api/billing/vessel-stoppage'
module.exports = app => {
    app.use(`${baseAddress}/invoice`, require('./invoice'));
    app.use(`${baseAddress}/tariff`, require('./tariff'));
}; 
