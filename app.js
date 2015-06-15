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

	socket.on('move', function (data){

		console.log('MoveCommand');

		speed = 8;

		if (data.direction == 'right') {
			mybar.x = mybar.x + speed;
			//mybar.velocityX = 300;
		}
		else if (data.direction == 'left') {
			mybar.x = mybar.x - speed;
			//mybar.velocityX = -300;
		}
		else if (data.direction == 'up') {
			mybar.y = mybar.y - speed;
			//mybar.velocityY = -300;
		}
		else if (data.direction == 'down') {
			mybar.y = mybar.y + speed;
			//mybar.velocityY = 300;
		}

		io.sockets.emit('user move', mybar);

	});

});