const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const Cust=require('./cust')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }]
})

userSchema.virtual('customers',{
    ref:'Cust',
    localField:'_id',
    foreignField:'seller'
})

userSchema.methods.getToken=async function()    
{
    const user=this

    const token= jwt.sign({ _id : user._id.toString() },'Customer_record_app')
    user.tokens=await user.tokens.concat({token})
    
    await user.save()
    return  token
}


userSchema.statics.findByCredentials=async(email,password)=>
{
    const user=await User.findOne({email})


    if(!user)
    {
        throw new Error('unable to login')
    }
    const Ismatch=await bcrypt.compare( password , user.password)
    //console.log(Ismatch);

    if(!Ismatch)
    {
        throw new Error('unable to login')
    }

    return user; 

}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove',async function (next){

const user=this
await Cust.deleteMany({seller:user._id})
next()

})


const User = mongoose.model('User', userSchema)

module.exports = User