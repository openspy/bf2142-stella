const express = require('express')
const app = express()
const url = require('url');
const ErrorResponse = require('./API/ErrorResponse');
const ErrorRespondeInstance = new ErrorResponse;

global.API_KEY = process.env.API_KEY;
global.API_ENDPOINT = process.env.API_ENDPOINT;
global.PARTNERCODE = 20;
global.PROFILE_NAMESPACEID = 2;
global.ACCOUNT_NAMESPACEID = 1;
global.OPENSPY_GAMEID = 1324;

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

var ResponseWriter = new (require('./API/ResponseWriter'))();
var Auth = new (require('./API/Auth'))();
var APIRequestHandler = require('./API/requests');

app.all("*", function(req, res, next) {
    req.queryParams = url.parse(req.originalUrl, true).query;
	next();
})
app.get('/', function(req, res, next) {
    res.end();
});

function errorHandler (err, req, res, next) {
    if (err.statusCode === undefined) {
        err = ErrorRespondeInstance.SystemError(err);
    }
	ResponseWriter.sendError(res, err);
}

app.use(ResponseWriter.registerMiddleware.bind(ResponseWriter));
app.use(Auth.registerMiddleware.bind(Auth));

APIRequestHandler(app);


app.use(function(req, res, next) {
    next(ErrorRespondeInstance.NotFoundError());
});

app.use(errorHandler);
  

app.listen(process.env.PORT || 3000, () => console.log('Server running on port: ', process.env.PORT || 3000))
