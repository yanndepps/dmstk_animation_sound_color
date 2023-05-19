/*
 * U5 -> sketch_01 : Sound
 * ...
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
	};
};

canvasSketch(sketch, settings);
