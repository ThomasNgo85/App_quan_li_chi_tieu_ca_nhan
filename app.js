const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

const dashboardRoutes = require("./routes/dashboardRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const budgetRoutes = require("./routes/budgetRoutes");

const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", dashboardRoutes);
app.use("/transactions", transactionRoutes);

app.use("/budgets", budgetRoutes);

app.use("/reports", reportRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});