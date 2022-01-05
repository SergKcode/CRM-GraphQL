const {  gql } = require('apollo-server');

//Schema
const typeDefs= gql` 
    
    type User{
        id: ID
        name: String
        surname: String
        email: String
        created:  String
        
    }
    input UserInput{
        name: String!
        surname: String!
        email: String!
        password: String!

    }
    input AuthenticateInput {
        email: String!
        password: String!
    }

    type Token {
        token : String

    }

    type Query {
        getUser(token:String!) : User
    }

    type Mutation {
        newUser(input: UserInput) : User
        authenticateUser (input: AuthenticateInput ) : Token

    }

    
`
module.exports= typeDefs;