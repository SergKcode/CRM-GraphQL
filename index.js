
const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

//Schema
const typeDefs= gql` 

    type Query{
        getCourses: [Courses]
    }

    type Courses{
        title:String,
        technology:String
    }
`


const courses = [
    {
        title: 'JavaScript ',
        technology: 'JavaScript ES6',
    },
    {
        title: 'Angular 10',
        technology: 'Angular',
    },
    {
        title: 'Node.js ',
        technology: 'Node.js'
    }, 
    {
        title: 'ReactJS ',
        technology: 'React'
    }
];

//Resolvers
const resolvers={
    Query:{
        getCourses:()=> courses
    }
}



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