const express = require('express')
const Cust = require('../models/cust')
const router = new express.Router()
const auth=require('../middleware/auth')

router.post('/custs', async (req, res) => {
  //  const Cust = new Cust(req.body)

  //cannot create any Cust without loggin in
    const cust=new Cust({
        ...req.body,//name and address only
        seller:req.user._id
    })

    try {
        await cust.save()
        res.status(201).send(cust)
    } catch (e) {
        res.status(400).send(e)
    }
})

//fetches customers for a specific seller
router.get('/custs', async (req, res) => {
    try {
        //const Custs = await Cust.find({owner:req.user._id})
        await req.user.populate('customers').execPopulate()
        res.send(req.user.customers)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/custs/:id', async (req, res) => {
   // const _id = req.params.id

    try {
        const cust = await Cust.findOne({_id:req.params.id,seller:req.user._id})
                // Cust.aggregate({
                //
                // })
        if (!cust) {
            return res.status(404).send()
        }

        res.send(cust)
    } catch (e) {
        res.status(500).send()
    }
})

//add customer transaction details

router.post('/custs/:id' , async (req,res)=>
{
    try
    {
        const cust = await Cust.findOne({_id:req.params.id,seller:req.user._id})
        const obj={
            price:req.body.price,
            quantity:req.body.quantity,
            dot:new Date(req.body.dot)
        }
        cust.transactions=await cust.transactions.concat(obj)
        //console.log(req.body.dot)
        await cust.save()
        res.send(cust)
    }
    catch (e) {
        res.send({error:e.message})
    }
})

//calculate total

router.get('/custs/total/:id',async(req,res)=>
{
    //const total=sum of price * quantity
    try
    {
        let sum=0;

        let startdate=new Date(req.query.sdate);
        let enddate=new Date(req.query.edate);
        //console.log(startdate);
        const cust = await Cust.findOne({_id:req.params.id,seller:req.user._id})

        const transactions=[...cust.transactions]
        transactions.map( transcation =>
        {
            if(transcation.dot>=startdate && transcation.dot<=enddate)
            {
                sum+=transcation.price*transcation.quantity;
            }
        })
        res.send({total:sum})
    }
    catch (e) {
        res.send({error:e.message})
    }

})

router.delete('/custs/:id', async (req, res) => {
    try {
        const cust = await Cust.findOneAndDelete({_id:req.params.id,seller:req.user._id})

        if (!cust) {
            res.status(404).send()
        }
        res.send({customer:cust,message:"Customer Deleted"})
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
