const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeature = require("../utils/apiFeatures")
const cloudinary = require("cloudinary")


// Get All Products : Any user
exports.getAllProduct = catchAsyncErrors( async (req,res,next)=>{


    const resultPerPage = 8
    const productCounts = await Product.countDocuments()

    let apiFeature = new ApiFeature(Product.find(),req.query)
    .search()
    .filter()

    let  products = await apiFeature.query.clone()
    const filteredProductCounts = products.length

    apiFeature.pagination(resultPerPage)

    products = await apiFeature.query

    res.status(200).json({
        success:true,
        products,
        productCounts,
        resultPerPage,
        filteredProductCounts,
    })

})

// Get Product Details : Any user
exports.getProductDetails = catchAsyncErrors( async (req,res,next)=>{


    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found.",404))
    }

    res.status(200).json({
        success:true,
        product
    })

})

// Create Product : Admin
exports.createProduct = catchAsyncErrors(async (req,res,next)=>{

    // cloudinary
    

    let images = []

    if(typeof req.body.images === "string"){ // only one image selected
        images.push(req.body.images)
    }else{ // multiple images selected
        images = req.body.images
    }

    const imagesLinks = []

    for (let index = 0; index < images.length; index++) {

        const myCloud = await cloudinary.v2.uploader.upload(images[index],{  
            folder:"EcommerseProductsImages",
            width:150,
            crop:"scale"
        })

        imagesLinks.push({
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        })
    }

    // NOW REPLACE URLS OF IMAGES WITH IMAGES LINKS
    req.body.images = imagesLinks

    // in body we are adding that this admin / current loggedInUser created this product ok
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success:true,
        product
    })

})
// Update Product : Admin
exports.updateProduct = catchAsyncErrors (async(req,res,next)=>{
    
    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found.",404))
    }

    // Cloudinary things

    let images = []

    if(typeof req.body.images === "string"){ // only one image selected
        images.push(req.body.images)
    }else{ // multiple images selected
        images = req.body.images
    }

    if(images !== undefined){ // new images are selected

        // first delete old one

         // deleting images from cloudinary
        for(let index = 0; index < product.images.length; index++){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }

        // upload new one
        const imagesLinks = []

        for (let index = 0; index < images.length; index++) {

            const myCloud = await cloudinary.v2.uploader.upload(images[index],{  
                folder:"EcommerseProductsImages",
                width:150,
                crop:"scale"
            })

            imagesLinks.push({
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            })
        }

        // NOW REPLACE URLS OF IMAGES WITH IMAGES LINKS
        req.body.images = imagesLinks
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        product
    })

})

// Delete Product:Admin
exports.deleteProduct = catchAsyncErrors (async (req,res,next)=>{

    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found.",404))
    }

    // deleting images from cloudinary
    for(let index = 0; index < product.images.length; index++){
         await cloudinary.v2.uploader.destroy(product.images[index].public_id)
    }


    await Product.findByIdAndDelete(product._id)

    res.status(200).json({
        success:true,
        message:"Product deleted successfully."
    })

})

// Get All products : admin
exports.getAdminProducts = catchAsyncErrors (async (req,res,next)=>{

    const products = await Product.find()

    res.status(200).json({
        success:true,
        products
    })

})


// Create new review or update review by logged in user
// will create : if new / update previous one
exports.createProductReview = catchAsyncErrors (async (req,res,next)=>{

    const {rating,comment,productId} = req.body

    if(!rating || !comment || !productId){
        return next(new ErrorHandler("Please provide rating , comment and productId . "),400)
    }

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment:comment
    }

    // find product
    const product = await Product.findById(productId)

    if(!product){
        return next(new ErrorHandler("Product not found ."),404)
    }

    const isReviewed = product.reviews.find((review)=>{
        return review.user.toString() === req.user._id.toString()
    })
    // already review given
    if(isReviewed){
        // update
        product.reviews.forEach((review)=>{

            if(review.user.toString() === req.user._id.toString()){
                review.rating = rating,
                review.comment = comment
            }
            
        })

    }else{
        // push new review
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length// number of rating also updated
    }

    // now overall product rating should be updated
    let ratingSum = 0 ;
    product.reviews.forEach((review)=>{
        ratingSum += review.rating
    })

    product.ratings = Number(ratingSum/product.reviews.length)

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
    })

})


// Get all reviews of a product by id
exports.getProductReviews = catchAsyncErrors (async (req,res,next)=>{
    
    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found ."),404)
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })

})

// Delete Product review by id
exports.deleteProductReview = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found ."),404)
    }

    const reviews = product.reviews.filter((review)=>{
        return review._id.toString() !== req.query.reviewId.toString()
    })

    // now overall product rating should be updated
    let ratingSum = 0 ;
    reviews.forEach((review)=>{
        ratingSum += review.rating
    })

    let ratings = 0;

    if(reviews.length === 0){
        ratings = 0
    }else{
        ratings = Number(ratingSum/reviews.length)
    }

    const numberOfReviews = reviews.length


    const updatedProduct = await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numberOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
    })

})