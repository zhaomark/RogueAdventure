
function Door(position, isLocked) {
	this.position = position;
	this.isLocked = isLocked;

	this.describe = function() {
		return constructSentence(this);
	};

	this.getVerbs = function() {
		var verbs = ['open ' + this.position];
		if (this.isLocked) verbs.push('unlock ' + this.position);

		return verbs;
	};

	this.receiveAction = function(action, player) {
		var actionList = action.split(' ');
		var verb = actionList[0];
		var position = actionList[1];

		if (position == this.position) {
			player.enterDoor(this);
		}
	};
}