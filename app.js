var app = require('express')();
var express = require('express');
//var http = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');


var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

app.use("/img", express.static(__dirname + '/img'));


app.get('/', function(req,res){

	res.sendFile(__dirname + '/index.html'); //Serve index.html
});





io.on('connection', function(socket){
	
	socket.on('chat message' , function(msg){
		
		console.log('message: ' + msg);


		io.emit('chat message', msg);
	});

	console.log('A New User Has Connected!');
	

	socket.on('disconnect',function(){	
	
		console.log('User Has Disconnected');
	
	});

	fs.readFile('Kappa.png', function(err,buf){

		socket.emit('image', {image:true, buffer: buf});
	

	});
});




server.listen(port, function() {

  console.log('Listening on ' + port);

});



//Development 
//http.listen(80,function(){

//	console.log('Listening on *:80');
//});
