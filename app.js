var express = require('express');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');


var port = process.env.PORT || 8001;


app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


server.listen(port, function(){
  console.log("Express server listening on port " + port);
});


var topbar = null, leftbar = null, rightbar = null, downbar = null;
var bars = [];
var ball = {};
var positions = ['right', 'left', 'up', 'down'];
var pos = null;

var start_ball = function() {

	ball_speed = 32;
	ball.x = 500;
	ball.y = 370;
	ball.collided = false;

	pos = positions[Math.floor((Math.random() * positions.length) + 0)];

};

var check_paddle_colision = function() {

	for (var x = 0; x < bars.length; x++) {
		if (ball.x == bars[x])
	}

};

var move_ball = function() {

	console.log('moving ball');

	if (!ball.collided) {
		if (pos == 'right') {

			if ((ball.x + ball_speed) <= (1024-16)) {
				ball.x = ball.x + ball_speed;
			}
			else {
				pos == 'left';
			}
		}
		else if (pos == 'left') {

			if ((ball.x - ball_speed) >= 0) {
				ball.x = ball.x - ball_speed;
			}
			else {
				pos == 'right';
			}
		}
		else if (pos == 'up') {

			if ((ball.y - ball_speed) >= 0) {
				ball.y = ball.y - ball_speed;
			}
			else {
				pos = 'down';
			}
		}
		else if (pos == 'down') {

			if ((ball.y + ball_speed) <= (768-16)) {
				ball.y = ball.y + ball_speed;
			}
			else {
				pos = 'up';
			}
		}

		io.sockets.emit('ball update', ball);

		setTimeout(function() {
	      move_ball();
	    }, 100);
	}
};


start_ball();
move_ball();



io.sockets.on('connection', function (socket){

	var pos = null;
	var mybar = null;


	if (topbar == null) {
		pos = 'topbar';
		bar = {x: 350, id: socket.id, y: 10, pos: pos, sprite: 'horizontal_bar'};
		topbar = bar;
		mybar = bar;
		console.log('Created Connection TopBar');
	}
	else if (downbar == null) {
		pos = 'downbar';
		bar = {x: 350, y: 700, id: socket.id, pos: pos, sprite: 'horizontal_bar'};
		downbar = bar;
		mybar = bar;
		console.log('Created Connection DownBar');
	}
	else if (leftbar == null) {
		pos = 'leftbar';
		bar = {x: 10, y: 350, id: socket.id, pos: pos, sprite: 'vertical_bar'};
		leftbar = bar;
		mybar = bar;
		console.log('Created Connection LeftBar');
	}
	else {
		pos = 'rightbar';
		bar = {x: 990, y: 350, id: socket.id, pos: pos, sprite: 'vertical_bar'};
		rightbar = bar;
		mybar = bar;
		console.log('Created Connection RightBar');
	}

	bars.push(bar);
	console.log('Bars list');
	console.log(bars);

	// console.log('I am the: '  + pos);
	// console.log(mybar);


	socket.emit('connected', {pos: pos, bars: bars});
	io.sockets.emit('user connected', {id: socket.id, pos: pos, bar: bar});
	socket.emit('ball position', {ball: ball})

	socket.on('move', function (data){

		console.log('MoveCommand');

		speed = 8;

		if (data.direction == 'right') {

			if ((mybar.x + speed) <= (1024-128)) {
				mybar.x = mybar.x + speed;
			}
			
		}
		else if (data.direction == 'left') {

			if ((mybar.x - speed) >= 0) {
				mybar.x = mybar.x - speed;
			}

		}
		else if (data.direction == 'up') {

			if ((mybar.y - speed) >= 0) {
				mybar.y = mybar.y - speed;
			}

		}
		else if (data.direction == 'down') {

			if ((mybar.y + speed) <= (768-128)) {
				mybar.y = mybar.y + speed;
			}
			
		}

		io.sockets.emit('user move', mybar);


	});

	// socket.on('getBallUpdate', function (data){
	// 	socket.emit('ball update', ball);
	// });

});