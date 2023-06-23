const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/search' && req.method === 'POST') {
    let requestBody = '';
    req.on('data', chunk => {
      requestBody += chunk.toString();
    });
    req.on('end', () => {
      const keyword = JSON.parse(requestBody).keyword;
      const dictionary = {
        'videohosting': ['https://www.youtube.com/', 'https://hd.kinopoisk.ru'],
        'dogs': ['https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg', 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_16x9.jpg?w=1200']
      };
      const urls = dictionary[keyword] || [];

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(urls));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});