const { mongoose }=require('../mongoose')

const jwt=require('jsonwebtoken')
const _=require('lodash')
const bcrypt=require('bcrypt')

const CollectionSchema=new mongoose.Schema({
    collection_name:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        minlength:4
    },
    password:{
        type:String,
        require:true,
        minlength:2
    },
    password_admin:{
        type:String,
        require:true,
        minlength:2
    },
    data:[],
    sum:{
        type:Number,
        default:0
    },
    tokens:[
        {
            access:{
                type:String,
                require:true
            },
            token:{
                type:String,
                require:true 
            }
        }
    ]

})

CollectionSchema.methods.generateAuthToken=function(user){
    const collection=this
    let access=user
    const token=jwt.sign(
        {_id:collection._id.toHexString(),access}
        ,'some secret').toString()

    collection.tokens=collection.tokens.concat([{access,token}])
    return collection.save().then(()=>{return token})
}

CollectionSchema.statics.findByToken=function(token){
    const collection=this
    let decoded
    try{
        decoded=jwt.verify(token,'some secret')
    }catch(e){
        return Promise.reject()
    }

    return collection.findOne({
        '_id':decoded._id,
        'tokens.token':token
    })
}

CollectionSchema.methods.removeToken=function(token){
    const collection=this
    return collection.update({
        $pull:{
            tokens:{token}
        }
    })
}
CollectionSchema.pre('save',function(next){
    const collection=this
    if(collection.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(collection.password,salt,(err,res)=>{
                collection.password=res
                bcrypt.hash(collection.password_admin,salt,(err,res)=>{
                    collection.password_admin=res
                    next()
                })
            })
            

        })
    }else{next()}
})

CollectionSchema.statics.findByCredentials= async function(name,password){
    const collection=this
    const foundCollection=await collection.findOne({collection_name:name})  
    if(!foundCollection){return 'incorrect collection name'}
    const userMatch=await bcrypt.compare(password,foundCollection.password)
    const adminMatch=await bcrypt.compare(password,foundCollection.password_admin)
    if(userMatch){
        return {collection:foundCollection,loginType:'user'}
    }else if(adminMatch){
        return {collection:foundCollection,loginType:'admin'}
    }else{
        return {noMatch:true}
    }
}

const Collection=mongoose.model('Collection',CollectionSchema)
module.exports={Collection}