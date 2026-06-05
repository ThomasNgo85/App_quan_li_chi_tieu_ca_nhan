const db = require("../config/db");

exports.getBudgets = async (req, res) => {
    try {
        const [budgets] = await db.query(`
            SELECT
                b.id,
                c.name AS category_name,
                b.limit_amount,
                b.month,
                b.year
            FROM budgets b
            JOIN categories c
                ON b.category_id = c.id
            ORDER BY c.id
        `);

        res.render("budgets", {
            budgets
        });

    } catch (error) {
        console.error(error);
        res.send("Budget Page Error");
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const id = req.params.id;
        const { limit_amount } = req.body;

        await db.query(
            "UPDATE budgets SET limit_amount = ? WHERE id = ?",
            [limit_amount, id]
        );

        res.redirect("/budgets");

    } catch (error) {
        console.error(error);
        res.send("Update Budget Error");
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name, limit_amount, month, year } = req.body;

        const [result] = await db.query(
            "INSERT INTO categories (name) VALUES (?)",
            [name]
        );

        const categoryId = result.insertId;

        await db.query(
            `INSERT INTO budgets
            (category_id, limit_amount, month, year)
            VALUES (?, ?, ?, ?)`,
            [categoryId, limit_amount, month, year]
        );

        res.redirect("/budgets");

    } catch (error) {
        console.error(error);
        res.send("Add Category Error");
    }
};