const express = require("express");

const app = express();

app.use(express.json());
const Port = process.env.PORT || 4000;

// eslint-disable-next-line no-console
app.listen(() => console.log(`listening on ${Port}`));
