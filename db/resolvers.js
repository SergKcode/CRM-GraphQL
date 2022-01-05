const User = require("../models/User");
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
        } ,
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


        }
    }
}

module.exports = resolvers
