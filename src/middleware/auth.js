const jwt=require('jsonwebtoken');
const User=require('../models/user');

const auth=async(req,res,next)=>
{
    try 
    {
    //extract token out of url

        const token=req.header('Authorization').replace('Bearer ','');
        if(!token){
            res.send({message:"token not found"})
        }
        //check for whether we created it or not
        const decode=jwt.verify(token,'Customer_record_app');
       if(!decode){
           res.send({error:"cannot be decoded"})
       }
    //check wheather its still avilable or not, tokens.token is a property that is 
    //to be searched and a string at the same time thats why it is in quotes and also not 
    // decode.tokens.token because we have to search it
    const user=await User.findOne({_id:decode._id,'tokens.token':token})    

        if(!user)
        {
            throw new Error("cannot find user");
        }
        req.token=token
        req.user=user
        next()

    } 
    catch (error) 
    {
            res.send({error:'cannot authenticate'})       
    }
}

module.exports=auth