function* colourGenerator() {
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



$(document).ready(function() {
	//playfield dimensions
	const $rectangle = $("#rectangle");
	const [width, height] = ["width", "height"].map(
		prop => parseInt($rectangle.css(prop))
	);

	const colours = colourGenerator();
	const directions = {
		37: {x: -1, y: 0},
		38: {x: 0, y: -1},
		39: {x: 1, y: 0},
		40: {x: 0, y: 1}
	}

	const player = {
		x: 100,
		y: 100,
		size: 10,
		speed: 2
	};

	const $player = $("<div>", {id: "player"});
	$player.css({
		left: player.x,
		top: player.y,
		width: player.size,
		height: player.size
	});

	$player.appendTo($rectangle);

	function movePlayer(code) {
		const direction = directions[code];
		const newX = player.x + direction.x * player.speed;
		const newY = player.y + direction.y * player.speed;

		player.x = Math.min(Math.max(0, newX), width - player.size);
		player.y = Math.min(Math.max(0, newY), height - player.size);

		$player.css({
			left: player.x,
			top: player.y,
			width: player.size,
			height: player.size
		});

		console.log(player);
	}

	$(window).on("keydown", event => {
		if(event.keyCode === 90) {
			player.size += 5;
		}
		if(event.keyCode === 88) {
			player.speed += 1;
		}

		$player.css({
			width: player.size,
			height: player.size
		});

	})





	$(window).on("keydown", event => {
		const keyCode = event.keyCode;
		if(37 <= keyCode && keyCode <= 40) {
			movePlayer(keyCode);
		}
	});




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
	const flashInterval = setInterval(() => flashDots.next(), 500)

	function* flasher() {
		while(true) {
			for(const dot of dots) {
				const $dot = $(`#${dot.id}`);
				$dot.css({backgroundColor: "#fff"});
				yield;
				$dot.css({backgroundColor: dot.colour});
			}
		}
	}
})