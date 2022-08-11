const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Import environment variables
require("dotenv").config();

// Parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cors
app.use(cors());

// Import routes
app.use("/api", require("./routes/auth.route"));
app.use("/api", require("./routes/user.route"));
app.use("/api", require("./routes/admin.route"));

// Connect to DB
mongoose.connect(process.env.URL_DB, (err) => {
    if (err) throw err;
    console.log("Connected Database");
});

// Run server
app.get("/", (req, res) => {
    res.send("API Running");
});

// Middleware for error handling
app.use(require("./middlewares/error.middleware"));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}, url: ${process.env.URL}:${process.env.PORT}`);
});
