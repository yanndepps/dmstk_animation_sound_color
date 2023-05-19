/*
 * U5 -> sketch_02 : Sound
 * Analyser
 */

const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: false,
};

let audio;

const sketch = () => {
	audio = document.createElement('audio');
	audio.src = './assets/audio/snd_01.flac';

	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
	};
};

const addListeners = () => {
	window.addEventListener('mouseup', () => {
		if (audio.paused) audio.play();
		else audio.pause();
	});
};

addListeners();

canvasSketch(sketch, settings);
