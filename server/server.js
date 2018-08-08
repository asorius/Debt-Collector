const express=require('express')
const bodyParser=require('body-parser')
const _=require('lodash')
const {mongoose}=require('../database/mongoose')
const {ObjectID}=require('mongodb')
const path=require('path')
const publicPath=path.join(__dirname,'../public')
const socketIO=require('socket.io')
const http=require('http')
const {Collection}=require('../database/schemas/collection')


const port=process.env.PORT || 3000
const app=express()
const server=http.createServer(app)
const io=socketIO(server)
app.use(express.static(publicPath))
app.use(bodyParser.json())

//socket refers to individual user currently connected to the server
io.on('connection',(socket)=>{
    socket.on('createNew',async (data)=>{
        console.log(data.cName, data.cPass, data.cAdminPass)
    })
})

// routes@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

app.post('/datas',async(req,res)=>{
    try{
        const collection=new Collection({
            collection_name:req.body.cName,
            password:req.body.cPass,
            password_admin:req.body.cAdminPass
        })
        await collection.save()
        res.send(collection)
    }catch(e){
    e=>res.status(400).send(e)
}})

server.listen(port,()=>console.log('server is up..'))