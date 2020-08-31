const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    titre:{type:String},
    contenu:{type:String},
    date:{type:String},
    image:{type:String}
});


module.exports = mongoose.model('News', userSchema);