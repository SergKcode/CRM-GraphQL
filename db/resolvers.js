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
        getCourses:()=>"Any"
      
    }, 
    Mutation:{
        newUser: (_, { input } ) =>{
            console.log(input);
            return "Creating"
        }
    }
}

module.exports = resolvers
