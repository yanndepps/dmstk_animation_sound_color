/*
 * U4 -> sketch_04 : Curves
 * Creating a Grid
*/

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: true,
};

const sketch = ({ width, height }) => {
	// num cols & rows in grid
	const cols = 36; // 12
	const rows = 18; // 6
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

	let x, y, n;
	let freq = 0.002;
	let amp = 90;

	for (let i = 0; i < numCells; i++) {
		x = (i % cols) * cw;
		y = Math.floor(i / cols) * ch;

		n = random.noise2D(x, y, freq, amp);
		x += n;
		y += n;

		points.push(new Point({ x, y }));
	}

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.save();
		context.translate(mx, my);
		context.translate(cw * 0.5, ch * 0.5);

		context.strokeStyle = 'red';
		context.lineWidth = 4;

		// draw lines
		for (let r = 0; r < rows; r++) {
			context.beginPath();
			for (let c = 0; c < cols - 1; c++) {
				const curr = points[r * cols + c + 0];
				const next = points[r * cols + c + 1];

				const mx = curr.x + (next.x - curr.x) * 0.5;
				const my = curr.y + (next.y - curr.y) * 0.5;

				if (c == 0) context.moveTo(curr.x, curr.y);
				else if (c == cols - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
				else context.quadraticCurveTo(curr.x, curr.y, mx, my);
			}
			context.stroke();
		}

		// draw points
		points.forEach(point => {
			point.draw(context);
		});

		context.restore();
	};
};

canvasSketch(sketch, settings);

class Point {
	constructor({ x, y }) {
		this.x = x;
		this.y = y;
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
