var express = require('express');
var router = express.Router();
const adminControllers = require('../controllers/admin')
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
require('dotenv').config();

var s3 = new aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_KEY,
    Bucket:process.env.AWS_BUCKET_NAME,
    region:"eu-west-3",
    ACL:'public-read'
})
 
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

/* GET */
router.get('/', adminControllers.getIndex);
router.get('/nouveau-site',adminControllers.getNouveauSite)
router.get('/editer-site/:siteId',adminControllers.getEditerSite)
router.get('/consulter-creneaux/:siteId',adminControllers.getCreneaux)
router.get('/nouvelle-news',adminControllers.getNouvelleNews)

/* POST */
router.post('/ajouter-site',upload.array('images',6),adminControllers.postAjouterSite)
router.post('/editer-site',upload.array('images',6),adminControllers.postEditerSite)
router.post('/nouvelle-news',upload.array('image',1),adminControllers.postNouvelleNews)

module.exports = router;
