'use strict'

/* Setup routing paths */
let express = require('express');
let app = express();

let auth = require('./app/api/auth.js');
let status = require('./app/api/status.js');
let device = require('./app/api/device.js');
let sensor = require('./app/api/device/sensor.js');

/* Parse form-data for use with POST requests*/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/status', status);
app.use('/api/device', device);
app.use('/api/device/sensor', sensor);

/* Setup static resources */
app.use(express.static(__dirname  + '/public'));

const PORT  = process.env.PORT || 3050;
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`));
