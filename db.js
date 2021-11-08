const mongoose = require('mongoose');

const uri =  process.env.DB_URI;


mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {

if (err) {
    console.log('Connection to database fail' + err)
} else{
    console.log('Connection to database successful')
}

})