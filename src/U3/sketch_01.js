/*
 * U3 -> sketch_01 : Skewing
*/

const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  context: '2d'
};

const sketch = () => {
	let x, y, w, h;
  return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		x = width * 0.5;
		y = height * 0.5;
		w = width * 0.6;
		h = height * 0.1;

		context.save();
		context.translate(x, y);
		context.strokeStyle = 'black';
		// context.strokeRect(w * -0.5, h * -0.5, w, h);
		// draw the rect point by point
		context.beginPath();
		context.moveTo(w * -0.5, h * -0.5);
		context.lineTo(w * 0.5, h * -0.5);
		context.lineTo(w * 0.5, h * 0.5);
		context.lineTo(w * -0.5, h * 0.5);
		context.closePath();
		context.stroke();
		context.restore();
  };
};

canvasSketch(sketch, settings);
