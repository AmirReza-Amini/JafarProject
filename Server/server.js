require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express()
const { constants } = require('crypto')
 const setting = require('./app-setting')
const path = require('path')

var fs = require('fs');
app.use(cors())
app.use(express.json());
app.use(express.static(__dirname + '/www'));
app.use(require('./middleware/log'))
app.use(require('./bootstrap/init'));

const serverHttp = require('http').createServer(app);
const serverHttps = require('https').createServer({
  key: fs.readFileSync("./keys/client-key.pem"),
  cert: fs.readFileSync("./keys/client-cert.pem"),
    secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
    passphrase: 'PASSWORD'
  },app); 



require('./bootstrap/mongodb');
require('./routes')(app);


app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

serverHttp.listen((setting.portNo), () => {
  console.log(`Http Server started on ${setting.portNo} --- ${new Date()}`);
});

serverHttps.listen((4100), () => {
  console.log(`Https Server started on 4100 --- ${new Date()}`);
});