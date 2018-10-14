var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PORT = process.env.PORT || 3000;
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./data.db');
var _ = require('lodash');

// db.serialize(function() {
//   db.run("CREATE TABLE log (at DATETIME, status BOOLEAN)");
// });

// HEADER : Content-Type : 'application/json'
app.use(bodyParser());

app.get('/time', function(req, res){
  res.send(''+new Date().getTime())
})

var io = require('socket.io')();
io.on('connection', function(client){});
io.listen(PORT+1);

// MAC, T, 304234234, F

app.use('/', express.static('ui/dist'));

app.post('/equipment/status', function(req, res){
  // 상태 변경 로그 받음
  console.log('상태 변경 로그', req.body);
  var body = req.body;
  // {
  //   timestamp: --
  //   index: --
  //   value: 전류값
  //   onoff:  0, 1,
  //   mac: 'DD:@@'
  // }
  db.run(`INSERT INTO log(at, status) VALUES(?, ?)`, [body.timestamp, !!body.onoff], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    // console.log(`A row has been inserted with rowid ${this.lastID}`);
    io.emit('changed', {at: body.timestamp, status: body.onoff}); // emit an event to all connected sockets
    res.send('o');
  });    
  // if(req.body.trust){
  //   //만약 내가 가지고 있는것과 같으면,
  //   res.send('o');
  // }else{
  //   //만약, 내가 가지고 있는것과 다르면
  //   res.send("r, 201154238");
  // }
})

// MAC
// T, 203289382
// F, 203203
app.post('/equipment/logs', function(req, res){
  console.log('기존 로그들', req.body);
  res.send('');
})

app.listen(PORT, function(){
  console.log('Server Started At http://localhost:' + PORT);
})

