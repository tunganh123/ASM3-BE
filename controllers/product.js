const Product = require("../models/product");
exports.getproduct = async (req, res) => {
  const data = await Product.find();
  res.status(200).json(data);
};
exports.getdetailproduct = async (req, res) => {
  try {
    const idproduct = req.params["idproduct"];
    const productitem = await Product.findById(idproduct);
    const listproductcategory = await Product.find({
      category: productitem.category,
    });
    const data = {
      productitem: productitem,
      listproductcategory: listproductcategory,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json();
    console.log(error);
  }

  //   res.status(200).json(allproduct);
};
