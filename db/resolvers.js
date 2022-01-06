const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require('bcryptjs')
const jwt =require ('jsonwebtoken')

const createToken = (user , secret, expiresIn) =>{
    const {id , email, name, surname} = user

    return jwt.sign ({id, name, surname, email}, secret, {expiresIn})
}


//Resolvers
const resolvers = {
    Query:{
        getUser: async (_, {token}) =>{
            const userId = await jwt.verify(token, process.env.SECRET)
            return userId
        },

        getProducts: async ()=>{
            try{
                const products = await Product.find({})
                return products
            }catch(error){
                console.log(error)
            }
        },
        getProduct: async(_, {id})=>{
            //check if product exist
            const product = await Product.findById(id)

            if(!product){
                throw new Error('Product not finded')

            }
            return product
        }
      
    }, 
    Mutation:{
        newUser: async (_, { input } ) => {

            const { email, password } = input;
            
            // Check user is registered
            const userExist = await User.findOne({email});
            if (userExist) {
                throw new Error('User already exist');
            }

            // Hashear su password
            const salt = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);

            try {
                 // Save in DB
                const user = new User(input);
                user.save();
                return user;
            } catch (error) {
                console.log(error);
            }
        },
        authenticateUser: async  (_, { input } ) => {
            const {email, password}=input

             // Check user is registered
             const userExist = await User.findOne({email});

             if (!userExist) {
                throw new Error("User does not exist");
            }

            //Check password
            const correctPassword = await bcrypt.compare(password, userExist.password)
            if (!correctPassword) {
                throw new Error("Password incorrect");
            }

            //Create token

            return{
                token: createToken (userExist,  process.env.SECRET, '24h')
            }


        },
        newProduct: async  (_, { input } ) => {
            try{
                const product = new Product(input)
                const result = await product.save()
                return result
            }catch(error){
                console.log(error)
            }


        },
        updateProduct: async ( _, { id , input } )=>{
             //check if product exist
            let product = await Product.findById(id)

            if(!product){
                throw new Error('Product not finded')
 
            }

            //save in DB
            product = await Product.findOneAndUpdate( { _id: id }, input, { new: true }) //find the object with the id field, update with input date and return new object

            return product;
            
        },
        deleteProduct: async(_,{id})=>{
            let product = await Product.findById(id);
            if(!product){
                throw new Error('Product not finded')
 
            }

            await Product.findOneAndDelete({_id : id});

            return "Product Deleted";


        }

    }
}

module.exports = resolvers

