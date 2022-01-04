const {  gql } = require('apollo-server');

//Schema
const typeDefs= gql` 

   

    type Course{
        title:String,
        
    }
    input CourseInput{
        technology:String
    }

    type Technology{
        technology:String
        
    }

    type Query{
        getCourses ( input:CourseInput! ): [Course]
        getTechnology: [Technology]
    }

    
`
module.exports= typeDefs;