request = require("request");
var express = require('express');
var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

    console.log("Kickstarter Proxy started...");
    app.use(function (req, res, next) {
        request(req.url.substring(1)).pipe(res);
    });




var server = app.listen(4445, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});