/*
 * U5 -> sketch_01 : Sound
 * Pressing Play
 */

const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: false,
};

let audio;

const sketch = () => {
	// html audio el
	// doesn't need to be added to body, only
	// exist as an entity
	audio = document.createElement('audio');
	// path to audio file
	audio.src = './assets/audio/snd_01.flac';

	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
	};
};

// play/pause audio on mouse release
const addListeners = () => {
	window.addEventListener('mouseup', () => {
		if (audio.paused) audio.play();
		else audio.pause();
	});
};

addListeners();

canvasSketch(sketch, settings);
