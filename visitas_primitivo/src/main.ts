import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as querystring from "querystring";

function indexRoute(_req: http.IncomingMessage, res: http.ServerResponse) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Libro de visitas</title>
  </head>
  <body>
    <h1>Libro de Visitas</h1>
    <a href="">Ver los comentarios de los visitantes</a>
    <h2>Este formulario le permite enviar comentarios sobre este sitio.</h2>
    <form action="submitPost" method="POST">
      <p>Nombre: <input type="text" name="nombre" size="30" /></p>
      <p>Correo electrónico: <input type="text" name="email" size="30" /></p>
      <p>Comentario:</p>
      <textarea name="comentario" rows="5" cols="30"></textarea>
      <p><input type="submit" name="submit" value="submit" /></p>
    </form>
    <a href="">Ver los comentarios de los visitantes</a>
  </body>
</html>
`);
}

function submitPost(req: http.IncomingMessage, res: http.ServerResponse) {
  if (
    req.method === "POST" &&
    req.headers["content-type"] === "application/x-www-form-urlencoded"
  ) {
    let body = "";
    req.on("data", (chunk) => {
      console.log(chunk.toString());
      body += chunk.toString();
    });
    console.log("Termina")

    req.on("end", () => {
      const parsedData = querystring.parse(body);

      console.log(parsedData);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(parsedData));
    });
  } else {
    res.statusCode = 400;
    res.end("Bad Request");
  }
}

let getRoutes = new Map<string, Function>([
  ["/", indexRoute],
]);

let postRoutes = new Map<string, Function>([
  ["/submitPost", submitPost],
]);

let putRoutes = new Map<string, Function>([]);
let deleteRoutes = new Map<string, Function>([
  // ["/submitPost", submitPost],
]);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    let methodRouter: Map<string, Function> | null = null;

    if (req.method === "GET") {
      methodRouter = getRoutes;
    } else if (req.method === "POST") {
      methodRouter = postRoutes;
    } else if (req.method === "PUT") {
      methodRouter = putRoutes;
    } else if (req.method === "DELETE") {
      methodRouter = deleteRoutes;
    } else {
      methodRouter = null;
    }

    if (methodRouter !== null) {
      if (methodRouter.has(req.url!)) {
        methodRouter.get(req.url!)!(req, res);
        return;
      } else {
        res.writeHead(404);
        res.end("404 Not Found");
      }
    } else {
      res.writeHead(404);
      res.end("404 Not Found");
    }

    //   let filePath = "." + req.url!;
    //
    //   if (filePath === "./") {
    //     filePath = "./index.html"; // Archivo predeterminado para la ruta raíz
    //   }
    //
    //   const extname = path.extname(filePath);
    //   let contentType = "text/html";
    //
    //   switch (extname) {
    //     case ".js":
    //       contentType = "text/javascript";
    //       break;
    //     case ".css":
    //       contentType = "text/css";
    //       break;
    //     case ".json":
    //       contentType = "application/json";
    //       break;
    //     case ".png":
    //       contentType = "image/png";
    //       break;
    //     case ".jpg":
    //       contentType = "image/jpg";
    //       break;
    //   }
    //
    //   fs.readFile(filePath, (error, content) => {
    //     if (error) {
    //       if (error.code === "ENOENT") {
    //         res.writeHead(404);
    //         res.end("404 Not Found");
    //       } else {
    //         res.writeHead(500);
    //         res.end("Internal Server Error");
    //       }
    //     } else {
    //       res.writeHead(200, { "Content-Type": contentType });
    //       res.end(content, "utf-8");
    //     }
    //   });
  },
);

const port = 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
