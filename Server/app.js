const express = require('express')
const routeContagions = require('./routes/contagions')
const app = express()
const port = 3000
//-----------------------------------------
app.use('/contagions', routeContagions)
//----------------------------------------
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

