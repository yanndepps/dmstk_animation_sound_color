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
	const cols = 12;
	const rows = 6;
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
	// for all grid cells
	// define x,y & and push new points
	// into the array
	let x, y;
	for (let i = 0; i < numCells; i++) {
		x = (i % cols) * cw;
		y = Math.floor(i / cols) * ch;
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
			for (let c = 0; c < cols; c++) {
				const point = points[r * cols + c];
				if (!c) context.moveTo(point.x, point.y);
				else context.lineTo(point.x, point.y);
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
		context.fillStyle = 'red';

		context.beginPath();
		context.arc(0, 0, 10, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
}
