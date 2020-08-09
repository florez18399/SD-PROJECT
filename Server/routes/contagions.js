var express = require('express')
var router = express.Router();
var multer = require('multer')
const path = require('path')
const insertInDb = require('../db/dbConnection').insertDocuments;
const findOfDb = require('../db/dbConnection').findDocuments;
const COLLECTION_CONTAGIONS = 'contagions';
//-----------------------Multer config ------------------------------
var storage = multer.diskStorage({
  destination: path.join(__dirname + '/../', 'public/images'),
  filename: (req, file, cb) => {
     cb(null, new Date().getTime() + path.extname(file.originalname))  
  }  
})
var upload = (multer({storage}).single('image'))
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

router.post('/add', upload,(req, res) => {
    let contagion = req.body;
    contagion.server_location = req.headers.host; 
    contagion.path_image = '/public/images/' + req.file.filename;
    console.log(contagion);
    //res.send('Envio de imagenes');
    insertInDb(COLLECTION_CONTAGIONS, contagion, (err, results) => {
        if(err) {
            res.status(500).json({message: 'Error al INSERTAR datos de contagio'})
        }else {
            res.status(200).json(results);
        }
    })
})


module.exports = router