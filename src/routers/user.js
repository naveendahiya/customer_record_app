const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth=require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token=await user.getToken();
        await user.save()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/users/login',async (req,res)=>
{

    try {
        if(!req.body)
        {
            throw new Error('cannot send empty credentials')
        }
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.getToken();
        
        res.send({user,token})
    } catch (error) {
        res.send(error);
    }

})

router.post('/users/logout',auth,async(req,res)=>
{
    try{
    req.user.tokens=await req.user.tokens.filter(token=>
        {
            return token.token!==req.token
        })
        await req.user.save()
        res.send("Sucessfull logout")
    }
    catch(error)
    {
        res.status(501).send("Failed to logout")
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>
{
    try{
    req.user.tokens=[]
    await req.user.save()
        res.send("Sucessfull logout of all devices")
    }
    catch(error)
    {
        res.status(501).send("Failed to logout out of all devices")
    }
})

router.get('/users/me',auth, async (req, res) => {
    try {
        const users = await User.find({_id:req.user.id})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
            await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
