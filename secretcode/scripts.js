var colors = ["#0000FF","#00FF00","#FF0000","#FFFF00","#00FFFF","#FF00FF","#000000","#CCCCCC"];

var selection = [null,null,null,null];
var target = [null,null,null,null];
var attnum = 0;

console.log("-- To kill the fun in the game, feel free to cheat. Type 'target' to see the four color IDs (0-7) of the secret code.\n-- If you're into the more techical stuff (shoutout to Aron H.), modify the colors of the game by adjusting the color codes in the 'colors' array. Call the 'init()' function when done. Be sure to send me screenshots, if you do so! (on facebook or at mgabor@mgabor.hu)");

function init() {
	for (i = 0; i <= 7; i++) {
		document.getElementById("color"+i).style.backgroundColor = colors[i];
	}

	for (i = 0; i <= 3; i++) {
		target[i] = Math.floor(Math.random()*8);
	}
}

function addColor(num) {
	for (i = 0; i <= 3; i++) {
		if (selection[i] == null) {
			selection[i] = num;
			break;
		}
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = colors[selection[i]];
	}
}

function clearColor(num) {
	if (num == 5) { // Backspace (clear last color)
		for (i = 3; i >= 0; i--) {
			if (selection[i] != null) {
				selection.splice(i,1);
				break;
			}
		}
	} else if (num == 4) { // Clear all
		selection = [null,null,null,null];
	} else { // Clear specific
		selection[num] = null;
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = (selection[i] == null)?"#FFFFFF":colors[selection[i]];
	}
}

function enterColors() {
	if (attnum > 14) return;
	for (i = 0; i <= 3; i++) {
		if (selection[i] == null) return;
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById(i+"att"+attnum).style.backgroundColor = colors[selection[i]];
	}

	yellow = 0;
	red = 0;
	selchecked = [];
	checked = [];
	for (i = 0; i <= 3; i++) {
		if (selection[i] == target[i]) {
			yellow++;
			checked[checked.length] = i;
			selchecked[selchecked.length] = i;
		}
	}
	for (i = 0; i <= 3; i++) {
		loop: for (j = 0; j <= 3; j++) {
			if (j != i && selection[i] == target[j]) {
				for (k = 0; k < checked.length; k++) {
					if (j == checked[k]) continue loop;
				}
				for (k = 0; k < selchecked.length; k++) {
					if (i == selchecked[k]) continue loop;
				}
				red++;
				checked[checked.length] = j;
				selchecked[selchecked.length] = i;
			}
		}
	}

	for (i = 0; i < red; i++) {
		document.getElementById("red"+attnum).innerHTML += "&bull;";
	}
	for (i = 0; i < yellow; i++) {
		document.getElementById("yellow"+attnum).innerHTML += "&bull;";
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = "#FFFFFF";
	}

	//console.log("red: " + red + " yellow: "+yellow);
	if (yellow == 4 && red == 0) showTarget();
	if (attnum == 14) { showTarget(); alert("You suck!");}

	selection = [null,null,null,null];
	attnum++;
}

function showTarget() {
	for (i = 0; i <= 3; i++) {
		document.getElementById("target"+i).innerHTML = "";
		document.getElementById("target"+i).style.backgroundColor = colors[target[i]];
	}
}

function keyDown(e) {
	//console.log(e.keyCode);
	switch (e.keyCode) {
		case (32):	enterColors();
					e.preventDefault();
					break;
		case (13):	enterColors()
					e.preventDefault();
					break;
		case (49):	addColor(0);
					break;
		case (50):	addColor(1);
					break;
		case (51):	addColor(2);
					break;
		case (52):	addColor(3);
					break;
		case (53):	addColor(4);
					break;
		case (54):	addColor(5);
					break;
		case (55):	addColor(6);
					break;
		case (56):	addColor(7);
					break;
		case (8):	clearColor(5);
					e.preventDefault();
	}
}