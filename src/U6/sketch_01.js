/*
 * U6 -> sketch_01 : Particles
 * TODO
 */

const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1024, 1024],
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
