import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  let filePath = '.' + req.url!;
  if (filePath === './') {
    filePath = './index.html'; // Archivo predeterminado para la ruta raíz
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
