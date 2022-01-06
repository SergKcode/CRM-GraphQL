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

    type Token {
        token : String

    }

    type Product{
        id: ID
        name: String
        stock: Int
        price: Float
        created: String

    }

    input ProductInput{
        name: String!
        stock: Int!
        price: Float!
 

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

    
    type Query {
        # Users
        getUser(token:String!) : User

        # Products
        getProducts: [Product]
        getProduct(id: ID!) : Product
    }

    type Mutation {

        # Users
        newUser(input: UserInput) : User
        authenticateUser(input: AuthenticateInput ) : Token

        # Products
        newProduct(input: ProductInput): Product
        updateProduct( id: ID!, input: ProductInput) : Product
        deleteProduct (id : ID!) : String

    }

    
`
module.exports= typeDefs;