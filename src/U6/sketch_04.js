/*
 * U6 -> sketch_04 : Particles
 * TODO: Modifying Scale & Colors
 */

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
	dimensions: [1024, 1024],
	context: '2d',
	animate: true,
};

const particles = [];
const cursor = { x: 9999, y: 9999 };
let elCanvas;

const sketch = ({ width, height, canvas }) => {
	let x, y, particle, radius;
	let pos = [];

	const numCircles = 15;
	const gapCircle = 8;
	const gapDot = 4;
	let dotRadius = 12;
	let cirRadius = 0;
	const fitRadius = dotRadius;

	elCanvas = canvas;
	canvas.addEventListener('mousedown', onMouseDown);

	for (let i = 0; i < numCircles; i++) {
		const circumference = Math.PI * 2 * cirRadius;
		const numFit = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
		const fitSlice = Math.PI * 2 / numFit;

		for (let j = 0; j < numFit; j++) {
			// angle for each dot
			const theta = fitSlice * j;
			x = Math.cos(theta) * cirRadius;
			y = Math.sin(theta) * cirRadius;

			// center again
			x += width * 0.5;
			y += height * 0.5;

			radius = dotRadius;

			particle = new Particle({ x, y, radius });
			particles.push(particle);
		}

		// inc on each iteration
		cirRadius += fitRadius * 2 + gapCircle;
		dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
	}

	// populate the array with x num of particles
	// for (let i = 0; i < 200; i++) {
	// 	x = width * 0.5;
	// 	y = height * 0.5;

	// 	random.insideCircle(400, pos);
	// 	x += pos[0];
	// 	y += pos[1];

	// 	particle = new Particle({ x, y });
	// 	particles.push(particle);
	// }

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		particles.forEach(particle => {
			particle.update();
			particle.draw(context);
		});
	};
};

const onMouseDown = (e) => {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);
	// delegate
	onMouseMove(e);
};

const onMouseMove = (e) => {
	// cursor pos in proportion of the sketch
	const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
	const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

	cursor.x = x;
	cursor.y = y;
};

const onMouseUp = () => {
	window.removeEventListener('mousemove', onMouseMove);
	window.removeEventListener('mouseup', onMouseUp);

	cursor.x = 9999;
	cursor.y = 9999;
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

		this.minDist = random.range(100, 200);
		this.pushFactor = random.range(0.01, 0.02);
		this.pullFactor = random.range(0.002, 0.006);
		this.dampFactor = random.range(0.90, 0.95);
	}

	update() {
		let dx, dy, dd, disDelta;

		// pull force
		dx = this.ix - this.x;
		dy = this.iy - this.y;

		this.ax = dx * this.pullFactor;
		this.ay = dy * this.pullFactor;

		// push force
		dx = this.x - cursor.x;
		dy = this.y - cursor.y;
		dd = Math.sqrt(dx * dx + dy * dy);

		disDelta = this.minDist - dd;

		if (dd < this.minDist) {
			// proportional to the inverse of the dist
			this.ax += (dx / dd) * disDelta * this.pushFactor;
			this.ay += (dy / dd) * disDelta * this.pushFactor;
		}

		// inc velocity by acceleration
		this.vx += this.ax;
		this.vy += this.ay;

		// dampening
		this.vx *= this.dampFactor;
		this.vy *= this.dampFactor;

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
