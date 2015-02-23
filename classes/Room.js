
var CREATURE_PROBABILITY = 0.6;
var TREASURE_PROBABILITY = 0.2;
var ITEM_PROBABILITY = 0.4;

var MONSTER_PROBABILITY = 1; // Change to 0.7 later

function Room(creature, treasure, item, doors) {
	this.creature = creature;
	this.treasure = treasure;
	this.item = item;
	this.doors = doors;

	this.describe = function() {
		return constructSentence(this);
	};

	this.broadcastAction = function(action, player) {
		if (this.creature) this.creature.receiveAction(action, player);
		if (this.treasure) this.treasure.receiveAction(action, player);
		if (this.item) this.item.receiveAction(action, player);
		for (var i = 0; i < this.doors.length; i++) {
			this.doors[i].receiveAction(action, player);
		}
	};

	this.getOptions = function(actions) {
		var options = [];
		for (var i = 0; i < actions.length; i++) {
			var action = actions[i];
			options.push(this.constructOption(action));
		}

		return options;
	};

	/* Helper functions */

	this.constructOption = function(action) {
		if (action == 'attack') {
			return 'Attack ' + this.creature.type;
		}

		var actionList = action.split(' ');
		var verb = actionList[0];

		if (verb == 'open') {
			var position = actionList[1];
			return 'Open ' + position + ' Door';
		}
	};
}

function generateRandomRoom(doors) {
	// Generate random creature
	var creature = null;
	if (Math.random() < CREATURE_PROBABILITY) {
		creature = Math.random() < MONSTER_PROBABILITY ? generateRandomMonster() : null; //generateRandomPerson();
	}

	// Generate random treasure
	var treasure = null;
	//if (Math.random() < TREASURE_PROBABILITY) treasure = generateRandomTreasure();

	// Generate random item
	var item = null;
	//if (Math.random() < ITEM_PROBABILITY) item = generateRandomItem();

	return new Room(creature, treasure, item, doors);
}