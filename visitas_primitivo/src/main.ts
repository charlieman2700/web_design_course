import * as http from "http";
import * as fs from "fs";
import * as querystring from "querystring";
import * as url from "url";
import { hostname } from "node:os";

function indexRoute(_req: http.IncomingMessage, res: http.ServerResponse) {
  const htmlIndex = `

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Libro de visitas</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }

      .modal {
        display: none;
        position: fixed;
        z-index: 1;
        padding-top: 100px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
      }

      .modal-content {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
      }

      .close {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }

      .close:hover,
      .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <h1>Libro de Visitas</h1>
    <a href="./comments">Ver los comentarios de los visitantes</a>
    <h2>Este formulario le permite enviar comentarios sobre este sitio.</h2>
    <form action="submitPost" method="POST">
      <p>Nombre: <input type="text" name="nombre" size="30" /></p>
      <p>Correo electrónico: <input type="text" name="email" size="30" /></p>
      <p>Comentario:</p>
      <textarea name="comentario" rows="5" cols="30"></textarea>
      <p><input type="submit" name="submit" value="submit" /></p>
    </form>
    <!-- <a href="">Ver los comentarios de los visitantes</a> -->

    <!-- The Modal -->
    <div id="myModal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close">&times;</span>
        <p id="message"></p>
      </div>
    </div>

    <script>
      const params = new URLSearchParams(window.location.search);
      const successMessage = params.get("success");
      const errorMessage = params.get("error");
      // Get the modal
      var modal = document.getElementById("myModal");
      var btn = document.getElementById("myBtn");
      var span = document.getElementsByClassName("close")[0];
      var message = document.getElementById("message");

      span.onclick = function () {
        modal.style.display = "none";
        window.location.href = "./";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
          window.location.href = "./";
        }
      };

      if (successMessage || errorMessage) {
        if (successMessage) {
          message.innerHTML = successMessage;
        } else {
          message.innerHTML = errorMessage;
        }
        modal.style.display = "block";
      }
    </script>
  </body>
</html>
`;

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(htmlIndex);
}

type Comment = {
  name: string;
  email: string;
  content: string;
  fecha: Date;
};

function showComments(_req: http.IncomingMessage, res: http.ServerResponse) {
  let htmlData: string = `

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
<h1>Libro de Visitas</h1>

    <h2>Comentarios</h2>
  `;
  fs.readFile("./visitas.txt", (_err, data) => {

    const lines = data.toString().split("\n");
    const commentsNotParsed = lines
      .map((line) => line.trim()) // Trim leading/trailing whitespace
      .filter((line) => line !== ""); // Filter out empty lines
    const commentsParsed: Comment[] = [];

    commentsNotParsed.forEach((comment) => {
      let commentParsed = JSON.parse(comment);
      commentParsed.fecha = new Date(commentParsed.fecha);
      commentsParsed.push(commentParsed);
    });

    for (const comment of commentsParsed) {
      const formattedDate = comment.fecha.getDay() + "/" +
        comment.fecha.getMonth() + "/" + comment.fecha.getFullYear() + " " +
        comment.fecha.getHours() + ":" + comment.fecha.getMinutes() + ":" +
        comment.fecha.getSeconds();
      htmlData += `
    <div class="commentBox">
      <p class="commentName">Nombre: ${comment.name}</p>
      <p class="commentEmail">Email: ${comment.email}</p>
      <p class="commentText">Comentarios: ${comment.content}</p>
      <p class="commentDate">Fecha: ${formattedDate}</p>
    </div>
<br>
    `;
    }

    htmlData += `
</body>
</html>

`;

    res.setHeader("Content-Type", "text/html");
    res.end(htmlData);
  });
}

function submitPost(req: http.IncomingMessage, res: http.ServerResponse) {
  if (
    req.method === "POST" &&
    req.headers["content-type"] === "application/x-www-form-urlencoded"
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = querystring.parse(body);

      if (!parsedData.nombre || !parsedData.email || !parsedData.comentario) {
        res.statusCode = 302; // Redirect status code
        res.setHeader(
          "Location",
          "/?error=" + encodeURIComponent("Pls fill all the fields"),
        );
        res.end();
        return;
      }

      const comment: Comment = {
        name: parsedData.nombre.toString(),
        email: parsedData.email.toString(),
        content: parsedData.comentario.toString(),
        fecha: new Date(),
      };

      // @ts-ignore
      comment.fecha = comment.fecha.toISOString();

      fs.appendFile(
        "./visitas.txt",
        JSON.stringify(comment) + "\n",
        (err) => {
          if (err) throw err;
          console.log("The file has been saved!");
        },
      );

      const successMessage = "Form submitted successfully";

      res.statusCode = 302; // Redirect status code
      res.setHeader(
        "Location",
        "/?success=" + encodeURIComponent(successMessage),
      );

      res.end();
    });
  } else {
    res.statusCode = 400;
    res.end("Bad Request");
  }
}

let getRoutes = new Map<string, Function>([
  ["/", indexRoute],
  ["/comments", showComments],
]);

let postRoutes = new Map<string, Function>([
  ["/submitPost", submitPost],
]);

let putRoutes = new Map<string, Function>([]);
let deleteRoutes = new Map<string, Function>([]);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    let methodRouter: Map<string, Function> | null = null;

    const urlObject = url.parse(req.url!, true);
    const pathName = urlObject.pathname;

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
      if (methodRouter.has(pathName!)) {
        methodRouter.get(pathName!)!(req, res);
        return;
      } else {
        res.writeHead(404);
        res.end("404 Not Found");
      }
    } else {
      res.writeHead(404);
      res.end("404 Not Found");
    }
  },
);

// const port = 3000;

// @ts-ignore
server.listen(() => {
  // @ts-ignore
  console.log(`Server running at http://${hostname}:${server.address().port}/`);
});
