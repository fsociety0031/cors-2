//@ts-nocheck
const express = require('express');
const corsAnywhere = require('cors-anywhere');
const puppeteer = require('puppeteer');

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

app.use('/proxy_v2/', async (req, res, next) => {
  try {
    // Inicialize o Puppeteer
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    // URL da página que você deseja acessar
    const url = 'https://birmanya.jusbrasil.com.br/';

    // Navegue até a página
    await page.goto(url);

    // Capture uma captura de tela da página
    const data = await page.evaluate(() => document.querySelector('*').outerHTML)

    // Feche o navegador Puppeteer
    await browser.close();

    // Envie a captura de tela como resposta
    res.send(data);
  } catch (error) {
    console.error('Erro ao acessar a página:', error);
    res.status(500).send('Erro ao acessar a página');
  }
});

if (!module.parent) {
  app.listen(80);
  console.log("Express started on port 80");
}

export default app;
