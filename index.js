const { ApolloServer} = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

const connectDB = require('./config/db')

//Connect DB

connectDB()

//server
const server= new ApolloServer({
    typeDefs,
    resolvers,
   
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground({})
    ]
})


//run server
server.listen().then(({url})=>{
    console.log(`Server running on  ${url}`)
})