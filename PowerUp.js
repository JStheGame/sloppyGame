/* POWERUP SCRIPTS */

//the soul
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

//the body
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