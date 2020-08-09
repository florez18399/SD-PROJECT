const express = require('express')
const cors = require('cors')
const path = require('path');
const routeContagions = require('./routes/contagions')
const app = express()
const port = 3000
//-----------------------------------------

///----------------------------------------
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/public/images',express.static(path.join(__dirname, 'public/images')));
//----------------------------------------
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(cors())
app.use('/contagions', routeContagions)