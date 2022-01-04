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
const resolvers = {
    Query:{
        getCourses:( _, {input}, ctx )=> {
            const clients = Clients.find({seller: ctx.userId})
            console.log( ctx )
            const result = courses.technology === input.technology
            return result
        }
      
    }
}

module.exports = resolvers
