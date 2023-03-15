require("dotenv").config()
const express = require("express")
const cors = require('cors')
const app = express()
const apiRouter = require("./api");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 3000')
// })
//Setup your Middleware and API Router here





app.use(express.json());

app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});


app.use("/api", apiRouter);

module.exports = app;
