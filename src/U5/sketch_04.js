/*
 * U5 -> sketch_04 : Sound
 * Arcs
 */

const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const eases = require('eases');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
	const numCircles = 5;
	const numSlices = 9;
	const slice = Math.PI * 2 / numSlices;
	const radius = 200;
	const bins = [4, 12, 37];

	return ({ context, width, height }) => {
		context.fillStyle = '#EEEAE0';
		context.fillRect(0, 0, width, height);

		// if (!audioContext) return;
		// analyserNode.getFloatFrequencyData(audioData);

		// only translate once
		context.save();
		context.translate(width * 0.5, height * 0.5);

		// loop through both circles & slices
		for (let i = 0; i < numCircles; i++) {
			context.save();
			for (let j = 0; j < numSlices; j++) {
				context.rotate(slice);
				context.lineWidth = 10;
				context.beginPath();
				// TODO
				context.arc(0, 0, radius + i * 50, 0, slice);
				context.stroke();
			}
			context.restore();
		}

		context.restore();
	};
};

const addListeners = () => {
	window.addEventListener('mouseup', () => {
		if (!audioContext) createAudio();
		if (audio.paused) {
			audio.play();
			manager.play();
		} else {
			audio.pause();
			manager.pause();
		}
	});
};

// audio context
const createAudio = () => {
	audio = document.createElement('audio');
	audio.src = './assets/audio/snd_01.flac';

	audioContext = new AudioContext();
	sourceNode = audioContext.createMediaElementSource(audio);
	sourceNode.connect(audioContext.destination);
	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 512;
	analyserNode.smoothingTimeConstant = 0.9;
	sourceNode.connect(analyserNode);

	// store the audio data into a typed array
	audioData = new Float32Array(analyserNode.frequencyBinCount);
};

// average of the audio data values
const getAverage = (data) => {
	let sum = 0;
	for (let i = 0; i < data.length; i++) {
		sum += data[i];
	}
	// average
	return sum / data.length;
};

// async sketch manager
const start = async () => {
	addListeners();
	manager = await canvasSketch(sketch, settings);
	manager.pause();
};

start();
