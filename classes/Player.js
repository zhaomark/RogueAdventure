
var BASE_HITPOINTS = 4;
var BASE_DAMAGE = 1;
var BASE_DEFENSE = 1;

function Player(map) {
	this.map = map;

	this.hitpoints = BASE_HITPOINTS;
	this.baseHitpoints = BASE_HITPOINTS;
	this.damage = BASE_DAMAGE;
	this.defense = BASE_DEFENSE;
	this.weapon = null;
	this.armor = null;
	this.inventory = [];

	this.row = null;
	this.column = null;
	this.seq = "";


	this.performAction = function(action) {
		resetLog();
		this.getRoom().broadcastAction(action, this);
		$(document).trigger('actionPerformed');
	};

	this.enterDoor = function(door) {
		log('You walk through the ' + door.position + ' door.');

		if (door.position == 'North') this.row--;
		else if (door.position == 'South') this.row++;
		else if (door.position == 'East') this.column++;
		else if (door.position == 'West') this.column--;

		// Describe newly entered room
		log(this.getRoom().describe());
	};

	this.engage = function(creature, attackFirst) {
		if (creature instanceof Monster) {
			// Engage in battle
			do {
				if (attackFirst) {
					this.attack(creature);
					if (creature.hitpoints > 0) creature.attack(this);
				} else {
					creature.attack(this);
					if (this.hitpoints > 0) this.attack(creature);
				}
			} while(this.hitpoints > 0 && creature.hitpoints > 0);

			// Determine which creature is dead
			if (this.hitpoints <= 0) gameOver();
			else {
				creature.die();
				log('The ' + creature.type + ' is dead.');
				log(this.getRoom().describe());
			}
		}
	};

	this.attack = function(creature) {
		var damage = calculateDamage(this.damage, creature.defense);
		if (damage == null) {
			log ('You try to hit the ' + creature.type + ', but miss!');
		} else {
			var plural = damage == 1 ? '' : 's';
			creature.hitpoints -= damage;
			log('You hit the ' + creature.type + ' for ' + damage +
				' hitpoint' + plural + '.');
		}

		if (creature.state == 'sleeping' && creature.hitpoints > 0) creature.wakeUp();
	};

	/* Helper functions */

	this.getOptions = function() {
		var verbs = this.getVerbs();
		return this.getRoom().getOptions(verbs);
	};

	this.getVerbs = function() {
		var verbs = [];
		var room = this.getRoom();
		if (room.item) verbs = verbs.concat(room.item.getVerbs());
		if (room.treasure) verbs = verbs.concat(room.treasure.getVerbs());
		if (room.creature) verbs = verbs.concat(room.creature.getVerbs());
		for (var i = 0; i < room.doors.length; i++) {
			verbs = verbs.concat(room.doors[i].getVerbs());
		}

		return verbs;
	};

	this.setPosition = function(row, column) {
		this.row = row;
		this.column = column;
	};

	this.getPosition = function() {
		return {row: this.row, column: this.column};
	};

	this.getRoom = function() {
		return this.map[this.row][this.column];
	};
}