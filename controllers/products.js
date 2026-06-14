const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  //   throw new Error("testing async errors");
  // const products = await Product.find({});
  const products = await Product.find({
    featured: true,
  });
  res.status(200).json({ products,   nbHits: products.length
   });
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "all products" });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
