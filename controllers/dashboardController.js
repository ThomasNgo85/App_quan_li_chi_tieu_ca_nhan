const db = require("../config/db");

exports.getDashboard = async (req, res) => {

    try {

        const [expenseResult] = await db.query(`
            SELECT SUM(amount) AS total_expense
            FROM transactions
        `);

        const [transactionResult] = await db.query(`
            SELECT COUNT(*) AS total_transactions
            FROM transactions
        `);

        const [categoryResult] = await db.query(`
            SELECT COUNT(*) AS total_categories
            FROM categories
        `);

        const [budgetResult] = await db.query(`
            SELECT SUM(limit_amount) AS total_budget
            FROM budgets
        `);

        const [pieResult] = await db.query(`
            SELECT
                c.name,
                SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c
                ON t.category_id = c.id
            GROUP BY c.name
        `);

        const [monthlyResult] = await db.query(`
            SELECT
                DATE_FORMAT(transaction_date, '%Y-%m') AS month,
                SUM(amount) AS total
            FROM transactions
            GROUP BY month
            ORDER BY month
        `);
        
       const [alerts] = await db.query(`
            SELECT
                c.name,
                SUM(t.amount) AS spent,
                MAX(b.limit_amount) AS limit_amount
            FROM transactions t
            JOIN categories c
                ON t.category_id = c.id
            JOIN budgets b
                ON b.category_id = c.id
            WHERE b.month = 6
            AND b.year = 2026
            GROUP BY c.id, c.name
            HAVING spent > limit_amount
        `);

        const [categories] = await db.query(`
            SELECT * FROM categories
        `);

        const [monthlyCategoryResult] = await db.query(`
            SELECT
                DATE_FORMAT(t.transaction_date, '%Y-%m') AS month,
                c.name AS category_name,
                SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c
                ON t.category_id = c.id
            GROUP BY month, c.name
            ORDER BY month
        `);

        res.render("dashboard", {

            totalExpense:
                expenseResult[0].total_expense || 0,

            totalTransactions:
                transactionResult[0].total_transactions,

            totalCategories:
                categoryResult[0].total_categories,

            totalBudget:
                budgetResult[0].total_budget || 0,

            pieLabels:
                pieResult.map(item => item.name),

            pieData:
                pieResult.map(item => item.total),

            monthlyLabels:
                monthlyResult.map(item => item.month),

            monthlyData:
                monthlyResult.map(item => item.total),

            monthlyCategoryData: monthlyCategoryResult,
            
            categories,
        

            alerts
            });

    } catch (error) {

        console.error(error);

        res.send("Dashboard Error");

    }

};