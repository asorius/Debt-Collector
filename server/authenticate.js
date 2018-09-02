const {Collection}=require('../database/schemas/collection')


const authenticate=(req,res,next)=>{
    const token=req.header('x-auth')
   Collection.findByToken(token).then((collection)=>{
        if(!collection){
            return Promise.reject()
        }
        req.id=collection._id
        req.token=token
        next()
    }).catch((e)=>{
        res.status(401).send()
    })
}

module.exports={authenticate}


