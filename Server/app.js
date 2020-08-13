const express = require('express')
const cors = require('cors')
const path = require('path');
const routeContagions = require('./routes/contagions')
const routeReports = require('./routes/reports')
const app = express()
const port = process.env.PORT || 3000
//-----------------------------------------

///------------------------------------------
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/reports',express.static(path.join(__dirname, 'public/reports')));
//-------------------------------------------
app.get('/', (req, res) => {
  res.send('Hola mundo desde ' + process.env.NAME_SERVER)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(cors())
app.use('/contagions', routeContagions)
app.use('/reports', routeReports)

/**
 * docker network create --driver=bridge --subnet=172.20.0.0/16 red-project
 * 
 * docker run --name nginx-server -p 4010:80 --network=red-project --ip 172.20.0.2 -d  nginx
 */