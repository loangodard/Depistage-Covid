var express = require('express');
var router = express.Router();
const adminControllers = require('../controllers/admin')

/* GET */
router.get('/', adminControllers.getIndex);
router.get('/nouveau-site',adminControllers.getNouveauSite)

/* POST */
router.post('/ajouter-site',adminControllers.postAjouterSite)

module.exports = router;
