const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/personal_budget", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

const budgetScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    validate: /^#[0-9A-Fa-f]{6}$/,
  },
});

const Budget = db.model("budget", budgetScheme, "budget");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/hello", (req, res) => {
  return res.send("Hello World!");
});

app.get("/budget", async (req, res) => {
  const budget = await Budget.find();
  return res.json(budget);
});
app.post("/budget", async (req, res) => {
  const budget = new Budget({
    title: req.body.title,
    budget: req.body.budget,
    color: req.body.color,
  });
  await budget.save();
  return res.json(budget);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
