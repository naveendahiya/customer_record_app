const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://user1:pTLecUakR9PyV8ZF@cluster0.opobk.mongodb.net/customer-record-app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
