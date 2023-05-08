/*
 * U3 -> sketch_04 : Skewing
 * Adding Colors
*/

const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const settings = {
	dimensions: [1080, 1080],
	animate: false,
	context: '2d'
};

const sketch = ({ context, width, height }) => {
	let x, y, w, h, fill, stroke, blend;
	const num = 40; // 40
	const degrees = -30;

	const rects = [];

	const rectColors = [
		random.pick(risoColors),
		random.pick(risoColors),
		// random.pick(risoColors),
	];

	// pick from the entire color set for the bg
	const bgColor = random.pick(risoColors).hex;

	for (let i = 0; i < num; i++) {
		x = random.range(0, width);
		y = random.range(0, height);
		w = random.range(600, width);
		h = random.range(20, 200); // (40, 200)

		fill = random.pick(rectColors).hex;
		stroke = random.pick(rectColors).hex;
		// console.log('fill -> ', fill);

		// random blend modes
		blend = (random.value() > 0.5) ? 'overlay' : 'source-over';

		rects.push({ x, y, w, h, fill, stroke, blend });
	}

	return ({ context, width, height }) => {
		context.fillStyle = bgColor;
		context.fillRect(0, 0, width, height);

		rects.forEach(rect => {
			const { x, y, w, h, fill, stroke, blend } = rect;
			let shadowColor;

			context.save();
			context.translate(x, y);
			context.strokeStyle = stroke;
			context.fillStyle = fill;
			context.lineWidth = 10;

			// blend mode on
			context.globalCompositeOperation = blend;

			drawSkewedRect({ context, w, h, degrees });

			// convert to HSL and bring a darker version of our
			// picked color
			shadowColor = Color.offsetHSL(fill, 0, 0, -20);
			// bring back alpha value
			shadowColor.rgba[3] = 0.5;

			// add shadow to ctx
			context.shadowColor = Color.style(shadowColor.rgba);
			context.shadowOffsetX = -10;
			context.shadowOffsetY = 20;

			context.fill();

			// no shadow for strokes
			context.shadowColor = null;
			context.stroke();

			// blend mode off
			context.globalCompositeOperation = 'source-over';

			// thin outlines around shapes
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();

			context.restore();
		});
	};
};

const drawSkewedRect = ({ context, w = 600, h = 200, degrees = -45 }) => {
	const angle = math.degToRad(degrees);
	const rx = Math.cos(angle) * w;
	const ry = Math.sin(angle) * w;

	context.save();
	context.translate(rx * -0.5, (ry + h) * -0.5);

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(rx, ry);
	context.lineTo(rx, ry + h);
	context.lineTo(0, h);
	context.closePath();
	// context.stroke();

	context.restore();
}

canvasSketch(sketch, settings);
