//@ts-nocheck
const express = require('express');
const corsAnywhere = require('cors-anywhere');
const axios = require('axios')

const app = express();

// Configure o CORS Anywhere com as opções desejadas
const corsOptions = {
  originWhitelist: [], // Deixe vazio para permitir qualquer origem
  requireHeaders: ['origin', 'access-control-request-method', 'x-requested-with', 'access-control-request-headers', 'access-control-allow-origin'],  // Deixe vazio para permitir solicitações sem cabeçalhos
};

const corsProxy = corsAnywhere.createServer(corsOptions);

app.use('/proxy/:url', (req, res, next) => {
  req.url = req.url.replace('/proxy/', '/'); // Strip "/proxy" from the front of the URL.
  corsProxy.emit('request', req, res);
});

app.use('/', (req, res, next) => {
  axios.get("https://www.jusbrasil.com.br/advogados/direito-do-trabalho-ac/")
  .then(function (response) {
      res.header("Access-Control-Allow-Origin", "https://cors.bohr.io/");
      res.send(response.data);
  })
  .catch(function (error) {
      console.log(error);
  });
})

if (!module.parent) {
  app.listen(3001);
  console.log("Express started on port 3001");
}

export default app;
