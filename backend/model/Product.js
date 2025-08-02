const mongoose=require("mongoose")
const {Schema,model}=mongoose;

const ProductSchema = new Schema({
    ProductName:{type:String,required:true},
    ProductPrice:{type:String,required:true},
    ProductCategory:{type:String,required:true},
    ProductStatus:{type:String,default:"Out-Of-Stock"},
    ProductImage:{type:String,required:true},
},{timestamps:true})

module.exports = model("product",ProductSchema)