const db = require("../config/db");

exports.getReports = async (req, res) => {
    try {
        const [categoryReport] = await db.query(`
            SELECT
                c.name AS category_name,
                SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c
                ON t.category_id = c.id
            GROUP BY c.name
            ORDER BY total DESC
        `);

        const [monthlyReport] = await db.query(`
            SELECT
                DATE_FORMAT(transaction_date, '%Y-%m') AS month,
                SUM(amount) AS total
            FROM transactions
            GROUP BY month
            ORDER BY month
        `);

        res.render("reports", {
            categoryReport,
            monthlyReport
        });

    } catch (error) {
        console.error(error);
        res.send("Reports Error");
    }
};