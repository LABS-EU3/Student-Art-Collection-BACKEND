

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');




const db = require('./config/db');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));



app.use('/', adminRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const port = process.env.PORT || 3000;

db()
	.then(() => {
		app.listen(port, () => console.log(`Server running on port ${port}`));
	})
	.catch((err) => {
		console.log(err);
	});
