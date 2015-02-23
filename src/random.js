
// Return random index of an array of size 'length' -> [0, length - 1)
function randIndex(length) {
	return Math.floor(Math.random() * length);
}

function randElement(array) {
	return array[randIndex(array.length)];
}

function randFloat(min, max) {
	return Math.random() * (max - min) + min;
}