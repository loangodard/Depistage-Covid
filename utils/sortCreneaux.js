const moment = require('moment')

exports.sort = (creneaux) => {
    moment.locale('fr')
    const test3 =[{date:"31/12/1999",debut:6,fin:9},{date:"28/12/1999",debut:10,fin:12},{date:"28/12/1999",debut:6,fin:9},{date:"30/12/1999",debut:6,fin:9}]
    const result = creneaux.slice()
    result.sort((a,b) => moment(a.date, "DD/MM/YYYY").diff(moment(b.date, "DD/MM/YYYY"))) // On tri par date
    result.sort((a,b) => {if(a.date == b.date){return a.debut-b.debut}}) // Puis on tri par créneau horaire
    return result
}