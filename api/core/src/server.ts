//@ts-nocheck
const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();

// Configure o CORS Anywhere com as opções desejadas
const corsOptions = {
  originWhitelist: [], // Deixe vazio para permitir qualquer origem
  requireHeaders: [],  // Deixe vazio para permitir solicitações sem cabeçalhos
};

const corsProxy = corsAnywhere.createServer(corsOptions);

app.use('/proxy/:url', (req, res, next) => {
  req.url = req.url.replace('/proxy/', '/'); // Strip "/proxy" from the front of the URL.
  corsProxy.emit('request', req, res);
});

if (!module.parent) {
  app.listen(3000);
  console.log("Express started on port 3000");
}

export default app;