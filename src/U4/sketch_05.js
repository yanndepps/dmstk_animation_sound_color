/*
 * U4 -> sketch_05 : Curves
 * Segments
*/

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: true,
};

const sketch = ({ width, height }) => {
	// num cols & rows in grid
	const cols = 12; // 12
	const rows = 6; // 6
	const numCells = cols * rows;
	// grid width & height
	const gw = width * 0.8;
	const gh = height * 0.8;
	// dim of each cell
	const cw = gw / cols;
	const ch = gh / rows;
	// margins around grid
	const mx = (width - gw) * 0.5;
	const my = (height - gh) * 0.5;
	// array to store points
	const points = [];

	let x, y, n, lineWidth;
	let freq = 0.002;
	let amp = 90;

	// TODO
	// const colors = colormap({
	// 	colormap: 'magma',
	// 	nshades: amp,
	// });

	for (let i = 0; i < numCells; i++) {
		x = (i % cols) * cw;
		y = Math.floor(i / cols) * ch;

		n = random.noise2D(x, y, freq, amp);
		x += n;
		y += n;

		lineWidth = math.mapRange(n, -amp, amp, 2, 20);

		points.push(new Point({ x, y, lineWidth }));
	}

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.save();
		context.translate(mx, my);
		context.translate(cw * 0.5, ch * 0.5);

		context.strokeStyle = 'red';
		context.lineWidth = 4;

		let lastx, lasty;

		// draw lines
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols - 1; c++) {
				const curr = points[r * cols + c + 0];
				const next = points[r * cols + c + 1];

				const mx = curr.x + (next.x - curr.x) * 0.5;
				const my = curr.y + (next.y - curr.y) * 0.5;

				if (!c) {
					lastx = curr.x;
					lasty = curr.y;
				}

				context.beginPath();
				context.lineWidth = curr.lineWidth;

				context.moveTo(lastx, lasty);
				context.quadraticCurveTo(curr.x, curr.y, mx, my);

				context.stroke();

				lastx = mx;
				lasty = my;
			}
		}

		// draw points
		// points.forEach(point => {
		// 	point.draw(context);
		// });

		context.restore();
	};
};

canvasSketch(sketch, settings);

class Point {
	constructor({ x, y, lineWidth }) {
		this.x = x;
		this.y = y;
		this.lineWidth = lineWidth;
	}

	draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = 'white';

		context.beginPath();
		context.arc(0, 0, 5, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
}