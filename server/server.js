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
const moment=require('moment')


const port=process.env.PORT || 3000
const app=express()
const server=http.createServer(app)
const io=socketIO(server)
app.use(express.static(publicPath))
app.use(bodyParser.json())


//socket refers to individual user currently connected to the server
io.on('connection',(socket)=>{
    socket.on('callToCreate',(inputData)=>{
        socket.emit('callToShowDetailsOf',inputData)
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
    res.status(400).send(e)
}})
app.patch('/datas/:id',async(req,res)=>{
    
    try{
        const id=req.params.id
        const body=req.body
        body.date=moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        const updatedItem=await Collection.findByIdAndUpdate(id,{$push:{data:body},$inc:{sum:body.amount}},{new:true})
        res.send(updatedItem)
    }catch{res.status(400).send('edit error')}
    
})
app.delete('/datas/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const findDate=req.body.date
        
        const updatedItem=await Collection.findByIdAndUpdate(id,{
            $pull:{
                data:{
                    date:findDate
                    }
                }
            },{new:true})
        res.send(updatedItem)
    }catch{
        res.status(400).send('delete error')
    }
})

server.listen(port,()=>console.log('server is up..'))