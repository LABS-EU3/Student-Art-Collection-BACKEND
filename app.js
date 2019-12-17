const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const multerUploads = require('multer');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/user');

const { config, cloudinaryConfig, uploader } = require('./config/cloudinaryConfig');

const storage = multerUploads.diskStorage({
	destination (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename (req, file, cb) {
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

app.post('/upload/:id', (req, res, next) => {
	const upload = multerUploads({ storage }).single('name-of-input-key');
	upload(req, res, function (err){
		if (err) {
			return res.send(err);
		}
		cloudinary.config({
			cloud_name: cloudinaryConfig().cloud_name,
			api_key: cloudinaryConfig().api_key,
			api_secret: cloudinaryConfig().api_secret,
		});

		const path = req.file.path;
		const uniqueFilename = new Date().toISOString();

		cloudinary.uploader.upload(path, { public_id: `blog/${uniqueFilename}`, tags: `blog` }, async function (
			error,
			image,
		){
			if (err) return res.send(error);
			fs.unlinkSync(path);
			const user = await User.findByIdAndUpdate('id', { profile_picture: image.url }, { new: true }).exec();
			res.json(user);
		});
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
