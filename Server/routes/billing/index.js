module.exports = app => {
    require('./garbage-collection')(app);
    require('./vessel-stoppage')(app);
}; 
