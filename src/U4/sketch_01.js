/*
 * U4 -> sketch_01 : Curves
 * Drawing a Quadratic Curve
*/

const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: false,
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		// draw a straight line
		context.beginPath();
		context.moveTo(200, 540);
		context.lineTo(800, 540);
		context.stroke();
	};
};

canvasSketch(sketch, settings);
