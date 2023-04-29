const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

const settings = {
  p5: true,
  dimensions: [ 500, 500 ],
  animate: true,
  context: '2d'
};

const sketch = () => {
  return ({ context, width, height }) => {
	background(33);
  };
};

canvasSketch(sketch, settings);
