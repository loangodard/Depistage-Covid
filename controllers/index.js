const User = require('../models/user')
const generateForm = require('../utils/generateForm')


exports.getIndex = (req, res, next) => {
    generateForm.generate()
    res.render('index', { pageTitle: 'Aller-Retour' });
}

exports.getMonCompte = (req, res, next) => {
    res.render('monCompte', { pageTitle: 'Mon Compte' });
}

