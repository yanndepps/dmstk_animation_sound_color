/*
 * U6 -> sketch_05 : Particles
 * Image Data
 */

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const colormap = require('colormap');
const interpolate = require('color-interpolate');

const settings = {
	dimensions: [1024, 1024],
	context: '2d',
	animate: true,
};

const particles = [];
const cursor = { x: 9999, y: 9999 };
const colors = colormap({
	colormap: 'viridis',
	nshades: 20,
});

let elCanvas;
let imgA, imgB;

const sketch = ({ width, height, canvas }) => {
	let x, y, particle, radius;

	// new canvas -> read img data
	const imgACanvas = document.createElement('canvas');
	const imgAContext = imgACanvas.getContext('2d');

	const imgBCanvas = document.createElement('canvas');
	const imgBContext = imgBCanvas.getContext('2d');

	imgACanvas.width = imgA.width;
	imgACanvas.height = imgA.height;

	imgBCanvas.width = imgB.width;
	imgBCanvas.height = imgB.height;

	imgAContext.drawImage(imgA, 0, 0);
	imgBContext.drawImage(imgB, 0, 0);

	// get img data
	const imgAData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;
	const imgBData = imgBContext.getImageData(0, 0, imgB.width, imgB.height).data;

	const numCircles = 30;
	const gapCircle = 2;
	const gapDot = 4;
	let dotRadius = 6;
	let cirRadius = 0;
	const fitRadius = dotRadius;

	elCanvas = canvas;
	canvas.addEventListener('mousedown', onMouseDown);

	for (let i = 0; i < numCircles; i++) {
		const circumference = Math.PI * 2 * cirRadius;
		const numFit = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
		const fitSlice = Math.PI * 2 / numFit;
		let ix, iy, idx, r, g, b, colA, colB, colMap;

		for (let j = 0; j < numFit; j++) {
			// angle for each dot
			const theta = fitSlice * j;
			x = Math.cos(theta) * cirRadius;
			y = Math.sin(theta) * cirRadius;

			// center again
			x += width * 0.5;
			y += height * 0.5;

			// map img data to particle pos
			ix = Math.floor((x / width) * imgA.width);
			iy = Math.floor((y / height) * imgA.height);
			idx = (iy * imgA.width + ix) * 4;
			r = imgAData[idx + 0];
			g = imgAData[idx + 1];
			b = imgAData[idx + 2];
			colA = `rgb(${r}, ${g}, ${b})`;

			// radius = dotRadius;
			radius = math.mapRange(r, 0, 255, 1, 12);

			r = imgBData[idx + 0];
			g = imgBData[idx + 1];
			b = imgBData[idx + 2];
			colB = `rgb(${r}, ${g}, ${b})`;

			colMap = interpolate([colA, colB]);

			particle = new Particle({ x, y, radius, colMap });
			particles.push(particle);
		}

		// inc on each iteration
		cirRadius += fitRadius * 2 + gapCircle;
		dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
	}

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		// context.drawImage(imgACanvas, 0, 0);
		// context.drawImage(imgBCanvas, 0, 0);

		// sort particles -> big front, small back
		particles.sort((a, b) => a.scale - b.scale);

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

const loadImage = async (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = url;
	});
};

const start = async () => {
	imgA = await loadImage('./assets/images/img_01.avif');
	imgB = await loadImage('./assets/images/img_02.avif');
	canvasSketch(sketch, settings);
};

start();

class Particle {
	constructor({ x, y, radius = 10, colMap }) {
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

		this.radius = radius;
		this.scale = 1.0;

		this.colMap = colMap;
		this.color = colMap(0);

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
		dd = Math.sqrt(dx * dx + dy * dy);

		this.ax = dx * this.pullFactor;
		this.ay = dy * this.pullFactor;

		this.scale = math.mapRange(dd, 0, 200, 1, 5);

		// colors
		this.color = this.colMap(math.mapRange(dd, 0, 200, 0, 1, true));

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
		context.fillStyle = this.color;

		context.beginPath();
		context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
}
