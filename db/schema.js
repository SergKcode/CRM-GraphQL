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

    type Client {
        id: ID
        name: String
        surname: String
        company: String
        email: String
        phone: String
        seller: ID
    }

    type Product{
        id: ID
        name: String
        stock: Int
        price: Float
        created: String

    }

    type TopClient {
        total: Float
        client: [Client]
    }

    type TopSeller {
        total: Float
        seller: [User]
    }

    type Order {
        id: ID
        order: [OrderGroup]
        total: Float
        client: Client
        seller: ID
        date: String
        status: OrderStatus
    }

    type OrderGroup{
        id: ID
        amount: Int
        name: String
        price: Float
    }

    input ProductOrderInput {
        id: ID
        amount: Int
        name: String
        price: Float
    }

    input OrderInput {
        order: [ProductOrderInput]
        total: Float
        client: ID
        status: OrderStatus
    }

    input ProductInput{
        name: String!
        stock: Int!
        price: Float!
 

    }

    input ClientInput {
        name: String!
        surname: String!
        company: String!
        email: String!
        phone: String
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

    enum OrderStatus {
        PENDING
        COMPLETED
        CANCELLED
    }


    
    type Query {
        # Users
        getUser: User

        # Products
        getProducts: [Product]
        getProduct(id: ID!) : Product

        # Clients
        getClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client

        # Order
        getOrders: [Order]
        getOrdersSeller: [Order]
        getOrder(id: ID!) : Order
        getStatusOrders(status: String!): [Order]

        # Advanced queries
        bestClients: [TopClient]
        bestSellers: [TopSeller]
        searchProduct(text: String!) : [Product]
    }

    type Mutation {

        # Users
        newUser(input: UserInput) : User
        authenticateUser(input: AuthenticateInput ) : Token

        # Products
        newProduct(input: ProductInput): Product
        updateProduct( id: ID!, input: ProductInput) : Product
        deleteProduct (id : ID!) : String

        # Clients
        newClient(input: ClientInput) : Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id: ID!) : String

        # Orders
        newOrder(input: OrderInput): Order
        updateOrder(id: ID!, input: OrderInput ) : Order
        deleteOrder(id: ID!) : String

       

    }

    
`
module.exports= typeDefs;