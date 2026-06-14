require("dotenv").config();
const connectDB = require("./db/connect");

const Products = require("./models/product");
const jsonProducts = require("./products.json");

console.log(jsonProducts)
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Products.create(jsonProducts)
    console.log("successful");
    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};

start();
