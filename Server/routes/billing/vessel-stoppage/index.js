let baseAddress = '/api/vessel-stoppage'
module.exports = app => {
    app.use(`${baseAddress}/invoice`, require('./invoice'));
    app.use(`${baseAddress}/tariff`, require('./tariff'));
}; 
