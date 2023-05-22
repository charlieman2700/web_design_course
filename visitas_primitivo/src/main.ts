import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as querystring from "querystring";
import * as url from "url";

function indexRoute(_req: http.IncomingMessage, res: http.ServerResponse) {
  const filePath = path.join(__dirname, "index.html");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
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
        console.log("Pls fill all the fields");
        res.setHeader(
          "Location",
          "/?error=" + encodeURIComponent("Pls fill all the fields"),
        );
        res.end();
        return;
      }

      fs.appendFile(
        "./visitas.txt",
        JSON.stringify(parsedData) + "\n",
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

function getComments(req: http.IncomingMessage, res: http.ServerResponse) {
  if (req.method === "GET") {
    fs.readFile("./visitas.txt", (_err, data) => {
      const lines = data.toString().split("\n");
      const comments = lines
        .map((line) => line.trim()) // Trim leading/trailing whitespace
        .filter((line) => line !== ""); // Filter out empty lines

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(comments));
    });
  } else {
    res.statusCode = 400;
    res.end("Bad Request");
  }
}

let getRoutes = new Map<string, Function>([
  ["/", indexRoute],
  ["/comments", getComments],
]);

let postRoutes = new Map<string, Function>([
  ["/submitPost", submitPost],
]);

let putRoutes = new Map<string, Function>([]);
let deleteRoutes = new Map<string, Function>([
]);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    let methodRouter: Map<string, Function> | null = null;

    const urlObject = url.parse(req.url!, true);
    const pathName = urlObject.pathname;
    console.log(pathName);

    console.log(req.method + " " + req.url);

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

const port = 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
