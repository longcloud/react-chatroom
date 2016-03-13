/**
 * Created by LongCloud on 2016/3/12.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send( '<h3>Hello World</h3>');
});

var names = ['小白','小黑','小二','小真','小无','小金','小木','小水','小火','小土'];
var connectedCount = 0;

io.on('connection', function(socket){
    console.log('a user connected');

    socket.emit('name', names[connectedCount%names.length] + parseInt(connectedCount/names.length));

    connectedCount++;
    socket.on('chatMessage', function(msg){
        //io.emit('chatMessage', msg);  //send the msg to everybody
        socket.broadcast.emit('chatMessage',msg);
        console.log('message: ' + msg);
    });
        socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});