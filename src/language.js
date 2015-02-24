
var VOWELS = ['a', 'e', 'i', 'o', 'u'];

// hi!

function constructSentence(obj) {
	var modifier = '';

	if (obj instanceof Room) {
		// Get all objects in room
		var creature = '', treasure = '', item = '', doors = '';
		if (obj.creature != null) creature = obj.creature.describe();
		if (obj.treasure != null) treasure = obj.treasure.describe();
		if (obj.item != null) item = obj.item.describe();
		for (var i = 0; i < obj.doors.length; i++) {
			if (i == 0) doors += obj.doors[i].describe();
			else doors += '\n' + obj.doors[i].describe();
		}

		return sprintf('%s\n%s\n%s\n%s', creature, treasure, item, doors)
			.split('\n').filter(function(s) {return s != ''}).join('\n');
	} else if (obj instanceof Door) {
		// Determine if door is locked
		if (obj.isLocked) modifier = 'locked ';

		return sprintf('There is a %sdoor to the %s.', modifier, obj.position);
	} else if (obj instanceof Monster) {
		// Get state of monster
		var state = '';
		if (obj.isDead) {
			state = 'dead ';
		} else if (obj.state != null) {
			modifier = isVowel(obj.state[0]) ? 'n' : '';
			state = obj.state + ' ';
		}

		// Determine if monster is guarding an item
		var guard = '';
		if (obj.guardedItem != null && ! obj.isDead) {
			item = obj.guardedItem.name;
			var modifier2 = isVowel(item[0]) ? 'n' : '';
			guard = ' guarding a/MODIFIER/ /ITEM/ '
				.replace('/MODIFIER/', modifier2)
				.replace('ITEM', item);
		}

		return sprintf('There is a%s %s%s %shere.', modifier, state, obj.type, guard);
	}
}

function isVowel(letter) {
	return VOWELS.indexOf(letter.toLowerCase()) != -1;
}
