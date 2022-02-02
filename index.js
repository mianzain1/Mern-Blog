require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoots = require("./routes/auth.roots");
const cookieParser = require("cookie-parser");

PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("connected"))
    .catch(err => console.log("something is wrong with DB" + err))

app.use("/api/auth", authRoots);


app.listen(PORT, () => {
    console.log(`connected to localhost:${PORT}`);
})