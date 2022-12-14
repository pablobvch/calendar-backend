const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");
require("dotenv").config();

const app = express();

//
dbConnection();

app.use(cors());

//Public directory
app.use(express.static("public"));

//Parse body
app.use(express.json());

app.use(`/api/auth`, require("./routes/auth"));
app.use(`/api/events`, require("./routes/events"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
