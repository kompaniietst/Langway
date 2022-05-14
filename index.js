require('dotenv').config();
require("./config/db").connect();
const express = require("express");
const app = express();
app.use(express.json());

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// routes
require('./routes/auth.routes')(app);