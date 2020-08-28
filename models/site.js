const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nom:{
        type:String,
        required:true
    },
    adresse:{
        type:Object,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    creneaux:{
        type:Array
    }
});


module.exports = mongoose.model('Site', userSchema);