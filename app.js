var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};
var fs = require('fs');
//var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

	app.use("/img", express.static(__dirname + '/img'));


	app.get('/', function(req,res){

		res.sendFile(__dirname + '/index.html'); //Serve index.html
	});


io.on('connection', function(socket){


	socket.on("join",function(name){

		people[socket.id] = name;
		console.log(people[socket.id] + " has joined the chat.");
		io.emit("update", people[socket.id] + " has joined the chat."); //Broadcast join message across all sockets. 

	});
	
	socket.on('chat message' , function(msg){
		
		console.log('message: ' + msg);
		io.emit('chat message', people[socket.id], msg);
			
	});

	socket.on('disconnect',function(){	
		
		console.log('User Has Disconnected: ');
		io.emit("update",people[socket.id] + " has left the chat.");
	
	});
	
	fs.readFile('Kappa.png', function(err,buf){

		socket.emit('image', {image:true, buffer: buf});
	
	});


});




http.listen(port, function() {

   console.log('Listening on ' + port);

 });



// // Development 
// http.listen(3000,function(){

// 	console.log('Listening on *:80');
// });
