const express = require("express");
const router = express.Router();
const db = require("../db");
const categoriesQueries = require("./queries/categories");
const usersQueries = require("./queries/users");

router.post("/", async (req, res) => {
  try {
    const { email } = req.headers;
    const { category_id, title, date, value } = req.body;

    //Validations
    if (email.length < 5 || !email.includes("@"))
      return res.status(400).json({ mensage: "Email is invalid." });

    if (!category_id) return res.status(400).json({ mensage: "Category id is mandatory." });
    if (!value) return res.status(400).json({ mensage: "Value id is mandatory." });

    if (!title || title.length < 3)
      return res
        .status(400)
        .json({ mensage: "Title is madatory and shoud have more than 3 caracters." });

    if (!date || date.length !== 10)
      return res
        .status(400)
        .json({ mensage: "Date is mandatory and shoud be in the format yyyy-mm-dd." });

    //

    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(403).json({ message: "User does not exist." });
    }

    const category = await db.query(categoriesQueries.findById(category_id));
    if (!category.rows[0]) return res.status(404).json({ message: "Category not found." });

    const text =
      "INSERT INTO finances (user_id, category_id, date, title, value) VALUES($1, $2, $3, $4, $5) RETURNING*";
    const values = [userQuery.rows[0].id, category_id, date, title, value];

    const createResponse = await db.query(text, values);
    if (!createResponse.rows[0])
      return res.status(400).json({ error: "Finances row not created " });

    return res.status(200).json(createResponse.rows[0]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers;

    if (email.length < 5 || !email.includes("@"))
      return res.status(400).json({ mensage: "Email is invalid." });

    if (!id) return res.status(404).json({ error: "Id is mandatory." });

    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(403).json({ message: "User does not exist." });
    }

    const findFinanceText = "SELECT * FROM finances WHERE id=$1";
    const financeValue = [Number(id)];
    const financeItemQuery = await db.query(findFinanceText, financeValue);

    if (!financeItemQuery.rows[0]) return res.status(404).json({ error: "Finance row not found." });

    if (financeItemQuery.rows[0].user_id !== userQuery.rows[0].id)
      return res.status(401).json({ error: "Finance row doest not belong to user." });

    const text = "DELETE FROM finances WHERE id=$1 RETURNING *";
    const values = [id];

    const deleteResponse = await db.query(text, values);
    if (!deleteResponse.rows[0])
      return res.status(400).json({ error: "Finances row not deleted. " });

    return res.status(200).json(deleteResponse.rows[0]);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
