
const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const UserauthRoute = require('./api/routes/authroute')

const Port = process.env.PORT || 9000

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', UserauthRoute)

app.use(express.json());




// eslint-disable-next-line no-console
db()
	.then(() => {
		console.log('database is connected')
	})
	.catch((err) => {
		console.log(err);
	});

app.use(function errors(err, req, res, next) {
	return res.status(500).json({ err });
})

app.listen(Port, () => console.log(`Server running on port ${Port}`));
