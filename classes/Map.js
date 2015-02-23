
var ACCEPTED_POPULATED_PERCENTAGE = 0.5;

function createMap(rows, columns) {
	// Construct map (rows x columns) -> initialize all elements to 0
	var map = new Array(rows);
	for (var i = 0; i < rows; i++) {
		map[i] = new Array(columns);
		for (var j = 0; j < columns; j++) {
			map[i][j] = 0;
		}
	}

	// Generate map using random walk simulation
	var row = Math.floor(rows / 2);
	var column = Math.floor(columns / 2);
	var walks = rows * columns * 2;
	for (i = 0; i < walks; i++) {
		map[row][column] = 1;

		var axis = Math.random() < 0.5 ? 'row' : 'column';
		var direction = Math.random() < 0.5 ? 1 : -1;

		if (axis == 'row') {
			row += direction;
			if (row < 0) row = 0;
			else if (row > rows - 1) row = rows - 1;
		} else if (axis == 'column') {
			column += direction;
			if (column < 0) column = 0;
			else if (column > columns - 1) column = columns - 1;
		}
	}

	//printMap(map);

	// If map is too sparse, make a new map
	if (getMapPopulatedPercentage(map) < ACCEPTED_POPULATED_PERCENTAGE) return createMap(rows, columns);

	// If map is not too sparse, generate a room for each '1' in the map
	for (i = 0; i < rows; i++) {
		for (j = 0; j < columns; j++) {
			if (map[i][j] !== 0) {
				var doors = getDoors(map, i, j);
				map[i][j] = generateRandomRoom(doors);
			}
		}
	}

	return map;
}

function getMapPopulatedPercentage(map) {
	// Get sum of map
	var sum = 0;
	var rows = map.length;
	var columns = map[0].length;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < columns; j++) {
			sum += map[i][j];
		}
	}

	return sum / (rows * columns);
}

function getDoors(map, row, column) {
	var positions = [];
	var rows = map.length;
	var columns = map[0].length;

	if (row - 1 >= 0 && map[row - 1][column] !== 0) positions.push('North');
	if (row + 1 < rows && map[row + 1][column] !== 0) positions.push('South');
	if (column - 1 >= 0 && map [row][column - 1] !== 0) positions.push('West');
	if (column + 1 < columns && map[row][column + 1] !== 0) positions.push('East');

	var doors = [];
	for (var i = 0; i < positions.length; i++) {
		doors.push(new Door(positions[i]));
	}

	return doors;
}

function printMap(map) {
	var rows = map.length;
	var columns = map[0].length;
	for (var i = 0; i < rows; i++) {
		var rowString = '';
		for (var j = 0; j < columns; j++) {
			if (j == 0) rowString += map[i][j];
			else rowString += ' ' + map[i][j];
		}
		console.log(rowString);
	}
}