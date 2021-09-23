'use strict'

let express = require('express');
let app = express();

/* Setup routing paths */
let auth = require('./app/api/auth.js');
let status = require('./app/api/status.js');

/* Parse form-data for use with POST requests*/
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/status', status);

/* Setup static resources */
app.use(express.static(__dirname  + '/public'));

const PORT  = process.env.PORT || 3050;
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`));
