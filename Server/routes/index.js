const errorLoger = require('../middleware/error-loger')

module.exports = app => {
  app.use('/', require('./home'));
  require('./basic-info')(app);
  require('./authentication')(app);
  require('./billing')(app);
  app.use('/app/log', require('./log'));
  app.use(errorLoger);
}; 
