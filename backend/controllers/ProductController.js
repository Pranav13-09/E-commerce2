const express = require("express");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorhandler");
const Apifeatures = require("../utils/apifeatures");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");

//Create a new product --Admin Route
exports.createNewProduct = async (req, res, next) => {
  // req.body.user = req.user.id;
  // console.log(req.body.user);
  // console.log(req.body);
  // const product = await Product.create(req.body);
  // res
  //   .status(200)
  //   .json({ message: "Product has been added sucessfully", product });

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      publicId: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

exports.getAllProduct = async (req, res, next) => {
  const resultPerPage = 11;
  const productCount = await Product.countDocuments();
  const apifeatures = new Apifeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apifeatures.query;
  let filteredProducts = products.length;

  apifeatures.pagination(resultPerPage);

  products = await apifeatures.query.clone();
  res.status(200).json({
    message: "All products fetched successfully",
    products,
    productCount,
    resultPerPage,
    filteredProducts,
  });
};

exports.updateProduct = async (req, res, next) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "product Updated Successfully", product });
};

exports.deleteProduct = async (req, res, next) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return res
      .status(400)
      .json({ message: "Product not found", success: "false" });
  }
  product = await Product.findByIdAndRemove(id);
  res.status(200).json({ message: "product Deleted Successfully" });
};

exports.getSingleProduct = async (req, res, next) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return res
      .status(400)
      .json({ message: "Product not found", success: "false", product });
  }

  res.status(200).json({ message: "product fetched Successfully", product });
};

//create and update review

exports.createReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const product = await Product.findById(productId);

  const review = {
    user: req.user._id,
    rating,
    comment,
    name: req.user.name,
  };

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.NoOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((review) => {
    avg += review.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save();

  res.status(200).json({ success: true });
};

//GET aall Reviews
exports.getAllReviews = async (req, res, next) => {
  console.log("i am in get admin reviews");

  console.log(req.query);

  let product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }
  console.log(product, "iam product");
  res.status(200).json({ message: "true", reviews: product.reviews });
};

exports.deleteReview = async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  // if (!product) {
  //   return next(new ErrorHandler("Product not found", 400));
  // }

  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });

  console.log("i am in delete ereivie admin");

  product.reviews = reviews;
  let avg = 0;
  product.reviews.forEach((review) => {
    avg += review.rating;
  });

  product.ratings = avg / product.reviews.length;
  product.NoOfReviews = reviews.length;

  await product.save();
  res.status(200).json({ sucess: "true" });
};

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  console.log("i am here in admin product");
  const products = await Product.find();
  // console.log(products);

  res.status(200).json({
    success: true,
    products,
  });
});

// exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
//   let product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   // Images Start Here
//   let images = [];

//   if (typeof req.body.images === "string") {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   if (images !== undefined) {
//     // Deleting Images From Cloudinary
//     for (let i = 0; i < product.images.length; i++) {
//       await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//     }

//     const imagesLinks = [];

//     for (let i = 0; i < images.length; i++) {
//       const result = await cloudinary.v2.uploader.upload(images[i], {
//         folder: "products",
//       });

//       imagesLinks.push({
//         public_id: result.public_id,
//         url: result.secure_url,
//       });
//     }

//     req.body.images = imagesLinks;
//   }

//   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });

// // Delete Product

// exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   // Deleting Images From Cloudinary
//   for (let i = 0; i < product.images.length; i++) {
//     await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//   }

//   await product.remove();

//   res.status(200).json({
//     success: true,
//     message: "Product Delete Successfully",
//   });
// });
