/**
 * @license
 * Everything in this repo is MIT License unless otherwise specified.
 *
 * Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen  Sawchuk, Google, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser') // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var argv = require('optimist').argv;

// configuration =================
mongoose.connect('mongodb://' + argv.be_ip + ':80/my_database');
app.use('/js', express.static(__dirname + '/js'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Message = mongoose.model('Message', {
  sender: String,
  recipient: String,
  time: String,
  body: String
});

// routes ======================================================================

// api ---------------------------------------------------------------------

//Get Messages
app.get('/api/messages', function (req, res) {
  var me = "S_K";
  Message
    .where('recipient').in(['all', me])
    .exec(
      function(err, messages){
        if (err) {
          res.send(err);
        }
        res.json(messages);
      }
    );
});

//Create Message
app.post('/api/messages', function (req, res) {
  var now = Date.now();
  Todo.create({
    sender: 'S_K',
    recipient: 'all',
    time: now,
    body: 'lolwut'
  }, function (err, todo) {
    if (err) {
      res.send(err);
    }
    res.json(todo);
  });
});

//Don't need any puts or deletes for chat.

// application -------------------------------------------------------------
app.get('/', function (req, res) {
  res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
// listen (start app with node server.js) ======================================
app.listen(8080, argv.fe_ip);
console.log("App listening on port 8080");
