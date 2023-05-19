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
let audioContext, audioData, sourceNode, analyserNode;

const sketch = () => {

	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
	};
};

const addListeners = () => {
	window.addEventListener('mouseup', () => {
		// only call if no audio ctx
		if (!audioContext) createAudio();
		// play/pause
		if (audio.paused) audio.play();
		else audio.pause();
	});
};

// audio context
const createAudio = () => {
	audio = document.createElement('audio');
	audio.src = './assets/audio/snd_01.flac';

	audioContext = new AudioContext();
	// add input to audio ctx
	sourceNode = audioContext.createMediaElementSource(audio);
	// connect to speakers
	sourceNode.connect(audioContext.destination);
	// analyser node
	analyserNode = audioContext.createAnalyser();
	// also connect the src node to the analyser node
	sourceNode.connect(analyserNode);

	// store the audio data into a typed array
	audioData = new Float32Array(analyserNode.frequencyBinCount);
};

addListeners();

canvasSketch(sketch, settings);
