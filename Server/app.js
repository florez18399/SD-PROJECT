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

//app.use(cors(
app.use('/contagions', routeContagions)
app.use('/reports', routeReports)

/**
 * docker network create --driver=bridge --subnet=172.20.0.0/16 red-project
 * 
 * docker run --name mynginx -p 4010:80 --network=red-project --ip 172.20.0.2 -d  nginx-server
 * 
 * Cadvisor
 * sudo docker run -d --volume=/:/rootfs:ro --volume=/var/run:/var/run:ro --volume=/sys:/sys:ro --volume=/var/lib/docker/:/var/lib/docker:ro --volume=/dev/disk/:/dev/disk:ro --publish=9000:8080 --name=cadvisor google/cadvisor:latest
 * Prometheus
 * docker run -d --name prom -p 9090:9090 -v "$(pwd)"/tmp/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus:v2.14.0
 */