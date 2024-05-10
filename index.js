const express = require("express")
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl.model.js')
const path = require('path');

const app = express();
const run = async() =>{
    await mongoose.connect('mongodb://127.0.0.1:27017/urls_short',

    {
      family: 4,
  }).then(() => {
      console.log("Conexion con MongoDB existosa ");
  },
    { useNewUrlParser: true, useUnifiedTopology: true })
}


app.use(express.static('src'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find();

  res.render('home', { urls: shortUrls });
})

app.post('/shortUrls', async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:urlsRedirect', async (req, res) => {
  const sUrl = await shortUrl.findOne({ short: req.params.urlsRedirect })
  if (sUrl == null) return res.sendStatus(404)

  sUrl.clicks++
  sUrl.save()

  res.redirect(sUrl.full)
})

app.listen(6090,() => {
    console.log("Escuchando en el puerto 6090...");
});

run();