"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var fs = __importStar(require("fs"));
var querystring = __importStar(require("querystring"));
var url = __importStar(require("url"));
var node_os_1 = require("node:os");
function indexRoute(_req, res) {
    var htmlIndex = "\n\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Libro de visitas</title>\n    <style>\n      body {\n        font-family: Arial, Helvetica, sans-serif;\n      }\n\n      .modal {\n        display: none;\n        position: fixed;\n        z-index: 1;\n        padding-top: 100px;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        overflow: auto;\n        background-color: rgb(0, 0, 0);\n        background-color: rgba(0, 0, 0, 0.4);\n      }\n\n      .modal-content {\n        background-color: #fefefe;\n        margin: auto;\n        padding: 20px;\n        border: 1px solid #888;\n        width: 80%;\n      }\n\n      .close {\n        color: #aaaaaa;\n        float: right;\n        font-size: 28px;\n        font-weight: bold;\n      }\n\n      .close:hover,\n      .close:focus {\n        color: #000;\n        text-decoration: none;\n        cursor: pointer;\n      }\n    </style>\n  </head>\n\n  <body>\n    <h1>Libro de Visitas</h1>\n    <a href=\"./comments\">Ver los comentarios de los visitantes</a>\n    <h2>Este formulario le permite enviar comentarios sobre este sitio.</h2>\n    <form action=\"submitPost\" method=\"POST\">\n      <p>Nombre: <input type=\"text\" name=\"nombre\" size=\"30\" /></p>\n      <p>Correo electr\u00F3nico: <input type=\"text\" name=\"email\" size=\"30\" /></p>\n      <p>Comentario:</p>\n      <textarea name=\"comentario\" rows=\"5\" cols=\"30\"></textarea>\n      <p><input type=\"submit\" name=\"submit\" value=\"submit\" /></p>\n    </form>\n    <!-- <a href=\"\">Ver los comentarios de los visitantes</a> -->\n\n    <!-- The Modal -->\n    <div id=\"myModal\" class=\"modal\">\n      <!-- Modal content -->\n      <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <p id=\"message\"></p>\n      </div>\n    </div>\n\n    <script>\n      const params = new URLSearchParams(window.location.search);\n      const successMessage = params.get(\"success\");\n      const errorMessage = params.get(\"error\");\n      // Get the modal\n      var modal = document.getElementById(\"myModal\");\n      var btn = document.getElementById(\"myBtn\");\n      var span = document.getElementsByClassName(\"close\")[0];\n      var message = document.getElementById(\"message\");\n\n      span.onclick = function () {\n        modal.style.display = \"none\";\n        window.location.href = \"./\";\n      };\n\n      window.onclick = function (event) {\n        if (event.target == modal) {\n          modal.style.display = \"none\";\n          window.location.href = \"./\";\n        }\n      };\n\n      if (successMessage || errorMessage) {\n        if (successMessage) {\n          message.innerHTML = successMessage;\n        } else {\n          message.innerHTML = errorMessage;\n        }\n        modal.style.display = \"block\";\n      }\n    </script>\n  </body>\n</html>\n";
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlIndex);
}
function showComments(_req, res) {
    var htmlData = "\n\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Document</title>\n</head>\n<body>\n<h1>Libro de Visitas</h1>\n\n    <h2>Comentarios</h2>\n  ";
    fs.readFile("./visitas.txt", function (_err, data) {
        var lines = data.toString().split("\n");
        var commentsNotParsed = lines
            .map(function (line) { return line.trim(); }) // Trim leading/trailing whitespace
            .filter(function (line) { return line !== ""; }); // Filter out empty lines
        var commentsParsed = [];
        commentsNotParsed.forEach(function (comment) {
            var commentParsed = JSON.parse(comment);
            commentParsed.fecha = new Date(commentParsed.fecha);
            commentsParsed.push(commentParsed);
        });
        for (var _i = 0, commentsParsed_1 = commentsParsed; _i < commentsParsed_1.length; _i++) {
            var comment = commentsParsed_1[_i];
            var formattedDate = comment.fecha.getDay() + "/" +
                comment.fecha.getMonth() + "/" + comment.fecha.getFullYear() + " " +
                comment.fecha.getHours() + ":" + comment.fecha.getMinutes() + ":" +
                comment.fecha.getSeconds();
            htmlData += "\n    <div class=\"commentBox\">\n      <p class=\"commentName\">Nombre: ".concat(comment.name, "</p>\n      <p class=\"commentEmail\">Email: ").concat(comment.email, "</p>\n      <p class=\"commentText\">Comentarios: ").concat(comment.content, "</p>\n      <p class=\"commentDate\">Fecha: ").concat(formattedDate, "</p>\n    </div>\n<br>\n    ");
        }
        htmlData += "\n</body>\n</html>\n\n";
        res.setHeader("Content-Type", "text/html");
        res.end(htmlData);
    });
}
function submitPost(req, res) {
    if (req.method === "POST" &&
        req.headers["content-type"] === "application/x-www-form-urlencoded") {
        var body_1 = "";
        req.on("data", function (chunk) {
            body_1 += chunk.toString();
        });
        req.on("end", function () {
            var parsedData = querystring.parse(body_1);
            if (!parsedData.nombre || !parsedData.email || !parsedData.comentario) {
                res.statusCode = 302; // Redirect status code
                res.setHeader("Location", "/?error=" + encodeURIComponent("Pls fill all the fields"));
                res.end();
                return;
            }
            var comment = {
                name: parsedData.nombre.toString(),
                email: parsedData.email.toString(),
                content: parsedData.comentario.toString(),
                fecha: new Date(),
            };
            // @ts-ignore
            comment.fecha = comment.fecha.toISOString();
            fs.appendFile("./visitas.txt", JSON.stringify(comment) + "\n", function (err) {
                if (err)
                    throw err;
                console.log("The file has been saved!");
            });
            var successMessage = "Form submitted successfully";
            res.statusCode = 302; // Redirect status code
            res.setHeader("Location", "/?success=" + encodeURIComponent(successMessage));
            res.end();
        });
    }
    else {
        res.statusCode = 400;
        res.end("Bad Request");
    }
}
var getRoutes = new Map([
    ["/", indexRoute],
    ["/comments", showComments],
]);
var postRoutes = new Map([
    ["/submitPost", submitPost],
]);
var putRoutes = new Map([]);
var deleteRoutes = new Map([]);
var server = http.createServer(function (req, res) {
    var methodRouter = null;
    var urlObject = url.parse(req.url, true);
    var pathName = urlObject.pathname;
    if (req.method === "GET") {
        methodRouter = getRoutes;
    }
    else if (req.method === "POST") {
        methodRouter = postRoutes;
    }
    else if (req.method === "PUT") {
        methodRouter = putRoutes;
    }
    else if (req.method === "DELETE") {
        methodRouter = deleteRoutes;
    }
    else {
        methodRouter = null;
    }
    if (methodRouter !== null) {
        if (methodRouter.has(pathName)) {
            methodRouter.get(pathName)(req, res);
            return;
        }
        else {
            res.writeHead(404);
            res.end("404 Not Found");
        }
    }
    else {
        res.writeHead(404);
        res.end("404 Not Found");
    }
});
// const port = 3000;
// @ts-ignore
server.listen(function () {
    // @ts-ignore
    console.log("Server running at http://".concat(node_os_1.hostname, ":").concat(server.address().port, "/"));
});
