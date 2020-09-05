const Site = require('../models/site')
const generateForm = require('../utils/generateForm')
const moment = require('moment')
const pdfkit = require('pdfkit')
const fs = require('fs')


exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'CTRS Aubois'
        ,isLoggedIn: req.session.isLoggedIn
    });
}

exports.getPrelevement = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Site.find().then(sites => {
        console.log(sites)
        res.render('prelevement', {
            pageTitle: 'Choisir une site de prélèvement',
            sites: sites,
            moment: moment,
            errorMessage: message
            ,isLoggedIn: req.session.isLoggedIn
        })
    })
}

exports.postPrelevement = (req, res, next) => {
    //Le bouton a l'id du site sur lequel on clic
    //Le select-siteId a l'id du créneau selectionné pour le site dont le bouton a été clické
    const siteId = req.body.butt
    const creneauId = req.body["select-" + siteId]
    console.log(creneauId)

    if (!creneauId) {
        req.flash('error', 'Veuillez choisir un créneau horaire');
        return res.redirect('/prelevement');
    }

    Site.findById(siteId).then(site => {
        var newCreneau = {
            ...site.creneaux.find(c => c.id === creneauId)
        };
        newCreneau.reservations += 1;
        const actualReservationsIndex = site.creneaux.findIndex(c => c.id === creneauId);
        var actualCreneaux = [...site.creneaux]
        actualCreneaux[actualReservationsIndex] = newCreneau
        site.creneaux = actualCreneaux
        site.save()
        req.session.reservation = {
            site: site,
            creneau: newCreneau
        }
        res.redirect('/confirmation-reservation')
    })
}

exports.getConfirmation = (req, res, next) => {
    const site = req.session.reservation.site
    const creneau = req.session.reservation.creneau
    res.render('confirmation-reservation', {
        pageTitle: "Confirmation de la réservation",
        site: site,
        creneau: creneau
        ,isLoggedIn: req.session.isLoggedIn
    })
}

exports.getFicheRenseignement = (req, res, next) => {
    res.render('fiche-renseignement', {
        pageTitle: 'Fiche de renseignement'
        ,isLoggedIn: req.session.isLoggedIn
    })
}

exports.getMonCompte = (req, res, next) => {
    res.render('monCompte', {
        pageTitle: 'Mon Compte'
        ,isLoggedIn: req.session.isLoggedIn
    });
}

exports.postFicheRenseignement = (req,res,next) => {
    const data ={
        site:req.session.reservation.site.nom,
        date:req.session.reservation.creneau.date +" "+req.session.reservation.creneau.debut+"h - "+req.session.reservation.creneau.fin+"h",
        nom:req.body.nom,
        prenom:req.body.prenom,
        sexe:req.body.sexe,
        nomNaissance:req.body.nomNaissance,
        dateNaissance:req.body.dateNaissance,
        adresse:req.body.adresse,
        cp:req.body.cp,
        ville:req.body.ville,
        medecin:req.body.medecin,
        email:req.body.email,
        tel:req.body.tel,
        secu:req.body.secu,
        caisse:req.body.caisse,
        departement:req.body.departement
    }
    req.session.dataFormulaire = data
    res.redirect('/fiche-renseignement/'+Math.random().toString())
}

exports.getFormulaire = (req, res, next) => {
    const data = req.session.dataFormulaire
    const id = req.params.id
    const site = data.site
    const date = data.date
    const nom= data.nom
    const prenom= data.prenom
    const sexe = data.sexe
    const nomNaissance = data.nomNaissance
    const dateNaissance = data.dateNaissance
    const adresse = data.adresse
    const cp = data.cp
    const ville = data.ville
    const medecin = data.medecin
    const email= data.email
    const tel= data.tel
    const secu= data.secu
    const caisse= data.caisse
    const departement = data.departement

    // generateForm.generate(id, "Hôpital de Sens", "05/09/2020", "Godard", "Loan", "H", "Godard", "30/12/1999", "15 rue des crayolots", "89100", "Nailly", "Génin", "loan.godard031@gmail.com", "0647062680", "xxxxxxxxxxxxxxxxxx", "D'epargne", "Yonne")
    const doc = new pdfkit()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
        'Content-Disposition',
        'inline; filename="form-' + id + '.pdf"'
    )
    doc.pipe(fs.createWriteStream('data/formulaires/form-'+id+'.pdf'))
    doc.pipe(res)

    generateForm.generateHeader(doc);
    console.log('here')
    doc.fillColor("#000").fontSize(15).text("Site et date choisis :", 50, 150);
    doc.fillColor("#000").fontSize(18).text(site+", "+date, 190, 148);

    //LIGNE 1
    doc.rect(50, 200, 247, 40).fillAndStroke('#0D324D', '#000');
    doc.rect(297, 200, 247, 40).stroke()
    doc.fillColor("#ffffff").fontSize(10).text("Prise de rendez-vous dépistage COVID-19", 60, 216);

    //LIGNE 2
    doc.rect(50, 240, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Nom :", 60, 245);
    doc.fillColor("#000").fontSize(10).text(nom, 130, 255);
    doc.rect(297, 240, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Prénom :", 307, 245);
    doc.fillColor("#000").fontSize(10).text(prenom, 350, 255);
    doc.rect(450, 240, 94, 40).stroke() //3E CASE
    doc.fillColor("#000").fontSize(8).text("Sexe :", 460, 245);
    doc.fillColor("#000").fontSize(10).text(sexe, 495, 255);

    //LIGNE 3
    doc.rect(50, 280, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Nom de naissance :", 60, 285);
    doc.fillColor("#000").fontSize(10).text(nomNaissance, 130, 295);
    doc.rect(297, 280, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Date de naissance :", 307, 285);
    doc.fillColor("#000").fontSize(10).text(dateNaissance, {align: 'center'});

    //LIGNE 4
    doc.rect(50, 320, 247, 80).stroke()
    doc.fillColor("#000").fontSize(8).text("Adresse :", 60, 325);
    doc.fillColor("#000").fontSize(10).text(adresse, 100, 335);
    doc.fillColor("#000").fontSize(8).text("Code Postal :", 60, 365);
    doc.fillColor("#000").fontSize(10).text(cp, 115, 365);
    doc.fillColor("#000").fontSize(8).text("Ville :", 170, 365);
    doc.fillColor("#000").fontSize(10).text(ville, 195, 365);
    doc.rect(297, 320, 247, 80).stroke()
    doc.fillColor("#000").fontSize(8).text("Nom du médecin traitant :", 307, 325);
    doc.fillColor("#000").fontSize(10).text("Dr."+" "+medecin,{align: 'center'});

    //LIGNE 5
    doc.rect(50, 400, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Email :", 60, 405);
    doc.fillColor("#000").fontSize(10).text(email, 90, 415);
    doc.rect(297, 400, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Téléphone :", 307, 405);
    doc.fillColor("#000").fontSize(10).text(tel, {align: 'center'});

    //LIGNE 6
    doc.rect(50, 440, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("N° de sécurité sociale :", 60, 445);
    doc.fillColor("#000").fontSize(10).text(secu, 140, 455);
    doc.rect(297, 440, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Caisse de ratachement :", 307, 445);
    doc.fillColor("#000").fontSize(10).text(caisse, 397, 444);
    doc.fillColor("#000").fontSize(8).text("Département :", 307, 465);
    doc.fillColor("#000").fontSize(10).text(departement, 365, 464);

    doc.end();
    
    
}