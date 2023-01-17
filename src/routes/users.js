const express = require("express");
const router = express.Router();
const db = require("../db");
const { findByEmail } = require("../queries/users");
const usersQueries = require("../queries/users");

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || email.length < 5 || !email.includes("@"))
      return res.status(400).json({ mensage: "Email is invalid." });

    const userExists = await db.query(query);

    if (!userExists.rows[0]) {
      return res.status(404).json({ error: "User does not exists." });
    }

    res.status(200).json(userExists.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { email } = req.headers;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const query = usersQueries.findByEmail(email);
    const userEmail = await db.query(query);

    if (!userEmail.rows[0])
      return res.status(401).json({ message: "User does not exist." });

    const text = "DELETE FROM users WHERE email=$1 RETURNING *";
    const values = [email];

    const deleteResponse = await db.query(text, values);

    if (!deleteResponse.rows[0])
      return res.status(400).json({ message: "User not deleted." });

    return res.status(200).json(deleteResponse.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (name.length < 3)
      return res
        .status(400)
        .json({ mensage: "Name should have more than 3 characters." });

    if (email.length < 5 || !email.includes("@"))
      return res.status(400).json({ mensage: "Email is invalid." });

    const query = findByEmail(email);
    const alreadyExists = await db.query(query);
    if (alreadyExists.rows[0])
      return res.status(403).json({ error: "User already exists." });

    const text = "INSERT INTO users(name, email) VALUES($1, $2) RETURNING *";
    const values = [name, email];
    const createResponse = await db.query(text, values);

    if (!createResponse) return res.status(404).json({ error: "Users not created." });

    return res.status(200).json(createResponse.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const oudEmail = req.headers.email;
    const { name, email } = req.body;

    if (name.length < 3)
      return res.status(400).json({ error: "Name should have more than 3 characters." });

    if (email.length < 5 || !email.includes("@"))
      return res.status(400).json({ mensage: "Email is invalid." });

    const query = usersQueries.findByEmail(oudEmail);
    const alreadyExists = await db.query(query);

    if (!alreadyExists.rows[0]) {
      return res.status(404).json({ error: "User does not exists." });
    }
    if (oudEmail.length < 5 || !oudEmail.includes("@"))
      return res.status(400).json({ mensage: "Email is invalid." });

    const text = "UPDATE users SET name=$1, email=$2 WHERE email=$3 RETURNING*";
    const values = [name, email, oudEmail];
    const updateResponse = await db.query(text, values);

    if (!updateResponse.rows[0])
      return res.status(404).json({ error: "Categories not updated." });

    return res.status(200).json(updateResponse.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
