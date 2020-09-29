const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const custRouter = require('./routers/cust')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(custRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const bcrypt = require('bcryptjs')
