	Bar = function (game, unique_id, x, y, sprite, enemy) {

	    Phaser.Sprite.call(this, game, x, y, sprite);

	    this.unique_id = unique_id;
	    this.enemy = enemy;
		//this.x = x;
		//this.y = y;

	    game.add.existing(this);
	    game.physics.enable([this,ball], Phaser.Physics.ARCADE);
	    this.body.immovable = true;

	};

	Bar.prototype = Object.create(Phaser.Sprite.prototype);
	Bar.prototype.constructor = Bar;

	Bar.prototype.update = function() {		
		game.physics.arcade.collide(this, ball);
	}


	Ball = function(game, unique_id, x, y, sprite) {
		Phaser.Sprite.call(this, game, x, y, sprite);

		this.unique_id = unique_id;
		game.add.existing(this);
		game.physics.arcade.enable(this);
		this.body.velocity.setTo(400, 400);
		this.body.collideWorldBounds = true;
		this.body.bounce.setTo(1, 1);
	}

	Ball.prototype = Object.create(Phaser.Sprite.prototype);
	Ball.prototype.constructor = Ball;


	Ball.prototype.update = function() {

	} 

	var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', {preload: preload, create: create, update: update, render: render });

	var leftbar = null;
	var topbar = null;
	var downbar = null;
	var rightbar = null;
	var socket = io;
	var cursors;

	var bars = Array();

	var mybar = null;
	var mypos = null;

	function preload() {
		game.stage.disableVisibilityChange = true;
		game.time.advancedTiming = true;

		game.load.image('vertical_bar', 'vertical_bar.png');
		game.load.image('horizontal_bar', 'horizontal_bar.png');
		game.load.image('ball', 'ball.png');

		socket = socket.connect();

		socket.on('connected', function (data) {

			console.log('data on connected');
			console.log(data);
			mypos = data.pos;

			for (var x = 0; x < data.bars.length; x++) {
				if (data.bars[x].pos != mypos) {
					bars[data.bars[x].pos] = new Bar(game, data.bars[x].id, data.bars[x].x, data.bars[x].y, data.bars[x].sprite, true);
				}
			}

		});


		socket.on('user connected', function(data) {

			console.log(data);

			if (data.pos == mypos) {
				console.log('adicionou uma barra propria');
				bars[data.pos] = new Bar(game, data.id, data.bar.x, data.bar.y, data.bar.sprite, false);
			}
			else {
				console.log('adicionou uma barra enemy');
				bars[data.pos] = new Bar(game, data.id, data.bar.x, data.bar.y, data.bar.sprite, true);
			}
		});


		socket.on('user move', function(data){
			bars[data.pos].x = data.x;
			bars[data.pos].y = data.y;

			console.log(data);
		});
	
	}

	function create() {
		//game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.physics.p2.defaultRestitution = 0.8;
		cursors = game.input.keyboard.createCursorKeys();
		ball = new Ball(game, 'aaa', 500, 370, 'ball');

		// if (localStorage.getItem("nickname") == '' || localStorage.getItem("nickname") == null) {
		// 	var nick = prompt('Enter your nickname');
		// 	localStorage.setItem("nickname", nick);
		// }

		// var nickname = localStorage.getItem("nickname");
		// socket.emit('new-player', {'nickname': nickname});
	}

	function update () {

		if (bars[mypos] != null) {

			if (bars[mypos].key == 'horizontal_bar') {
				if (cursors.left.isDown)
			    {
			    	socket.emit('move', {direction: 'left'});
			    }
			    else if (cursors.right.isDown)
			    {
			    	socket.emit('move', {direction: 'right'});
			    }
			}
			else if (bars[mypos].key == 'vertical_bar') {

			    if (cursors.up.isDown)
			    {
			    	socket.emit('move', {direction: 'up'});
			    }
			    else if (cursors.down.isDown)
			    {
			    	socket.emit('move', {direction: 'down'});
			    }
			}

		}
		

	}

	function render () {
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
	}



