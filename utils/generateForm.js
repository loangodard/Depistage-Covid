const pdfkit = require('pdfkit')
const fs = require('fs')
const path = require('path')

function generateHeader(doc) {
    const imgpth = path.join(__dirname, `../public/images/logo.png`)
    console.log(imgpth)
    doc
        .image(imgpth, 500, 45, { width: 50 })
        .fillColor("#0D324D")
        .fontSize(20)
        .text("COVID 19 : Feuille de renseignement", 50, 70)
        .moveDown();
}

exports.generate = () => {
    const doc = new pdfkit()
    doc.pipe(fs.createWriteStream('data/formulaires/form-1234FAEF.pdf'))

    generateHeader(doc);
    doc.fillColor("#000").fontSize(15).text("Site et date choisis :", 50, 150);
    //LIGNE 1
    doc.rect(50, 200, 247, 40).fillAndStroke('#0D324D', '#000');
    doc.rect(297, 200, 247, 40).stroke()
    doc.fillColor("#ffffff").fontSize(10).text("Prise de rendez-vous dépistage COVID-19", 60, 216);

    //LIGNE 2
    doc.rect(50, 240, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Nom :", 60, 245);
    doc.rect(297, 240, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Prénom :", 307, 245);
    doc.rect(450, 240, 94, 40).stroke() //3E CASE
    doc.fillColor("#000").fontSize(8).text("Sexe :", 460, 245);

    //LIGNE 3
    doc.rect(50, 280, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Nom de naissance :", 60, 285);
    doc.rect(297, 280, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Date de naissance :", 307, 285);

    //LIGNE 4
    doc.rect(50, 320, 247, 80).stroke()
    doc.fillColor("#000").fontSize(8).text("Adresse :", 60, 325);
    doc.fillColor("#000").fontSize(8).text("Code Postal :", 60, 365);
    doc.fillColor("#000").fontSize(8).text("Ville :", 170, 365);
    doc.rect(297, 320, 247, 80).stroke()
    doc.fillColor("#000").fontSize(8).text("Nom du médecin traitant :", 307, 325);

    //LIGNE 5
    doc.rect(50, 400, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Email :", 60, 405);
    doc.rect(297, 400, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Téléphone :", 307, 405);

    //LIGNE 6
    doc.rect(50, 440, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("N° de sécurité sociale :", 60, 445);
    doc.rect(297, 440, 247, 40).stroke()
    doc.fillColor("#000").fontSize(8).text("Caisse de ratachement :", 307, 445);
    doc.fillColor("#000").fontSize(8).text("Département :", 307, 465);

    doc.end();
}