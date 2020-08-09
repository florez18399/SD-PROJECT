var express = require('express')
var router = express.Router();
const dbConnection = require('../db/dbConnection')
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

router.get('/generatePDF', (req, res) => {
    dbConnection.findGroupByCity((err, results) => {
        if(err) {
            res.status(500).json({message: 'Error al obtener registros de base de datos'})
        } else {
            renderPDF(results, res);
        }
    })
   
})

router.get('/contagionsByCity', (req, res) => {
    dbConnection.findGroupByCity((err, results) => {
        if(err) {
            res.status(500).json({message: 'Error al obtener registros de base de datos'})
        } else {
            console.log(results);
            res.json(results)
        }
    })
})

function renderPDF (resultsContagions, res) { 
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
            pdf.create(data, options).toFile("report.pdf", function (err, data) {
                if (err) {
                    console.log('Error creando pdf');
                    res.send(err);
                } else {
                    res.send("File created successfully");
                }
            });
        }
    })
}

module.exports = router;