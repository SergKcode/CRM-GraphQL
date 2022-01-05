const {  gql } = require('apollo-server');

//Schema
const typeDefs= gql` 
    
    type User{
        id: ID
        name: String,
        surname: String, 
        email:  String,
        created:  String,
        
    }
    input UserInput{
        name: String,
        surname: String, 
        email:  String,
        password: String, 

    }

    type Query {
        getCourses: String
    }

    type Mutation {
        newUser(input: UserInput) : String

    }

    
`
module.exports= typeDefs;