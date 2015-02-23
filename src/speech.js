
// Queues a single sentence to be spoken
function speakSentence(sentence) {
	speechSynthesis.speak(new SpeechSynthesisUtterance(sentence));
}

// Queues multiple sentences to be spoken
function speakSentences(sentences) {
	for (var i = 0; i < sentences.length; i++) {
		var sentence = sentences[i];
		speakSentence(sentence);
	}
}

function stopAllSpeech() {
	speechSynthesis.cancel();
}