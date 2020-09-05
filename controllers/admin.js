const Site = require('../models/site')
const Creneau = require('../models/creneau')
const News = require('../models/news')
const moment = require('moment')
const sortCreneaux = require('../utils/sortCreneaux')

exports.getIndex = (req, res, next) => {
    Site.find().then(sites => {
        res.render('admin/index', {
            pageTitle: 'Espace Administrateur',
            sites: sites
        })
    })
}

exports.getNouveauSite = (req, res, next) => {
    res.render('admin/nouveau-site', {
        pageTitle: 'Nouveau Site'
    })
}

exports.postAjouterSite = (req, res, next) => {
    var images = req.files.map(f => {
        return f.location
    })
    const lenOfBody = Object.keys(req.body).length
    const nbCreneaux = (lenOfBody - 5) / 3
    let creneaux = []
    const creneauxBruts = Object.values(req.body).slice(5)
    const nomSite = req.body.nomSite
    const adresseSite = req.body.adresseSite
    const cpSite = req.body.cpSite
    const villeSite = req.body.villeSite
    const descriptionSite = req.body.descriptionSite
    const site = new Site({
        nom: nomSite,
        adresse: {
            voie: adresseSite,
            cp: cpSite,
            ville: villeSite
        },
        description: descriptionSite,
        images: images,
    })

    for (i = 0; i < nbCreneaux * 3; i = i + 3) {
        const id = new Date().valueOf().toString() + Math.random().toString()
        creneaux.push({id:id,date: creneauxBruts[i], debut: Number(creneauxBruts[i + 1]), fin: Number(creneauxBruts[i + 2]), reservations: 0 })
    }



    site.creneaux = sortCreneaux.sort(creneaux)

    site.save()
    res.redirect('/admin/')
}

exports.getEditerSite = (req, res, next) => {
    const siteId = req.params.siteId
    Site.findById(siteId).then(site => {
        res.render('admin/editer-site.ejs', {
            pageTitle: 'Editer le site',
            site: site
        })
    })
}

exports.postEditerSite = (req, res, next) => {
    var images = req.files.map(f => {
        return f.location
    })
    const lenOfBody = Object.keys(req.body).length
    const nbCreneaux = (lenOfBody - 6) / 5
    let creneaux = []
    console.log(req.body)
    const creneauxBruts = Object.values(req.body).slice(6)
    console.log(creneauxBruts)
    for (i = 0; i < nbCreneaux * 5; i = i + 5) {
        creneaux.push({ date: creneauxBruts[i], debut: Number(creneauxBruts[i + 1]), fin: Number(creneauxBruts[i + 2]), reservations: Number(creneauxBruts[i + 3]),id :(new Date().valueOf().toString() + Math.random().toString())})
    }
    const nomSite = req.body.nomSite
    const adresseSite = req.body.adresseSite
    const cpSite = req.body.cpSite
    const villeSite = req.body.villeSite
    const descriptionSite = req.body.descriptionSite
    const siteId = req.body.siteId

    Site.findById(siteId).then(site => {
        if (images.length > 0) {
            site.nom = nomSite
            site.adresse = {
                voie: adresseSite,
                cp: cpSite,
                ville: villeSite
            }
            site.description = descriptionSite
            site.creneaux = sortCreneaux.sort(creneaux)
            site.images = images
        } else {
            site.nom = nomSite
            site.adresse = {
                voie: adresseSite,
                cp: cpSite,
                ville: villeSite
            }
            site.description = descriptionSite
            site.creneaux = sortCreneaux.sort(creneaux)
        }
        site.save()
        res.redirect('/admin')
    })
}

exports.getCreneaux = (req,res,next) => {
    const siteId = req.params.siteId
    Site.findById(siteId).then(site => {
        res.render('admin/consulter-creneaux',{
            pageTitle:'Consultation des créneaux',
            site : site
        })
    })
}

exports.getNouvelleNews = (req,res,next) => {
    res.render('admin/nouvelle-news',{
        pageTitle:"Nouvelle News"
    })
}

exports.postNouvelleNews = (req,res,next) => {
    const titre = req.body.titre
    const contenu = req.body.contenu
    var image = req.files.map(f => {
        return f.location
    })
    moment.locale('fr')
    const date = moment().format('DD/MM/yy')
    //TODO : ajouter l'image par défaut si pas d'image
    const news = new News({
        titre:titre,
        contenu:contenu,
        image:image[0],
        date:date
    })
    news.save()
    res.redirect('/admin')
}