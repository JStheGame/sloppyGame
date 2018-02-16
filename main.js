function * colourGenerator() {
	function randByte() {
		return Math.floor(100 * Math.random()) + 120;
	}

	let [r, g, b] = [randByte(), randByte(), randByte()];
	yield `rgb(${r}, ${g}, ${b})`;

	while(true) {
		const newB = Math.floor((r - 100 + 60 * Math.random()) % 100 + 120);
		r = g;
		g = b;
		b = newB;

		yield `rgb(${r}, ${g}, ${b})`;
	}	
}

const colours = colourGenerator();

$(document).ready(function() {
	
	/*
	const dots = new Set();

	function Dot(size, x, y, colour, id) {
		this.size = size;
		this.x = x;
		this.y = y;
		this.colour = colour;
		this.id = id;
	}

	//generate a field of dots
	for(let i = 0; i < 50; i++) {
		const size = Math.floor(40 * Math.random()) + 10;
		const [x, y] = [width, height].map(
			limit => Math.floor((limit - size) * Math.random())
		);
		const colour = colours.next().value;
		const id = "dot" + (new Date().getTime()).toString() 
				   + (Math.floor(Math.random() * 1e9)).toString();

		const dot = new Dot(size, x, y, colour, id);
		dots.add(dot);
		const $square = $("<div>", {class: "dot", id: id});

		$square.css({
			backgroundColor: colour, 
			left: x, 
			top: y,
			width: size,
			height: size
		});
		$square.appendTo($rectangle);
	}

	//flash the dots every half second
	const flashDots = flasher();
	//const flashInterval = setInterval(() => flashDots.next(), 500)

	function * flasher() {
		while(true) {
			for(const dot of dots) {
				const $dot = $(`#${dot.id}`);
				$dot.css({backgroundColor: "#fff"});
				yield;
				$dot.css({backgroundColor: dot.colour});
			}
		}
	}

	*/


	//playfield dimensions
	const $rectangle = $("#rectangle");
	const [width, height] = ["width", "height"].map(
		prop => parseInt($rectangle.css(prop))
	);	


	/* PLAYER SCRIPTS */
	const directions = {
		37: {x: -1, y: 0},
		38: {x: 0, y: -1},
		39: {x: 1, y: 0},
		40: {x: 0, y: 1}
	}

	const player = {
		x: 100,
		y: 100,
		width: 10,
		height: 10,
		speed: 2,
		score: 0,
		powerUp: function(type) {
			if(type === "speed") {
				this.speed += 0.25;
				this.score += 250;
			}

			if(type === "size") {
				this.width += 4;
				this.height += 4;
				this.x -= 2;
				this.y -= 2;
				this.score += 1000;
			}

			scoreUpdate();
		},
		move: function(x, y) {
			const newX = this.x + x * this.speed;
			const newY = this.y + y * this.speed;

			this.x = Math.min(Math.max(0, newX), width - this.width);
			this.y = Math.min(Math.max(0, newY), height - this.height);

			$player.css({
				left: this.x,
				top: this.y,
				width: this.width,
				height: this.height
			});
		}
	};


	scoreUpdate();

	function scoreUpdate() {
		$("#scoreboard").html(player.score);
	}


	const $player = $("<div>", {id: "player"});
	$player.css({
		left: player.x,
		top: player.y,
		width: player.width,
		height: player.height
	});

	$player.appendTo($rectangle);

	const keys = {};

	//arrow key listeners
	$(window).on("keydown", event => {
		const keyCode = event.keyCode;
		keys[keyCode] = 1;
	});

	$(window).on("keyup", event => {
		const keyCode = event.keyCode;
		keys[keyCode] = 0;
	});

	function collisionCheck(sprite1, sprite2) {
		const [x1, y1, x2, y2] = [sprite1.x, sprite1.y, sprite2.x, sprite2.y];
		const [w1, h1, w2, h2] = [sprite1.width, sprite1.height, sprite2.width, sprite2.height];

		return ((x1 + w1 > x2 && x1 < x2 + w2) && (y1 + h1 > y2 && y1 < y2 + h2));
	}



	/* AUTONOMOUS GUY SCRIPTS */

	function Guy(x, y, id) {
		this.width = 20;
		this.height = 20;
		this.x = x;
		this.y = y;
		this.dx = 0;
		this.dy = 0;
		this.angry = true;
		this.id = id;
		this.speed = 3;

		this.move = function() {
			function randChange() {
				return Math.floor(Math.random() * 3) - 1;
			}

			const [newDx, newDy] = [this.dx + randChange(), this.dy + randChange()];

			this.dx = Math.min(this.speed, (Math.max(-this.speed, newDx)));
			this.dy = Math.min(this.speed, (Math.max(-this.speed, newDy)));

			const newX = this.x + this.dx;
			const newY = this.y + this.dy;

			this.x = Math.min(Math.max(0, newX), width - this.width);
			this.y = Math.min(Math.max(0, newY), height - this.height);

			//bounce
			if(this.x <= 0 || this.x + this.width >= width) this.dx *= -1;
			if(this.y <= 0 || this.y + this.height >= height) this.dy *= -1;

			guys.forEach(guy => {
				if(guy.id !== this.id && collisionCheck(guy, this)) {
					this.dx *= -1;
					this.dy *= -1;
					guy.dx *= -1;
					guy.dy *= -1;
				}
			})

			$(`#${this.id}`).css({
				width: this.width,
				height: this.height,
				left: this.x,
				top: this.y
			})
		}
	}

	const minDistanceFromPlayer = 200;

	function spawnGuy() {
		//make a new guy, far enough away from the player
		let [x, y] = [Math.floor(Math.random() * (width - 20)), 
					  Math.floor(Math.random() * (height - 20))];
		let distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);

		while(distance < minDistanceFromPlayer) {
			//too close! do another coordinates
			[x, y] = [Math.floor(Math.random() * (width - 20)), 
					  Math.floor(Math.random() * (height - 20))];
			distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
		}

		const id = "guy" + (new Date().getTime()).toString() 
				   + (Math.floor(Math.random() * 1e9)).toString();
		const newGuy = new Guy(x, y, id);

		//render the guy on screen
		const $guy = $("<div>", {class: "guy", id: id});
		
		$guy.css({
			width: newGuy.width,
			height: newGuy.height,
			left: newGuy.x,
			top: newGuy.y,
			backgroundColor: colours.next().value
		})

		$guy.appendTo($rectangle);
		console.log(newGuy);

		return newGuy;
	}


	


	const guys = new Set();

	//spawn some guys
	for(let i = 0; i < 10; i++) {
		guys.add(spawnGuy());
	}





	/* POWERUP SCRIPTS */

	function PowerUp(x, y, id, type) {
		this.x = x;
		this.y = y;
		this.width = 30;
		this.height = 30;
		this.id = id;
		this.type = type;

		this.remove = function() {
			$(`#${this.id}`).remove();
		}

		this.flash = function() {
			$(`#${this.id}`).css({backgroundColor: colours.next().value})
		}
	}


	function spawnPowerUp(type) {
		//make a new powerup, far enough away from the player
		let [x, y] = [Math.floor(Math.random() * (width - 30)), 
					  Math.floor(Math.random() * (height - 30))];
		let distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);

		while(distance < minDistanceFromPlayer) {
			//too close! do another coordinates
			[x, y] = [Math.floor(Math.random() * (width - 30)), 
					  Math.floor(Math.random() * (height - 30))];
			distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
		}

		const id = "powerup" + (new Date().getTime()).toString() 
				   + (Math.floor(Math.random() * 1e9)).toString();
		const newPowerUp = new PowerUp(x, y, id, type);

		//render the powerup on screen
		const $powerUp = $("<div>", {class: "powerup", id: id});
		
		$powerUp.css({
			width: newPowerUp.width,
			height: newPowerUp.height,
			left: newPowerUp.x,
			top: newPowerUp.y,
			backgroundColor: "#000"
		})

		$powerUp.appendTo($rectangle);
		console.log(newPowerUp);

		return newPowerUp;
	}

	const powerUps = new Set();

	powerUps.add(spawnPowerUp("speed"));
	powerUps.add(spawnPowerUp("size"));

	const gameLoop = setInterval(function() {
		let [x, y] = [0, 0];

		[37, 38, 39, 40].forEach(code => {
			if(keys[code]) {
				const direction = directions[code];
				x += direction.x;
				y += direction.y;
			}
		})

		player.move(x, y);

		guys.forEach(guy => {
			guy.move();

			if(collisionCheck(player, guy)) {
				alert("you died good job");
				clearInterval(gameLoop);
			}
		});

		powerUps.forEach(powerUp => {
			powerUp.flash();

			if(collisionCheck(powerUp, player)) {
				console.log(powerUp.type);
				player.powerUp(powerUp.type);
				powerUps.delete(powerUp);
				powerUp.remove();
				powerUps.add(spawnPowerUp(["speed", "size"][Math.floor(Math.random() * 2)]));
			}
		})
		
	}, 1000 / 60);
})