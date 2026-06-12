require("dotenv").config();

const express = require("express");
const app = express();


const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h1>Store</h1><a href="/api/v1/products">products list </a>');
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //connect db
    await app.listen(port, console.log(`app is listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
