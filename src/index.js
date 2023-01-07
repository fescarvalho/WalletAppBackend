require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routesCategories = require("./routes/categories");
const routesUsers = require("./routes/users");
const routesFinances = require("./routes/finances");

const db = require("./db");
const app = express();
app.use(
  cors({
    origin: "*",
  }),
);
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Ola esta é a API da aplicação WalletWap!");
});
app.use(express.json());

app.use("/categories", routesCategories);
app.use("/users", routesUsers);
app.use("/finances", routesFinances);

app.listen(port, () => {
  db.connect()
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      throw new Error(err);
    });

  console.log(`Example app listening at ${port}`);
});
