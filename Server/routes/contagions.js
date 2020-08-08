var express = require('express')
var router = express.Router();
const insertInDb = require('../db/dbConnection').insertDocuments;
const findOfDb = require('../db/dbConnection').findDocuments;
const COLLECTION_CONTAGIONS = 'contagions';

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

router.post('/add', (req, res) => {
    //console.log('Iniciando conexion base de datos...')
    console.log(req.body)
    insertInDb(COLLECTION_CONTAGIONS, (err, results) => {
        if(err) {
            res.status(500).json({message: 'Error al INSERTAR datos de contagio'})
        }else {
            res.status(200).json(results);
        }
    })
})


module.exports = router;