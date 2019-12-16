const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = require('./config/keys').mongoURL

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');



const errorController = require("./controllers/error");

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));



app.use('/', adminRoutes)
app.use(authRoutes)

app.use(errorController.get404);

const port = process.env.PORT || 3000;


mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.log(err);
  });
