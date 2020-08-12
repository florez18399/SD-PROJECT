var express = require('express')
var router = express.Router();
const dbConnection = require('../db/dbConnection')
const clientRedis = require('../db/redisConnection')
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
const NAME_SETS = 'cities';

router.get('/generatePDF', (req, res) => {
    dbConnection.findGroupByCity((err, results) => {
        if(err) {
            res.status(500).json({message: 'Error al obtener registros de base de datos'})
        } else {
            renderPDF(req.headers.host, results, res);
            saveResultsInRedis(results);
        }
    })
})

router.get('/contagionsByCity', (req, res) => {
    clientRedis.smembers(NAME_SETS, (err, results) => {
        if(err) {
            res.status(500).json({message: 'Fallo al obtener datos de redis'})
        }else {
            console.log(results);
            getHashes(results, (hashes) => {
                console.log(hashes);
                res.status(200).json(hashes);
            })
        }
    })
})

function getHashes(ids, cb) {
    let hashes = [];
    ids.forEach(id => {
        clientRedis.hgetall(id, (err, results) => {
            hashes.push(results);
            if(ids.length == hashes.length) {
                cb(hashes);
            }
        })
    });
}

function saveResultsInRedis(results) {
    console.log('Guardando resultados en redis');
    let index = 0;
    results.forEach(element => {
        clientRedis.del(NAME_SETS);
        let id= 'city:'+ index;
        console.log(id)
        clientRedis.hset(id, "name", element._id, "count", element.contagiados, (err, results)=> {
            if(err) {   
                console.log(err);
            }else{
                clientRedis.sadd('cities', id);
            }
        });
        
        index++; 
    });
}

function renderPDF (host, resultsContagions, res) { 
    ejs.renderFile(path.join(__dirname, '../views/', "report.ejs"), {results:resultsContagions}, (err, data) => {
        if (err) {
            console.log('Error renderizando archivo');
            res.send(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile("./public/reports/report.pdf", function (err, data) {
                if (err) {
                    console.log('Error creando pdf');
                    res.send(err);
                } else {
                    res.send(host + '/reports/report.pdf');
                }
            });
        }
    })
}

module.exports = router;