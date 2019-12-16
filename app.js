
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const multerUploads = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const storage = multerUploads.diskStorage({
	destination (req, file, cb){
		cb(null, 'uploads/');
	},
	filename (req, file, cb){
		console.log(file);
		cb(null, file.originalname);
	},
});

const db = require('./config/db');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/upload', (req, res, next) => {
	const upload = multerUploads({ storage }).single('name-of-input-key');
	upload(req, res, function (err){
		if (err) {
			return res.send(err);
		}
		console.log('file uploaded to server');
		console.log(req.file);

		cloudinary.config({
			cloud_name: 'petar',
			api_key: '171419394947841',
			api_secret: 'oekllQlFBDo17MAA2t54w5r4nBQ',
		});

		const path = req.file.path;
		const uniqueFilename = new Date().toISOString();

		cloudinary.uploader.upload(
			path,
			{ public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
			function (error, image){
				if (err) return res.send(error);
				console.log('file uploaded to Cloudinary');
				fs.unlinkSync(path);
				res.json(image);
			},
		);
	});
});

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
