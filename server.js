const jsonServer = require("json-server");
const {isAuthorized, getToken} = require("./utils");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);


// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
    if (req.body.email) {
        res.send({
            token: getToken(36)
        })
    } else {
        res.sendStatus(401);
    }
});

server.use((req, res, next) => {
    if (isAuthorized(req)) {
        // add your authorization logic here
        next(); // continue to JSON Server router
    } else {
        res.sendStatus(401);
    }
});

server.use((req, res, next) => {
    // Example for extending post data
    if (req.method === "POST") {
        req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

server.use(
    jsonServer.rewriter({}));

// Use default router
server.use(router);
server.listen(3001, () => {
    console.log("JSON Server is running");
});
