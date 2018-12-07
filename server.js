const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const cleanDir = require('./utilities/cleanDir');
const colorsClassification = require('./routes/colorsClassification/colorsClassification.js');
const edison = require('./routes/edison/edison.js');


//create a scheduler and let it run for every hour to deleted file older than 1 hour
cleanDir('./client/public/tmp', '0 0 */1 * * *', 1000 * 60 * 60);


const app = express();
const port = process.env.PORT || 5000;
//to support JSON-encoded bodies
app.use(bodyParser.json());
//to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

//setting up logger
app.use(morgan('dev'));

app.use('/segmentation/colorsClassification', colorsClassification);
app.use('/segmentation/edison', edison);


let v = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

v.setTimeout(9999999);
v.timeout=9999999;