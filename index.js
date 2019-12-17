const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const UserauthRoute = require('./api/routes/authroute')

const Port = process.env.PORT 

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', UserauthRoute)

app.use(express.json());




// eslint-disable-next-line no-console
db()
	.then(() => {
		app.listen(Port, () => console.log(`Server running on port ${Port}`));
	})
	.catch((err) => {
		console.log(err);
	});
