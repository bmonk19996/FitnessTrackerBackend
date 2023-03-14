require("dotenv").config()
const express = require("express")
var cors = require('cors')
const app = express()
const apiRouter = require("./api");

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 3000')
// })
//Setup your Middleware and API Router here

app.use("/api", apiRouter);

module.exports = app;
