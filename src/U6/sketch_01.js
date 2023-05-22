/*
 * U6 -> sketch_01 : Particles
 * Drawing a Single Particle
 */

const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1024, 1024],
	context: '2d',
	animate: true,
};

const particles = [];

const sketch = ({ width, height }) => {
	let x, y, particle;

	// populate the array with x num of particles
	for (let i = 0; i < 1; i++) {
		x = width * 0.5;
		y = height * 0.5;
		particle = new Particle({ x, y });
		particles.push(particle);
	}

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		particles.forEach(particle => {
			particle.update();
			particle.draw(context);
		});
	};
};

canvasSketch(sketch, settings);

class Particle {
	constructor({ x, y, radius = 10 }) {
		// position
		this.x = x;
		this.y = y;

		// acceleration
		this.ax = 0;
		this.ay = 0;

		// velocity
		this.vx = 0;
		this.vy = 0;

		// initial position
		this.ix = x;
		this.iy = y;

		// size
		this.radius = radius;
	}

	update() {
		// apply some force to particles by inc acceleration
		this.ax += 0.001;
		// inc velocity by acceleration
		this.vx += this.ax;
		this.vy += this.ay;

		// inc position by velocity
		this.x += this.vx;
		this.y += this.vy;
	}

	draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = 'white';

		context.beginPath();
		context.arc(0, 0, this.radius, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
}
