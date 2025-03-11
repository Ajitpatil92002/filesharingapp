const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const SECRET_KEY = "mysecretkey";
const UPLOAD_DIR = path.join(__dirname, "uploads");

app.use(express.json());

const users = [
  {
    username: "ABC",
    password: "ABC123",
  },
];

// auth middleare
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

//auth login/signup

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username == username);

  if (username === user.username && password === user.password) {
    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "8h" });
    res.json({ token });
  }
  res.status(401).send("Invalid Credentials");
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  users.push({
    username,
    password,
  });
  res.send("Sinup Successfully, No u can login with ur username and password");
});

// File sharing App

//Creating file : POST
app.post("/file", authenticateToken, (req, res) => {
  const { filename, content } = req.body;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.writeFile(filepath, content, (err) => {
    if (err) {
      return res.status(500).send("Error uploading file");
    }
    res.send("File uploaded");
  });
});

//Reading file : GET
app.get("/file/:filename", authenticateToken, (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.readFile(filepath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("File not found");
    }
    res.send(data);
  });
});

//Updating file :PUT

app.put("/file/:filename", authenticateToken, (req, res) => {
  const { filename } = req.params;
  const { content } = req.body;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.writeFile(filepath, content, (err) => {
    if (err) {
      return res.status(500).send("Error uploading file");
    }
    res.send("File uploaded");
  });
});

//DELETing file : Delete
app.delete("/file/:filename", authenticateToken, (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).send("Error deleting file");
    }
    res.send("File deleted!!");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
