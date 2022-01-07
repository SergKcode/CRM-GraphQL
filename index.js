const { ApolloServer} = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

//Connect DB

connectDB()

//server
const server= new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
      

        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET );
                return {
                    user
                }
            } catch (error) {
                console.log('There is an error');
                console.log(error);
            }
        }
    },
   
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground({})
    ]
})


//run server
server.listen().then(({url})=>{
    console.log(`Server running on  ${url}`)
})