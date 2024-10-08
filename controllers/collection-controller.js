const {productModel} = require("../model/products-model")
const {userModel} = require("../model/user-model")

module.exports.collectionController = async function(req,res){
    let {checkStock ,minPrice ,maxPrice} = req.query
    let category = req.params.category
    let checkCollection = ["winter collection","summer collection"].includes(category) 
    let checkCategory = ["t-shirt","track pants"].includes(category)   
    let query = {};

    if(checkCollection){
        query.proCollection = category
    }
    if(checkCategory){
        query.category = category
    }

    // Filter by stock availability if checkStock is provided
    if (checkStock === "inStock") {
        query.availability = true;
    } 
    if (checkStock === "outOfStock") {
        query.availability = false;
    }

    // Filter by price range if minPrice and/or maxPrice are provided
    query.price = {
        $gte: Number(minPrice) || 0,      // Default to 0 if minPrice is not provided
        $lte: Number(maxPrice) || Infinity // Default to Infinity if maxPrice is not provided
    };
     
    
    // Find products based on the query object
    const products = await productModel.find(query);
    let userKey = req.session.user
    let cartCount = null
    if(userKey){
        var user = await userModel.findOne({email:userKey.email})
        if(user){
            cartCount = user.cart.length
        }
    }

    res.render("collection" ,{products ,checkStock ,minPrice ,maxPrice ,category:req.params.category.toString(),cartCount})
}