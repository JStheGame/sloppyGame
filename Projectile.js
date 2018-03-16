/* PROJECTILE SCRIPTS */

const projectiles = new Set();

class Projectile {
	constructor(x, y, dx, dy, size, id) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.width = size;
		this.height = size;
		this.id = id;
	}

	move() {
		console.log(this.id)
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		$(`#${this.id}`).css({
			left: this.x,
			top: this.y
		});

		if(this.x + this.width < 0 
			|| this.x > width 
			|| this.y + this.height < 0 
			|| this.y > height) this.despawn();
	}

	despawn() {
		$(`#${this.id}`).remove();
		projectiles.delete(this);
	}

	ricochet() {
		this.dx *= -1.1;
		this.dy *= -1.1;
	}
}

function spawnProjectile(x, y, dx, dy, size) {
	const id = "projectile" + (new Date().getTime()).toString() 
			   + (Math.floor(Math.random() * 1e9)).toString();
	const projectile = new Projectile(x, y, dx, dy, size, id);
	const $projectile = $("<div>", {class: "projectile", id: id});

	$projectile.css({
		width: size,
		height: size,
		left: x,
		top: y,
		backgroundColor: "#fab"
	});

	console.log(id);

	projectiles.add(projectile);
	$projectile.appendTo($rectangle);
}