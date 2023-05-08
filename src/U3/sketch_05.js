/*
 * U3 -> sketch_05 : Skewing
 * Clipping Mask
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
	];

	// log our rect colors
	rectColors.forEach((n, i) => {
		console.log(`color ${i} -> `, n.name + " " + n.hex);
	});

	// pick from the entire color set for the bg
	const bgColor = random.pick(risoColors).hex;

	// mask
	const mask = {
		radius: width * 0.4,
		sides: 6,
		x: width * 0.5,
		y: height * 0.5,
	};

	for (let i = 0; i < num; i++) {
		x = random.range(0, width);
		y = random.range(0, height);
		w = random.range(600, width);
		h = random.range(40, 200); // (40, 200)

		fill = random.pick(rectColors).hex;
		stroke = random.pick(rectColors).hex;

		// random blend modes
		blend = (random.value() > 0.5) ? 'overlay' : 'source-over';

		rects.push({ x, y, w, h, fill, stroke, blend });
	}

	return ({ context, width, height }) => {
		context.fillStyle = bgColor;
		context.fillRect(0, 0, width, height);

		// triangle shape
		context.save();
		context.translate(mask.x, mask.y);

		drawPolygon({ context, radius: mask.radius, sides: mask.sides });

		context.clip();


		// rects
		rects.forEach(rect => {
			const { x, y, w, h, fill, stroke, blend } = rect;
			let shadowColor;

			context.save();
			context.translate(-mask.x, -mask.y);
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

		context.restore();

		// polygon outline
		context.save();
		context.translate(mask.x, mask.y);
		context.lineWidth = 20;

		drawPolygon({ context, radius: mask.radius - context.lineWidth, sides: mask.sides });

		context.globalCompositeOperation = 'color-burn';
		// context.strokeStyle = 'black';
		context.strokeStyle = rectColors[0].hex;
		context.stroke();
		context.restore();
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

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
	const slice = Math.PI * 2 / sides;

	context.beginPath();
	context.moveTo(0, -radius);

	for (let i = 0; i < sides; i++) {
		const theta = i * slice - Math.PI * 0.5;
		context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
	}

	context.closePath();
};

canvasSketch(sketch, settings);
