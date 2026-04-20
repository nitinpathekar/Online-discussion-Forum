const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error details:");
    console.error(err);
  });

app.use(express.json());
app.use(cors());

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);

app.get("/", (req, res) => {
  res.send("Discussion Forum API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
