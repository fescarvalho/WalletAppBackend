const express = require("express");
const routesCategories = require("./routes/categories");
const db = require("./db");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());

app.use("/categories", routesCategories);

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
