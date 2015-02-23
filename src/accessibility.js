
// Speak the first complete option being typed
var speechTimeout = null;

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;

$(document).on('keydown', function(e) {
	clearTimeout(speechTimeout);
	stopAllSpeech();

	var keyCode = e.keyCode;
	var char = String.fromCharCode(keyCode);

	var seq = player.seq;
	var options = player.getOptions();
	if (keyCode == RIGHT_ARROW) {
		nextOption();
		return;
	} else if (keyCode == LEFT_ARROW) {
		var index = getOptionIndex();
		var option = getAllValidOptions(options, seq)[index];
		submitOption(option);
		return;
	} else if (char == '\r') {
		// Submit choice when player hits enter (if the choice is complete)
		if (isCompleteOption(options, seq)) submitOption(seq);
		return;
	} else if (char == '\t') {
		// Handle tab key (autocomplete)
		player.seq = autocomplete(options, seq);
		e.preventDefault();
	} else if (char == '\b') {
		// Handle backspace
		player.seq = seq.substring(0, seq.length - 1);
		e.preventDefault();
	} else {
		// Typing a space is optional
		if (isValidSequence(options, seq + char)) player.seq = seq + char;
		else if (isValidSequence(options, seq + ' ' + char)) player.seq = seq + ' ' + char;

		// Hit space to speak possible actions if no action is being typed
		else if (seq.length == 0 && char == ' ') {
			speakSentence('Here are your choices.');
			speakSentences(options);
			return;
		} else {
			// No need to update sequence display
			return;
		}
	}

	updateSequenceDisplay(options, player.seq);

	// Speak first complete option being typed
	if (player.seq.length != 0) speechTimeout = setTimeout(function() {
		speakSentence(getFirstValidOption(options, player.seq));
	}, 1000);
});

function nextOption() {
	var currentOption = $('.option.selected').first();

	// If no option is selected, select first option
	if (currentOption.length == 0) $('.option').first().addClass('selected');

	// Otherwise, select next option
	else {
		var index = getOptionIndex() + 1;
		if (index == $('.option').length) index = 0;
		currentOption.removeClass('selected');
		$('.option').slice(index, index + 1).addClass('selected');
	}

	// Speak newly selected option
	var sentence = $('.option.selected').first().text();
	speakSentence(sentence);
}

function getOptionIndex() {
	var currentOption = $('.option.selected').first();
	return $('.option').index(currentOption);
}

function submitOption(option) {
	var action = getActionFromOption(option);
	player.seq = "";
	player.performAction(action);
}

function autocomplete(options, seq) {
	if (seq.length == 0) return seq;
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (seqBeginsOption(seq, option)) return option;
	}
}

function isCompleteOption(options, seq) {
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (option.toLowerCase() == seq.toLowerCase()) return true;
	}

	return false;
}

function isValidSequence(options, seq) {
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (seqBeginsOption(seq, option)) return true;
	}

	return false;
}

function seqBeginsOption(seq, option) {
	return option.toLowerCase().indexOf(seq.toLowerCase()) == 0;
}

function getFirstValidOption(options, seq) {
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (seqBeginsOption(seq, option)) return option;
	}

	return null;
}

function getAllValidOptions(options, seq) {
	var allOptions = [];
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		if (seqBeginsOption(seq, option)) allOptions.push(option);
	}

	return allOptions;
}

function getActionFromOption(option) {
	var parameters = option.toLowerCase().split(' ');
	var verb = parameters[0];

	var modifier = "";
	if (verb == 'open') {
		var position = parameters[1];
		modifier = ' ' + capitalize(position);
	}

	return verb + modifier;
}

function updateSequenceDisplay(options, seq) {
	// Display current sequence being typed
	var option = getFirstValidOption(options, seq);
	var boldIndex = seq.length;
	var boldText = option.substring(0, boldIndex);
	var grayText = option.substring(boldIndex);
	if (seq.length == 0) grayText = 'Begin Typing...';
	$('#sequence').html(sprintf('<p><span class="bold">%s</span><span class="gray">%s</span></p>',
		boldText, grayText));

	// Display all possible choices
	var allOptions = getAllValidOptions(options, seq);
	for (var i = 0; i < allOptions.length; i++) {
		option = allOptions[i];
		$('#sequence').append(sprintf('<div class="option"><p>%s</p></div>', option));
	}
}

function capitalize(word) {
	return word.charAt(0).toUpperCase() + word.substring(1);
}