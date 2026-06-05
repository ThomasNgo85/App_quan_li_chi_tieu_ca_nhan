const db = require("../config/db");

exports.getTransactions = async (req, res) => {
    try {
        const { category, month, sort } = req.query;

        let sql = `
            SELECT 
                transactions.id,
                categories.name AS category_name,
                transactions.amount,
                transactions.note,
                transactions.transaction_date
            FROM transactions
            JOIN categories
                ON transactions.category_id = categories.id
            WHERE 1 = 1
        `;

        const params = [];

        if (category) {
            sql += ` AND categories.name = ? `;
            params.push(category);
        }

        if (month) {
            sql += ` AND DATE_FORMAT(transactions.transaction_date, '%Y-%m') = ? `;
            params.push(month);
        }

        if (sort === "amount_desc") {
            sql += ` ORDER BY transactions.amount DESC `;
        } else if (sort === "amount_asc") {
            sql += ` ORDER BY transactions.amount ASC `;
        } else if (sort === "date_asc") {
            sql += ` ORDER BY transactions.transaction_date ASC `;
        } else {
            sql += ` ORDER BY transactions.transaction_date DESC `;
        }

        const [transactions] = await db.query(sql, params);

        const [categories] = await db.query(`
            SELECT *
            FROM categories
        `);

        let totalSql = `
            SELECT SUM(transactions.amount) AS total
            FROM transactions
            JOIN categories
                ON transactions.category_id = categories.id
            WHERE 1 = 1
        `;

        const totalParams = [];

        if (category) {
            totalSql += ` AND categories.name = ? `;
            totalParams.push(category);
        }

        if (month) {
            totalSql += ` AND DATE_FORMAT(transactions.transaction_date, '%Y-%m') = ? `;
            totalParams.push(month);
        }

const [totalResult] = await db.query(totalSql, totalParams);

const total = totalResult[0].total || 0;

        res.render("transactions", {
            transactions,
            categories,
            total,
            selectedCategory: category || "",
            selectedMonth: month || "",
            selectedSort: sort || "date_desc"
        });

    } catch (error) {
        console.error(error);
        res.send("Error loading transactions");
    }
};

exports.addTransaction = async (req, res) => {
    console.log("BODY:", req.body);

    try {
        const {
            category_id,
            amount,
            note,
            transaction_date
        } = req.body;

        await db.query(`
            INSERT INTO transactions
            (category_id, amount, note, transaction_date)
            VALUES (?, ?, ?, ?)
        `, [
            category_id,
            amount,
            note,
            transaction_date
        ]);

        res.redirect("/transactions");

    } catch (error) {
        console.error(error);
        res.send("Error");
    }
};

exports.deleteTransaction = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(
            "DELETE FROM transactions WHERE id = ?",
            [id]
        );

        res.redirect("/transactions");

    } catch (error) {

        console.error(error);

        res.send("Delete Error");

    }

};

exports.editPage = async (req, res) => {

    try {

        const id = req.params.id;

        const [transactions] = await db.query(
            "SELECT * FROM transactions WHERE id = ?",
            [id]
        );

        const [categories] = await db.query(
            "SELECT * FROM categories"
        );

        res.render("editTransaction", {
            transaction: transactions[0],
            categories
        });

    } catch (error) {

        console.error(error);
        res.send("Edit Page Error");

    }

};

exports.updateTransaction = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            category_id,
            amount,
            note,
            transaction_date
        } = req.body;

        await db.query(`
            UPDATE transactions
            SET
                category_id = ?,
                amount = ?,
                note = ?,
                transaction_date = ?
            WHERE id = ?
        `, [
            category_id,
            amount,
            note,
            transaction_date,
            id
        ]);

        res.redirect("/transactions");

    } catch (error) {

        console.error(error);
        res.send("Update Error");

    }

};
