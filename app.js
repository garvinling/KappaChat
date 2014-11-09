var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};
var fs = require('fs');
//var server = require('http').createServer(app);
var users = [];
var user_string = "";
var port = process.env.PORT || 3000;

	app.use("/img", express.static(__dirname + '/img'));


	app.get('/', function(req,res){

		res.sendFile(__dirname + '/index.html'); //Serve index.html
	});


io.on('connection', function(socket){


	socket.on("join",function(name){

		if(users.indexOf(name) == -1)
		{
			people[socket.id] = name;
			users[socket.id] = name;
			console.log(people[socket.id] + " has joined the chat.");
			user_string = "";
			io.emit('addUser',people);
		}
	});
	
	socket.on('chat message' , function(msg){
		
		console.log('message: ' + msg);
		io.emit('chat message', people[socket.id], msg);

	});


	socket.on('disconnect',function(){	
		
		console.log('User Has Disconnected.');
		printUsers();

		delete people[socket.id];
		delete users[socket.id];

		if(people[socket.id] != "undefined")
		{
			//io.emit("update",people[socket.id] + " has left the chat.");
		}
	
	});
	
	fs.readFile('Kappa.png', function(err,buf){

		socket.emit('image', {image:true, buffer: buf});
	
	});


});


function printUsers()
{

	for(var index in people)
	{

		user_string = user_string + "<li>" + people[index] + "</li>";
	
	}
	
	io.emit('addUser',user_string);
}

http.listen(port, function() {

   console.log('Listening on ' + port);

 });


function log(str){

	console.log(str);

}
// // Development 
// http.listen(3000,function(){

// 	console.log('Listening on *:80');
// });
