let baseAddress = '/api/auth'
module.exports = app => {
    app.use(`${baseAddress}/user`, require('./user'));
    app.use(`${baseAddress}/userType`, require('./userType'));
    app.use(`${baseAddress}/authentication`, require('./authentication'));
}; 
