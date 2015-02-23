
var WAKE_PROBABILITY = 0.5;

var monsterPrototypes = [
	{type: 'Bat', hitpoints: 1, damage: 0, defense: 1,  weapon: null},
	{type: 'Goblin', hitpoints: 2, damage: 1, defense: 2,  weapon: null}
];
var monsterStates = ['sleeping', 'angry'];
var monsterVerbs = ['attack'];

function Monster(prototype, state, guardedItem) {
	this.prototype = prototype;

	this.type = prototype.type;
	this.hitpoints = prototype.hitpoints;
	this.damage = prototype.damage;
	this.defense = prototype.defense;
	this.weapon = prototype.weapon;
	this.isDead = false;

	this.state = state;
	this.guardedItem = guardedItem;

	/* Functions handle by Room object */

	this.describe = function() {
		return constructSentence(this);
	};

	this.receiveAction = function(action, player) {
		if (action == 'attack') {
			log('You raise your sword to fight the ' + this.type + '.');
			player.engage(this, true);
		} else if (action == 'take') {
			// If monster is sleeping, do we wake up?
			if (this.state == 'sleeping') {
				var doesWakeUp = Math.random() < WAKE_PROBABILITY;
				if (doesWakeUp) this.wakeUp();
			}

			// If monster is awake, attack
			if (this.state != 'sleeping') player.engage(this, false);
		}
	};

	this.attack = function(player) {
		var damage = calculateDamage(this.damage, player.defense);

		if (damage == null) {
			log ('The ' + this.type + ' tries to hit you, but misses!');
		} else {
			var plural = damage == 1 ? '' : 's';
			player.hitpoints -= damage;
			log('The ' + this.type + ' hits you for ' + damage + ' hitpoint' + plural + '.');
		}
	};

	this.wakeUp = function() {
		log('The ' + this.type + ' woke up in an angry fit!');
		this.state = 'angry';
	};

	this.die = function() {
		this.isDead = true;
	};

	/* Helper functions */

	this.getVerbs = function() {
		if (this.isDead) return [];
		else return monsterVerbs;
	};
}

function generateRandomMonster(item) {
	var prototype = randElement(monsterPrototypes);
	var state = randElement(monsterStates);

	return new Monster(prototype, state, item);
}