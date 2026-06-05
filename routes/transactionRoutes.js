const express = require("express");
const router = express.Router();

const transactionController =
require("../controllers/transactionController");

router.get(
    "/",
    transactionController.getTransactions
);

router.post(
    "/add",
    transactionController.addTransaction
);

router.get(
    "/delete/:id",
    transactionController.deleteTransaction
);

router.get(
    "/edit/:id",
    transactionController.editPage
);

router.post(
    "/edit/:id",
    transactionController.updateTransaction
);

module.exports = router;