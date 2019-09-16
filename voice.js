let recognizer; 
async function app() {
	recognizer = speechCommands.create('BROWSER_FFT');

	// Make sure that the underlying model and metadata are loaded via HTTPS
	// requests.
	await recognizer.ensureModelLoaded();

	// See the array of words that the recognizer is trained to recognize.
	words = recognizer.wordLabels();

	recognizer.listen(({scores}) => {
  // - result.scores contains the probability scores that correspond to
  //   recognizer.wordLabels().
  // - result.spectrogram contains the spectrogram of the recognized word.
  		scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
  		scores.sort((s1, s2) => s2.score - s1.score);
  		prediction = scores[0].word
  		if (prediction == "go") {
  			triggerCam();
  		}
	}, {
  		includeSpectrogram: true,
  		probabilityThreshold: 0.70
	});
}

app();
