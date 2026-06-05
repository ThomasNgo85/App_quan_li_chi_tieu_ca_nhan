const express = require("express");
const router = express.Router();

const budgetController = require("../controllers/budgetController");

router.get("/", budgetController.getBudgets);

router.post("/update/:id", budgetController.updateBudget);

router.post("/add-category", budgetController.addCategory);

module.exports = router;