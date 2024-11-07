const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


dotenv.config(); 

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));


mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err));


app.get("/", (req, res) => { 
    res.json({ data: "hello" });
});



app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;
