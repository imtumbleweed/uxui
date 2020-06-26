const window_sfx = new Array(1000);
let SoundStation = function(filename) {
	this.that = this;
	this.context = null;
	this.audio = new Audio(filename);
//	this.volumeGain = null;	// currently used only for background music volume
	this.volumeGainContext = null;	// currently used only for background music volume
	this.musicVolume = 1.0;
	let that = this;
	// Play sound in __buffer_ID
	this.play = function(__buffer_ID, repeatSound, contextGain) {
		if (window_sfx[__buffer_ID] == undefined)
			return;
		let __buffer = window_sfx[__buffer_ID];
		let source = this.context.createBufferSource();
		source.buffer = __buffer;
		if (contextGain) {
			this.volumeGainContext = this.context.createGain();
			source.connect(this.volumeGainContext);
			this.volumeGainContext.connect(this.context.destination);
			this.volumeGainContext.gain.value = 1.0;
		} else
		source.connect(this.context.destination);
		source.start(0);
		if (repeatSound)
			source.loop = true;
	}
	this.available = false;
	this.Initialize = function() {
		let contextClass = (window.AudioContext || 
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.oAudioContext ||
			window.msAudioContext);
		if (contextClass) {
			this.available = true;
			this.context = new contextClass();
		} else
			this.available = false;
	}
	this.onError = function() { console.log("Sound.load('')... Failed!"); }
	this.load = function(__buffer_ID, filename_url) {
		let request = new XMLHttpRequest();
		request.open('GET', filename_url, true);
		request.responseType = 'arraybuffer';
		let that_v2 = this.that;
		request.onload = event => {
			this.context.decodeAudioData(request.response, function(theBuffer) {
			window_sfx[__buffer_ID] = theBuffer;
			console.log("Sound.load('mp3')... Ok!");
				window.soundtrackReady = true;
					
		}, this.onError);
		}
		request.send();
	}
}

export { SoundStation };