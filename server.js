const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 8080;
const host = '0.0.0.0';


const taskType = "task";

const taskPageFilePath = "./task.html";

const task1FilePath = "./"+taskType+"/solutions/example.js";
const tests1FilePath = "./"+taskType+"/tests/example-tests.js";


// maps file extention to MIME types
// full list can be found here: https://www.freeformatter.com/mime-types-list.html
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'application/x-font-ttf',
};


http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);

  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  let pathname = path.join(__dirname, sanitizePath);

  

    if ((req.url === "/example" || req.url === "/example_tests") && req.method === "GET") {


    let taskFilePath = "";
    let testsFilePath = "";
    if (req.url === "/example"){
      taskFilePath = task1FilePath;
    }
    else if (req.url === "/example_tests"){
      taskFilePath = task1FilePath;
      testsFilePath = tests1FilePath;
    }



    fs.readFile(taskPageFilePath, "utf8", (err, htmlContent) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error loading task page");
            return;
        }
        fs.readFile(taskFilePath, "utf8", (err, studentCode) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error loading task file");
                return;
            }
            if(testsFilePath!=""){
              fs.readFile(testsFilePath, "utf8", (err, tests) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error loading tests");
                    return;
                }
                const modifiedHtml = htmlContent.replace(
                    '// --- STUDENT CODE WILL BE INSERTED HERE ---',
                    studentCode
                );


                const finalHtml = modifiedHtml.replace(
                  '// --- TESTS WILL BE INSERTED HERE ---',
                  tests
                );
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(finalHtml);
            });
          }
          else{
            const modifiedHtml = htmlContent.replace(
              '// --- STUDENT CODE WILL BE INSERTED HERE ---',
              studentCode
            );

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(modifiedHtml);
          }

        });
    });
  } 
  
  else {

    fs.exists(pathname, function (exist) {
      if(!exist) {
        // if the file is not found, return 404
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }

      // if is a directory, then look for index.html
      if (fs.statSync(pathname).isDirectory()) {
        pathname += '/index.html';
      }

      // read file from file system
      fs.readFile(pathname, function(err, data){
        if(err){
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          // based on the URL path, extract the file extention. e.g. .js, .doc, ...
          const ext = path.parse(pathname).ext;
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.end(data);
        }
      });
    });
  }

}).listen(parseInt(port, host));

console.log(`Server listening on port ${port}`);