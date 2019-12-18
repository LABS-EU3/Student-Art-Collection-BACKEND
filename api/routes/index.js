const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const UserauthRoute = require('./authroute')



const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', UserauthRoute)

app.use(function errors(err, req, res, next) {
	return res.status(500).json({ err });
})

module.exports = app;