const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  //   throw new Error("testing async errors");
  // const products = await Product.find({});
  //$options: 'i' mean case sensitive mean iphone !== Iphone
  const products = await Product.find({}).select("name price");

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // console.log(req.query)

  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    // This regex looks for comparison operators:
    //g means find all occurance, not just the first one.

    /*
        suppose
      //numericFilters = "price>40,rating>=4"
      fist match -> match = ">=" then operatormap[">="] returns '$gte' becomes -$gte
      //after replacement
      filters = "price-$gt40,rating-$gte4"
      */

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`,
    );
    console.log("filter1", filters); //"price-$gt-40,rating-$gte-4"

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      //after split -> ["price-$gt-40","rating-$gte-4"]
      const [field, operator, value] = item.split("-"); //1st iteration item = "price-$gt-40" ->["price", "$gt", "40"]  field = 'price' operator ='$gt' value= '40
      if (options.includes(field)) {
        //if includes price | rating then returns true
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log("queryobj", queryObject); //{price: {&gtr: 40}, rating: {&gte: 4}}
  }

  let result = Product.find(queryObject);

  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }

  //field
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //This formula determines how many records should be ignored before returning results.

  //skip = (2 - 1) * 10 = 10

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
