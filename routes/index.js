var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')
const authController = require('../controllers/auth')
const isAuth = require('../middleware/isAuth')

/* GET */
router.get('/', indexController.getIndex);
router.get('/prelevement',indexController.getPrelevement)
router.get('/confirmation-reservation',indexController.getConfirmation)
router.get('/fiche-renseignement',indexController.getFicheRenseignement)
router.get('/inscription',isAuth,authController.getInscription)
router.get('/connexion',authController.getConnexion)
router.get('/mon-compte',indexController.getMonCompte)
router.get('/fiche-renseignement/:id',indexController.getFormulaire)


/* POST */
router.post('/inscription',authController.postInscription)
router.post('/connexion',authController.postConnexion)
router.post('/deconnexion',authController.postLogout)
router.post('/prelevement',indexController.postPrelevement)
router.post('/fiche-renseignement',indexController.postFicheRenseignement)



module.exports = router;
