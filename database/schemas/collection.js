const { mongoose }=require('../mongoose')
const CollectionSchema=new mongoose.Schema({
    collection_name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:4
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    password_admin:{
        type:String,
        required:true,
        minlength:6
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
                // require:true
            },
            token:{
                type:String,
                // require:true NEED TO FIXT SUM NOT DISPLAYING
            }
        }
    ]

})


const Collection=mongoose.model('Collection',CollectionSchema)
module.exports={Collection}