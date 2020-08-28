const Site = require('../models/site')

exports.getIndex = (req,res,next) => {
    res.render('admin/index',{
        pageTitle:'Espace Administrateur'
    })
}

exports.getNouveauSite = (req,res,next) => {
    res.render('admin/nouveau-site',{
        pageTitle:'Nouveau Site'
    })
}

exports.postAjouterSite = (req,res,next) => {
    const lenOfBody = Object.keys(req.body).length
    const nbCreneaux = (lenOfBody - 5)/3
    let creneaux = []
    for(i = 1; i <= nbCreneaux; i++){
        creneaux.push([req.body['dateCreneau'+i],req.body['debutCreneau'+i]+' - '+req.body['finCreneau'+i],0])
    }
    console.log(creneaux)
    const nomSite = req.body.nomSite
    const adresseSite = req.body.adresseSite
    const cpSite = req.body.cpSite
    const villeSite = req.body.villeSite
    const descriptionSite = req.body.descriptionSite
    const site = new Site({
        nom:nomSite,
        adresse:{
            voie:adresseSite,
            cp:cpSite,
            ville:villeSite
        },
        description:descriptionSite,
        creneaux:creneaux
    })

    site.save()

    res.redirect('/')
}