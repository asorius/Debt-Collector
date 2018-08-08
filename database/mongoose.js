const mongoDB=require('mongodb')
const mongoose= require('mongoose')
mongoose.Promise=global.Promise
process.env.MONGODB_URI='mongodb://ddexta:balamutas1@ds229621.mlab.com:29621/ddextadb'
mongoose.connect( process.env.MONGODB_URI,{ useNewUrlParser: true })
// const db=mongoose.connection
// db.on('error',console.error.bind(console,'connection error'))
module.exports ={
    mongoose
}