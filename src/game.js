
// Constants for map generation
var ROWS = 10;
var COLUMNS = 10;

// Constants for damage calculation
var DAMAGE_VARIATION = 0.2;
var MISS_CHANCE = 0.1;

// Global player variable
var player;

$(document).ready(function() {
	start();
});

function start() {
	// Create map
	var map = createMap(ROWS, COLUMNS);
	player = new Player(map);

	// Set player in center of map
	var row = Math.floor(ROWS / 2);
	var column = Math.floor(COLUMNS / 2);
	player.setPosition(row, column);

	// Tell player what's in the room
	log(player.getRoom().describe());

	// Display available options to player
	updateSequenceDisplay(player.getOptions(), player.seq);

	// Display new actions whenever player performs an action
	$(document).on('actionPerformed', function(e) {
		updateSequenceDisplay(player.getOptions(), player.seq);
	});
}

function gameOver() {
	log('You are dead.');
	log('Game over!');
}

function log(string) {
	speakSentences(string.split('\n'));
	string = string.replace(/\n/g, '</p><p>');
	$('#log').append(sprintf('<p>%s</p>', string));
}

function resetLog() {
	$('#log').html('');
}

function calculateDamage(attackerDamage, defenderDefense) {
	// Does the attack miss?
	if (Math.random() < MISS_CHANCE) return null;

	var percent = randFloat(0.5 - DAMAGE_VARIATION, 0.5 + DAMAGE_VARIATION);
	return Math.ceil(Math.pow(2, attackerDamage) * (attackerDamage / defenderDefense) * percent);
}