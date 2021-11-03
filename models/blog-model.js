const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    postedAt: {type: String, default: new Date().toString()},
})

module.exports = mongoose.model('blog', blogSchema)