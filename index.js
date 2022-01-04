const { ApolloServer} = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const typeDefs = require('./db/schema');
const resolvers =require('./db/resolvers');

//server
const server= new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        const userId = 20
        return {
            userId
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