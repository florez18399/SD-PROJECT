var express = require('express')
var router = express.Router();
var multer = require('multer')
const path = require('path')
const insertInDb = require('../db/dbConnection').insertDocuments;
const findOfDb = require('../db/dbConnection').findDocuments;
const COLLECTION_CONTAGIONS = 'contagions';
const fs = require('fs-extra');

const cloudinary = require('cloudinary');
//-----------------------Multer config ------------------------------
var storage = multer.diskStorage({
  destination: path.join(__dirname + '/../', 'public/images'),
  filename: (req, file, cb) => {
     cb(null, new Date().getTime() + path.extname(file.originalname))  
  }  
})
var upload = (multer({storage}).single('image'))
//---------------------------------------------------------
cloudinary.config({
    cloud_name: 'dp13',
    api_key: '374434275378869',
    api_secret: 'SgXhhf7yjFQQoZxngjOFFGR8tN8'
});
//---------------------------------------------------------
router.get('/', (req, res) => {
    console.log(req.body)
    findOfDb(COLLECTION_CONTAGIONS, (err, results) => {
        if(err) {
            res.status(500).json({message: 'Error al buscar documentos'})
        }else {
            res.status(200).json(results);
        }
    })
})

router.post('/add', upload, (req, res) => {
    let contagion = req.body;
    let pathImage = req.file.path;
    console.log(contagion);
    cloudinary.v2.uploader.upload(pathImage, (err, result) => {
        if(err) { 
            console.log('NO se pudo guarda en clouddinary ni en db', err);
        }else{ 
            contagion.public_id = result.public_id;
            contagion.imageURL = result.url;
            console.log('Guardando en bd con id: ', contagion.public_id)
            insertInDb(COLLECTION_CONTAGIONS, contagion, (err, results) => {
                if(err) {
                    res.status(500).json({message: 'Error al INSERTAR datos de contagio'})
                }else {
                    res.status(200).json(results);
                    fs.unlink(pathImage);
                }
            })
        }
    });
    //res.send('Envio de imagenes');    
})
module.exports = router