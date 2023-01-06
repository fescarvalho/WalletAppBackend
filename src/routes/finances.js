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
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
