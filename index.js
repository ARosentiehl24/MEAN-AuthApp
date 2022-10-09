require("dotenv").config();

const { dbConnection } = require("./db/config");

const cors = require("cors");
const express = require("express");

const app = express();

//Body reading and parsing
app.use(express.json());

//CORS
app.use(cors());

//DB Connection
dbConnection();

//Public directory
app.use(express.static("public"));

//Routes
app.use("/api/auth", require("./routes/auth"));

//Handle other routes
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Create the server/express app
app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
