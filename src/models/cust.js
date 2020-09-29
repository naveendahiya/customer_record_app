const mongoose = require('mongoose')

const Cust = mongoose.model('Cust', {
    name:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required:true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    transactions:[{
        price:{
            type:Number,
            require:true,
            default:0
        },
        quantity:{
            type:Number,
            required:true
        },
        dot:{
            type:Date,
            required:true,
            unique:true
        }
    }]
})

module.exports = Cust