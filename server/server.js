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
const {authenticate}=require('../server/authenticate')
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
// if login pass is simple user then load non-edit version, if admin,load editable page version where adds deletes go through patch/delete authenticated routes
app.post('/datas/login',async(req,res)=>{
    try{
        const loginDetails=_.pick(req.body,['name','pass'])
        const response=await Collection.findByCredentials(loginDetails.name,loginDetails.pass)
        const token=await response.collection.generateAuthToken(response.loginType)
        res.header('x-auth',token).send({
            "name":response.collection.collection_name,
            "data":response.collection.data,
            "sum":response.collection.sum,
            "access":response.loginType,
            "token":token
        })
    }catch{
        res.status(400).send()
    }
})
//.lpougout and delete token
app.patch('/datas/logout',authenticate,async(req,res)=>{ 
    try{
        const id=req.id
        const token=req.token
        let previous=await Collection.findById(id)
        const resp=await Collection.findOneAndUpdate({_id:id},{$pull:{tokens:{token:token}}},{new:true})
        if(previous.tokens.length===resp.tokens.length){
            res.send({deleted:false})
        }else{
            res.send({deleted:true})
        }
    }catch{res.status(400).send('loyugout error')}
})

//route to autogetdata by token
app.get('/datas',authenticate,async (req,res)=>{
    try{
        const token=req.token
        const id=req.id
        const resp=await Collection.findByToken(token)
        res.send({
            "name":resp.foundCollection.collection_name,
            "data":resp.foundCollection.data,
            "sum":resp.foundCollection.sum,
            'access':resp.access
            
        })
    }catch{
        res.status(400).send()
    }
})

//   Create new Collection
app.post('/datas',async(req,res)=>{
    try{
        const collection=new Collection({
            collection_name:req.body.cName,
            password:req.body.cPass,
            password_admin:req.body.cAdminPass
        })
        await collection.save()
        const token=await collection.generateAuthToken('admin')
        res.header('x-auth',token).send(
            {
                collection_name:collection.collection_name,
                token:collection.tokens[0].token,
                access:collection.tokens[0].access
            })
    }catch(e){
    res.status(400).send({e,created:false})
}})

// add new data only admins,add btn only render fo radmins
app.patch('/datas/add',authenticate,async(req,res)=>{
    
    try{
        const id=req.id
        const body=req.body
        const token=req.token
        body.date=moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        const resp=await Collection.findOneAndUpdate({_id:id},{$push:{data:body}},{new:true})
        await resp.save()
        res.header('x-auth',token).send({
            "name":resp.collection_name,
            "data":resp.data,
            "sum":resp.sum,
            'access':resp.tokens[0].access
        })
    }catch{res.status(400).send('edit error')}
    
})

//edit data 

app.patch('/datas/edit',authenticate,async(req,res)=>{
    
    try{
        const id=req.id
        const body=req.body
        const token=req.token
        let editDate=moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        const collectionToEdit=await Collection.findById(id)
        let edited=false
        const newdata=collectionToEdit.data.map((el)=>{
                    if(el.date===body.findDate){
                        el.editDate=editDate
                        el.amount=body.amount
                        el.details=body.details
                        edited=true
                    }
                    return el
                })
        const updated=await Collection.findByIdAndUpdate(id,{$set:{data:newdata}},{new:true})
        await updated.save()
        let nsum=updated.sum
        res.send({edited,editDate,nsum})
    }catch{res.status(400).send('edit error')}
    
})

//delete single add
app.delete('/datas/:date',authenticate,async(req,res)=>{
    try{
        const id=req.id
        const findDate=req.params.date
        let previous=await Collection.findById(id)
        const updatedCollection=await Collection.findByIdAndUpdate(id,{$pull:{data:{date:findDate}}},{new:true})
        await updatedCollection.save()
        let sum=updatedCollection.sum
        deleted=true
        if(previous.data.length===updatedCollection.data.length){
            deleted=false
        }
        res.send({deleted,sum})
        
    }catch{
        res.status(400).send({deleted:false,error:'error'})
    }
})
//delete whole collection

app.delete('/delete',authenticate,async(req,res)=>{
    try{
        const id=req.id
        let collection=await Collection.findByIdAndRemove(id)
        
        if(!collection){
            res.send({result:'not found'})
        }else{
            res.send(collection)
        }
        
    }catch{
        res.status(400).send({deleted:false,error:'error'})
    }
})


    


server.listen(port,()=>console.log('server is up..'))