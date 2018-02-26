/* PLAYER SCRIPTS */
const directions = {
	37: {x: -1, y: 0},
	38: {x: 0, y: -1},
	39: {x: 1, y: 0},
	40: {x: 0, y: 1}
}

//the soul
const player = {
	x: 100,
	y: 100,
	width: 10,
	height: 10,
	speed: 2,
	score: 0,
	powerUp: function(type) {
		const scoreBefore = this.score;

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

		const diff = Math.floor(scoreBefore / 2000) < Math.floor(this.score / 2000)

		for(let i = 0; i < diff; i++) {
			guys.add(spawnGuy());
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

//the body
const $player = $("<div>", {id: "player"});

$player.css({
	left: player.x,
	top: player.y,
	width: player.width,
	height: player.height
});


$player.appendTo($rectangle);
