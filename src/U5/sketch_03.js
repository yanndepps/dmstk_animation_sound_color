/*
 * U5 -> sketch_03 : Sound
 * Frequency
 */

const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
	context: '2d',
	animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		// read the audio data from the analyser node on every frame
		if (!audioContext) return;
		analyserNode.getFloatFrequencyData(audioData);

		// store the average of our data array
		const avg = getAverage(audioData);

		// draw a circle using these values
		context.save();
		context.translate(width * 0.5, height * 0.5);
		context.lineWidth = 10;
		context.beginPath();
		// make sure avg is not a neg num
		context.arc(0, 0, Math.abs(avg), 0, Math.PI * 2);
		context.stroke();
		context.restore();
	};
};

const addListeners = () => {
	window.addEventListener('mouseup', () => {
		// only call if no audio ctx
		if (!audioContext) createAudio();
		// play/pause
		// enable sketch manager
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

	// check the length of audio data
	// same as frequecyBinCount()
	// console.log(audioData.length);
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
	// store canvasSketch ref to the sketch manager
	manager = await canvasSketch(sketch, settings);
	// sketch in a pause state
	manager.pause();
};

start();
