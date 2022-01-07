const User = require("../models/User");
const Product = require("../models/Product");
const Client = require('../models/Clients');
const Order = require('../models/Order');
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
        },
        getClients: async () => {
            try {
                const clients = await Client.find({});
                return clients;
            } catch (error) {
                console.log(error);
            }
        }, 
        getClientsSeller: async (_, {}, ctx ) => {
            try {
                const clients = await Client.find({ seller: ctx.user.id.toString() });
                return clients;
            } catch (error) {
                console.log(error);
            }
        }, 
        getClient: async (_, { id }, ctx) => {
            // Check if client exist
            const client = await Client.findById(id);

            if(!client) {
                throw new Error('client not found');
            }

            // Only can see it the seller who created
            if(client.seller.toString() !== ctx.user.id ) {
                throw new Error('You have no credentials');
            }

            return client;
        },
        getOrders: async () => {
            try {
                const orders = await Order.find({});
                return orders;
            } catch (error) {
                console.log(error);
            }
        }, 
        getOrdersSeller: async (_, {}, ctx) => {
            try {
                const orders = await Order.find({ seller: ctx.user.id }).populate('client');

                return orders;
            } catch (error) {
                console.log(error);
            }
        }, 
        getOrder: async(_, {id}, ctx) => {
           
            const order = await Order.findById(id);
            if(!order) {
                throw new Error('Order not found');
            }

          
            if(order.seller.toString() !== ctx.user.id) {
                throw new Error('No credentials');
            }

           
            return order;
        }, 
        getStatusOrders: async (_, { status }, ctx) => {
            const orders = await Order.find({ seller: ctx.user.id, status });

            return orders;
        },
   
        bestClients: async () => {
            const clients = await Order.aggregate([
                { $match : { status : "COMPLETE" } },
                { $group : {
                    _id : "$client", 
                    total: { $sum: '$total' }
                }}, 
                {
                    $lookup: {
                        from: 'clients', 
                        localField: '_id',
                        foreignField: "_id",
                        as: "client"
                    }
                }, 
                {
                    $limit: 10
                }, 
                {
                    $sort : { total : -1 }
                }
            ]);

            return clients;
        }, 
        bestSellers: async () => {
            const sellers = await Order.aggregate([
                { $match : { status : "COMPLETED"} },
                { $group : {
                    _id : "$seller", 
                    total: {$sum: '$total'}
                }},
                {
                    $lookup: {
                        from: 'users', 
                        localField: '_id',
                        foreignField: '_id',
                        as: 'seller'
                    }
                }, 
                {
                    $limit: 3
                }, 
                {
                    $sort: { total : -1 }
                }
            ]);

            return sellers;
        },
        searchProduct: async(_, { text }) => {
            const products = await Product.find({ $text: { $search: text  } }).limit(10)

            return products;
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


        },
        newClient: async (_, { input }, ctx) => {

            console.log(ctx);

            const { email } = input
            // Check if client is already registered
            // console.log(input);

            const client = await Client.findOne({ email });
            if(client) {
                throw new Error('The client already exist');
            }

            const newClient = new Client(input);

            // assign seller
            newClient.seller = ctx.user.id;

            // save in the database

            try {
                const result = await newClient.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        updateClient: async (_, {id, input}, ctx) => {
            // Check if exist
            let client = await Client.findById(id);

            if(!client) {
                throw new Error('Client does not exist');
            }

            // verify who is updating
            if(client.seller.toString() !== ctx.user.id ) {
                throw new Error('You have not credentials');
            }

            // save client
            client = await Client.findOneAndUpdate({_id : id}, input, {new: true} );
            return client;
        },
        deleteClient : async (_, {id}, ctx) => {
            // Verifify existance
            let client = await Client.findById(id);

            if(!client) {
                throw new Error('Client does not exist');
            }

               // verify who is updating
            if(client.seller.toString() !== ctx.user.id ) {
                throw new Error('You have not credentials');
            }

            // Delete client
            await Client.findOneAndDelete({_id : id});
            return "Client deleted"
        },
        newOrder: async (_, {input}, ctx) => {

            const { client } = input
            
            let clientxist = await Client.findById(client);

            if(!client) {
                throw new Error('Client does not exist');
            }

          
            if(clientxist.seller.toString() !== ctx.user.id ) {
                throw new Error('No credentials');
            }

            // Check stock available
            for await ( const item of input.order ) {
                const { id } = item;

                const product = await Product.findById(id);

                if(item.amount > product.stock) {
                    throw new Error(` item: ${product.nombre} exceed available amount`);
                } else {
                    
                    product.stock = product.stock - item.amount;

                    await product.save();
                }
            }
            
            const newOrder = new Order(input);
            newOrder.seller = ctx.user.id;

        
            // Guardarlo en la base de datos
            const result = await newOrder.save();
            return result;

            
        },
        updateOrder: async(_, {id, input}, ctx) => {

            const { client } = input;

            const orderExist = await order.findById(id);
            if(!orderExist) {
                throw new Error('Order does not exist');
            }
         
            const clientExist = await Client.findById(client);
            if(!clientExist) {
                throw new Error('Client does not exist');
            }

            if(clientExist.seller.toString() !== ctx.user.id ) {
                throw new Error('No credentials');
            }

            if( input.order ) {
                for await ( const item of input.order ) {
                    const { id } = item;
    
                    const product = await Product.findById(id);
    
                    if(item.amount > product.stock) {
                        throw new Error(`item: ${product.name} exceed available amount`);
                    } else {
                        
                        product.stock = product.stock - item.amount;
    
                        await product.save();
                    }
                }
            }

            const result = await Order.findOneAndUpdate({_id: id}, input, { new: true });
            return result;

        },
        deleteOrder: async (_, {id}, ctx) => {
            
            const order = await Order.findById(id);
            if(!order) {
                throw new Error('Order does not exist')
            }

            if(order.seller.toString() !== ctx.user.id ) {
                throw new Error('No credentials')
            }

            await Order.findOneAndDelete({_id: id});
            return "Order deleted"
        }

    }
}

module.exports = resolvers

