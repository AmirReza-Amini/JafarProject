require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express()
//const serverHttps = require('https').createServer(app);
const serverHttp = require('http').createServer(app);
const setting = require('./app-setting')
const path = require('path')
var fs = require('fs');

app.use(cors())
app.use(express.json());
app.use(express.static(__dirname + '/www'));
app.use(require('./middleware/log'))
app.use(require('./bootstrap/init'));
// var options = {
//   key: fs.readFileSync('./util/https/client-key.pem'),
//   cert: fs.readFileSync('./util/https/client-cert.pem')
// };
require('./bootstrap/mongodb');
require('./routes')(app);

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname + '/www/index.html'));
// });

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

//uncomment if you mind to have realtime actions
//require('./messaging/socket')(app, server); 

serverHttp.listen((setting.portNo), () => {
  console.log(`Http Server started on ${setting.portNo} --- ${new Date()}`);
});

//serverHttps.listen((options,4100), () => {
 // console.log(`Https Server started on 4100 --- ${new Date()}`);
//});