'use strict'

let express = require('express');
let app = express();

/* Setup routing modules */
let auth = require('./app/auth.js');
app.use('/auth', auth);

/* Setup static resources */
app.use(express.static(__dirname  + '/public'));

const PORT  = process.env.PORT || 3050;
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`));
