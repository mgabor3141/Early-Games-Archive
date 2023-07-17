var tck, ctx;
var p, c;
var currentlevel, active;

var up = false, left = false, down = false, right = false;
var debug = false;

// =======================================

var img = new Array();
var loaded = 0;

function preload() {
	var images = [
		"p0",
		"p1",
		"key_0_0",
		"key_0_1",
		"key_1_1",
		"key_1_0",
		"lock0",
		"lock1",
		"ward"
	];

	for (var i = 0; i < 60; i++) {
		images[images.length] = "exit_0_" + i;
		images[images.length] = "exit_1_" + i;
	}

	for (var i = 0; i < images.length; i++) {
		img[images[i]] = new Image();
		img[images[i]].onload = function() {loaded++;};
		img[images[i]].src = "img/" + images[i] + ".png";
	}
}

function resize() {
	//document.getElementById("container").style.left = (window.innerWidth - ctx.canvas.width) / 2;
	//document.getElementById("container").style.top = 100;
}

function init() {
	window.addEventListener("resize", resize);
	window.addEventListener("keydown", keyDn);
	window.addEventListener("keyup", keyUp);

	if (!(ctx = document.getElementById("canvas").getContext("2d"))) {
		alert("Get a new browser.");
		return;
	}

	resize();
	preload();
	resetGame();
	game();
}

var PICKUPANIM = 40;
var OPENANIM = 20;

var keys;
var doors;

var TITLETIME = 220;
var TITLEFADE = 40;
var titleTimer;

var gameOver = false;

function loadLevel(n) {
	if (n >= levels.length) {
		// END OF GAME
		console.log("Game over.")
		document.getElementById("text").style.display = "block";
		gameOver = true;
		clearTimeout(tck);
		return;
	}

	currentlevel = n;
	p = new Player(levels[n][2]["spawn"][0], levels[n][2]["spawn"][1]);
	active = 0;

	titleTimer = TITLETIME;

	keys = [];
	doors = [];

	if (levels[currentlevel][2]["keys"] === undefined || levels[currentlevel][2]["doors"] === undefined) return;

	for (var i = 0; i < levels[currentlevel][2]["keys"].length; i++) {
		// picked up number, pickupanimation, openanimation
		keys[i] = [0, 0, 0];
	}

	for (var i = 0; i < levels[currentlevel][2]["doors"].length; i++) {
		// closed, openanimation
		doors[i] = [true, 0];
	}

	haveKeys = 0;
}

function resetGame() {
	c = new Camera(0, 0);

	loadLevel(0);
}

// =========================================

function n(x) {
	if (x == 0) return 1;
	return 0;
}

// params: level, world, x, y
function getTile(l, w, x, y) {
	if (l >= levels.length) return 1;
	if (w >= levels[l].length) return 1;
	if (y >= levels[l][w].length || y < 0) return 1;
	if (x >= levels[l][w][y].length || x < 0) return 1;

	return levels[l][w][y][x];
}

var DIPLENGTH = 20;
var dipState = 0;

function targetReached() {
	// DIP TO BLAAACK!!!!!
	if (dipState > 0) return;
	console.log("Target reached");
	dipState = DIPLENGTH;
}

var haveKeys;
function pickupKey(n) {
	haveKeys++;
	keys[n][0] = haveKeys;
	keys[n][1] = PICKUPANIM;
}

function openDoor(n) {
	console.log("Door: "+ n);
	var i = 0;
	while (keys[i][0] != haveKeys || keys[i][2] != 0) {
		i++;
	}

	keys[i][2] = 1;

	doors[n] = [false, 1];

	for (var i = 1; i < levels[currentlevel][2]["doors"][n].length; i++) {
		levels[currentlevel][0][levels[currentlevel][2]["doors"][n][i][1]][levels[currentlevel][2]["doors"][n][i][0]] = 0;
		levels[currentlevel][1][levels[currentlevel][2]["doors"][n][i][1]][levels[currentlevel][2]["doors"][n][i][0]] = 0;
	}

	haveKeys--;
}

// =========================================

var MAX_VEL = 12;
var FRICTION = 0.6;
var WALLBOUNCE = 0.5;
var ACCEL = 3;

var TILESIZE = 32;
var EXITSIZE = 64;
var KEYSIZE = 40;

function game() {
	tck = setTimeout(game, 20);
	if (loaded < img.length) return;
	tick();
	if (gameOver) return;
	render();
}

var SWAPLENGTH = 10;
var SWAPAFTER = 7;

var swapAnimation = 0;
var swapBack = 0;

function swap() {
	if (swapBack > 1) return;
	active = n(active);
	swapAnimation = SWAPLENGTH;
	//console.log("Active: "+ active);
	if (getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE/2)/TILESIZE), Math.floor((p.y + PLAYERSIZE/2 )/TILESIZE)) == 1 ||
		getTile(currentlevel, active, Math.floor((p.x				)/TILESIZE), Math.floor((p.y				)/TILESIZE)) == 1 ||
		getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE  )/TILESIZE), Math.floor((p.y				)/TILESIZE)) == 1 ||
		getTile(currentlevel, active, Math.floor((p.x				)/TILESIZE), Math.floor((p.y + PLAYERSIZE   )/TILESIZE)) == 1 ||
		getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE  )/TILESIZE), Math.floor((p.y + PLAYERSIZE   )/TILESIZE)) == 1) {
			swapBack = SWAPAFTER;
			swapAnimation = SWAPLENGTH/2;
			p.vx = 0;
			p.vy = 0;
	}
}

function tick() {
	// SWAP FAIL
	if (swapBack > 1) {
		swapBack--;
		return;
	} else if (swapBack == 1) {
		swap();
		swapBack = 0;
	}

	// CAMERA CONTROLS
	c.x = p.x - ctx.canvas.width/2;
	c.y = p.y - ctx.canvas.height/2;

	if (c.x < 0)
		c.x = 0;
	if (c.x > levels[currentlevel][active][0].length * TILESIZE - ctx.canvas.width)
		c.x = levels[currentlevel][active][0].length * TILESIZE - ctx.canvas.width;

	if (c.y < 0)
		c.y = 0;
	if (c.y > levels[currentlevel][active].length * TILESIZE - ctx.canvas.height)
		c.y = levels[currentlevel][active].length * TILESIZE - ctx.canvas.height;

	// DIP TO BLACK ANIMATION
	if (dipState > 0) {
		if (dipState == Math.floor(DIPLENGTH/2)) loadLevel(currentlevel+1);
		dipState--;
		return;
	}

	// MOVEMENT
	p.vx = p.vx * FRICTION;
	p.vy = p.vy * FRICTION;

	if (right) p.vx += ACCEL;
	if (left)  p.vx -= ACCEL;

	if (down) p.vy += ACCEL;
	if (up) p.vy -= ACCEL;

	if (p.vy > MAX_VEL)  p.vy =  MAX_VEL;
	if (p.vy < -MAX_VEL) p.vy = -MAX_VEL;

	if (p.vx > MAX_VEL)  p.vx =  MAX_VEL;
	if (p.vx < -MAX_VEL) p.vx = -MAX_VEL;

	if (p.vx > 0) {
		if (getTile(currentlevel, active, Math.floor((p.x + p.vx + PLAYERSIZE)/TILESIZE), Math.floor((p.y)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + p.vx + PLAYERSIZE)/TILESIZE), Math.floor((p.y + PLAYERSIZE/2)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + p.vx + PLAYERSIZE)/TILESIZE), Math.floor((p.y + PLAYERSIZE)/TILESIZE)) == 1) {
				p.x += TILESIZE * Math.ceil((p.x + PLAYERSIZE)/TILESIZE) - (p.x + PLAYERSIZE) - 1;
				p.vx = -p.vx*WALLBOUNCE;
				p.vx = 0;
		} else {
			p.x += p.vx;
		}
	} else if (p.vx < 0) {
		if (getTile(currentlevel, active, Math.floor((p.x + p.vx)/TILESIZE), Math.floor((p.y)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + p.vx)/TILESIZE), Math.floor((p.y+PLAYERSIZE/2)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + p.vx)/TILESIZE), Math.floor((p.y+PLAYERSIZE)/TILESIZE)) == 1) {
				p.x = TILESIZE * Math.floor(p.x/TILESIZE);
				p.vx = -p.vx*WALLBOUNCE;
				p.vx = 0;
		} else {
			p.x += p.vx;
		}
	}

	if (p.vy > 0) {
		if (getTile(currentlevel, active, Math.floor((p.x)/TILESIZE), Math.floor((p.y + p.vy + PLAYERSIZE)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE/2) /TILESIZE), Math.floor((p.y + p.vy + PLAYERSIZE)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE)/TILESIZE), Math.floor((p.y + p.vy + PLAYERSIZE)/TILESIZE)) == 1) {
				p.y += TILESIZE * Math.ceil((p.y + PLAYERSIZE)/TILESIZE) - (p.y + PLAYERSIZE) - 1;
				p.vy = -p.vy*WALLBOUNCE;
				p.vy = 0;
		} else {
			p.y += p.vy;
		}
	} else if (p.vy < 0) {
		if (getTile(currentlevel, active, Math.floor((p.x)/TILESIZE), Math.floor((p.y + p.vy)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE/2)/TILESIZE), Math.floor((p.y + p.vy)/TILESIZE)) == 1 ||
			getTile(currentlevel, active, Math.floor((p.x + PLAYERSIZE)/TILESIZE), Math.floor((p.y + p.vy)/TILESIZE)) == 1) {
				p.y = TILESIZE * Math.floor(p.y/TILESIZE);
				p.vy = -p.vy*WALLBOUNCE;
				p.vy = 0;
		} else {
			p.y += p.vy;
		}
	}

	// EXIT DETECTION
	if (p.x + PLAYERSIZE/2 > levels[currentlevel][2]["exit"][0]	&&
		p.x + PLAYERSIZE/2 < levels[currentlevel][2]["exit"][0] + EXITSIZE &&
		p.y + PLAYERSIZE/2 > levels[currentlevel][2]["exit"][1] &&
		p.y + PLAYERSIZE/2 < levels[currentlevel][2]["exit"][1] + EXITSIZE)
			targetReached();

	// KEY PICKUP
	for (var i = 0; i < keys.length; i++) {
		if (!keys[i][0] &&
			active == levels[currentlevel][2]["keys"][i][2] &&
			p.x + PLAYERSIZE/2 > levels[currentlevel][2]["keys"][i][0] - KEYSIZE/2	&&
			p.x + PLAYERSIZE/2 < levels[currentlevel][2]["keys"][i][0] + KEYSIZE/2 &&
			p.y + PLAYERSIZE/2 > levels[currentlevel][2]["keys"][i][1] - KEYSIZE/2 &&
			p.y + PLAYERSIZE/2 < levels[currentlevel][2]["keys"][i][1] + KEYSIZE/2)
				pickupKey(i);
	}

	// DOOR UNLOCK

	for (var i = 0; i < doors.length; i++) {
		if (haveKeys &&
			doors[i][0] &&
			Math.sqrt(Math.pow(p.x + PLAYERSIZE/2 - levels[currentlevel][2]["doors"][i][0][0], 2) + Math.pow(p.y + PLAYERSIZE/2 - levels[currentlevel][2]["doors"][i][0][1], 2)) < 60)
				openDoor(i);
	}

	// EXIT ANIMATION
	if (animPhase == 59) {
		animPhase = 0;
	} else {
		animPhase++;
	}

	// SWAP ANIMATION
	if (swapAnimation > 0) {
		swapAnimation--;
	}
}

// params and retun as RGB color array
function colorFade(color1, color2, active, current, total) {
	if (active) {
		var colortmp = color1;
		color1 = color2;
		color2 = colortmp;
	}
	return [
		Math.round(color1[0] + (color2[0] - color1[0])*(total-current)/total),
		Math.round(color1[1] + (color2[1] - color1[1])*(total-current)/total),
		Math.round(color1[2] + (color2[2] - color1[2])*(total-current)/total)
	];
}

function color2text(color, alpha) {
	return "rgba("+color[0]+", "+color[1]+", "+color[2]+", "+alpha+")";
}

var animPhase = 0;

var KEYPOS = [60, 445];
var KEYDIST = 50;

var LOCKSIZE = 40;

function render() {
	// clear canvas
	ctx.canvas.width = ctx.canvas.width;

	// fill background
	ctx.fillStyle = color2text(colorFade([145, 75, 58], [101, 162, 173], active, swapAnimation, SWAPLENGTH), 1);
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// render background world
	ctx.fillStyle = color2text(colorFade([56, 14, 5], [0, 86, 117], active, swapAnimation, SWAPLENGTH), 1);
	for (var j = Math.floor(c.y/TILESIZE); j < Math.ceil((c.y + ctx.canvas.height)/TILESIZE); j++) {
		for (var i = Math.floor(c.x/TILESIZE); i < Math.ceil((c.x + ctx.canvas.width)/TILESIZE); i++) {
			if (getTile(currentlevel, n(active), i, j)) ctx.fillRect(- c.x + TILESIZE * i - 2 - 0.5, - c.y + TILESIZE * j - 2 - 0.5, TILESIZE + 5, TILESIZE + 5);
		}
	}

	// render foreground world
	ctx.fillStyle = color2text(colorFade([255, 83, 48], [48, 221, 255], active, swapAnimation, SWAPLENGTH), 1);
	for (var j = Math.floor(c.y/TILESIZE); j < Math.ceil((c.y + ctx.canvas.height)/TILESIZE); j++) {
		for (var i = Math.floor(c.x/TILESIZE); i < Math.ceil((c.x + ctx.canvas.width)/TILESIZE); i++) {
			if (getTile(currentlevel, active, i, j)) ctx.fillRect(- c.x + TILESIZE * i - 0.5, - c.y + TILESIZE * j  - 0.5, TILESIZE + 1, TILESIZE + 1);
		}
	}

	// EXIT
	ctx.globalAlpha = (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
	ctx.drawImage(img["exit_" + active + "_" + animPhase], - c.x + levels[currentlevel][2]["exit"][0], - c.y + levels[currentlevel][2]["exit"][1]);
	ctx.globalAlpha = 1 - (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
	ctx.drawImage(img["exit_" + n(active) + "_" + animPhase], - c.x + levels[currentlevel][2]["exit"][0], - c.y + levels[currentlevel][2]["exit"][1]);

	// KEYS AND LOCKS
	for (var i = 0; i < keys.length; i++) {
		var keyp = [];
		var keysize;
		if (keys[i][0]) {
			keyp[0] = levels[currentlevel][2]["keys"][i][0] + (c.x + KEYPOS[0] + (keys[i][0] - 1) * KEYDIST - levels[currentlevel][2]["keys"][i][0])*(PICKUPANIM - keys[i][1])/PICKUPANIM;
			keyp[1] = levels[currentlevel][2]["keys"][i][1] + (c.y + KEYPOS[1] - levels[currentlevel][2]["keys"][i][1])*(PICKUPANIM - keys[i][1])/PICKUPANIM;
			keysize = 2 * KEYSIZE - Math.abs(PICKUPANIM/2 - keys[i][1])/PICKUPANIM*2*KEYSIZE;
			if (keys[i][1] > 0) keys[i][1]--;
		} else {
			keyp[0] = levels[currentlevel][2]["keys"][i][0];
			keyp[1] = levels[currentlevel][2]["keys"][i][1];
			keysize = 40;
		}

		keysize *= 2 - (OPENANIM - keys[i][2])/OPENANIM

		ctx.globalAlpha = (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
		ctx.globalAlpha *= (OPENANIM - keys[i][2])/OPENANIM;

		ctx.drawImage(img["key_" + (keys[i][0] ? active : levels[currentlevel][2]["keys"][i][2]) + "_" + active],
			- c.x + keyp[0] - keysize/2, - c.y + keyp[1] - keysize/2, keysize, keysize);
		ctx.globalAlpha = 1 - (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
		ctx.globalAlpha *= (OPENANIM - keys[i][2])/OPENANIM;
		ctx.drawImage(img["key_" + (keys[i][0] ? active : levels[currentlevel][2]["keys"][i][2]) + "_" + n(active)],
			- c.x + keyp[0] - keysize/2, - c.y + keyp[1] - keysize/2, keysize, keysize);

		if (keys[i][2] > 0 && keys[i][2] < OPENANIM) keys[i][2]++;

		if (debug) {
			ctx.fillStyle = "#F0F";
			ctx.fillRect(- c.x + keyp[0], - c.y + keyp[1], 4, 4);
		}
	}

	for (var i = 0; i < doors.length; i++) {
		
		ctx.globalAlpha = (OPENANIM - doors[i][1])/OPENANIM;

		for (var j = 1; j < levels[currentlevel][2]["doors"][i].length; j++) {
			ctx.drawImage(img["ward"], - c.x + levels[currentlevel][2]["doors"][i][j][0] * 32, - c.y + levels[currentlevel][2]["doors"][i][j][1] * 32, 32, 32);
		}

		var locksize = LOCKSIZE * (2 - (OPENANIM - doors[i][1])/OPENANIM);

		ctx.globalAlpha = (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
		ctx.globalAlpha *= (OPENANIM - doors[i][1])/OPENANIM;
		ctx.drawImage(img["lock" + active],
			- c.x + levels[currentlevel][2]["doors"][i][0][0] - locksize/2, - c.y + levels[currentlevel][2]["doors"][i][0][1] - locksize/2, locksize, locksize);
		ctx.globalAlpha = 1 - (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
		ctx.globalAlpha *= (OPENANIM - doors[i][1])/OPENANIM;
		ctx.drawImage(img["lock" + n(active)],
			- c.x + levels[currentlevel][2]["doors"][i][0][0] - locksize/2, - c.y + levels[currentlevel][2]["doors"][i][0][1] - locksize/2, locksize, locksize);

		if (doors[i][1] > 0 && doors[i][1] < OPENANIM) doors[i][1]++;
	}

	// PLAYER
	ctx.globalAlpha = (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
	ctx.drawImage(img["p" + active], - c.x + p.x, - c.y + p.y);
	ctx.globalAlpha = 1 - (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
	ctx.drawImage(img["p" + n(active)], - c.x + p.x, - c.y + p.y);

	// TITLE
	ctx.font = "bold 25px Courier New";
	ctx.globalAlpha = (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
	if (titleTimer < TITLEFADE) ctx.globalAlpha *= titleTimer/TITLEFADE;
	ctx.fillStyle = (active ? "rgb(56, 14, 5)" : "rgb(0, 86, 117)");
	ctx.fillText(levels[currentlevel][2]["title"], (ctx.canvas.width - ctx.measureText(levels[currentlevel][2]["title"]).width)/2, 471);
	ctx.globalAlpha = 1 - (SWAPLENGTH-swapAnimation)/SWAPLENGTH;
	if (titleTimer < TITLEFADE) ctx.globalAlpha *= titleTimer/TITLEFADE;
	ctx.fillStyle = (n(active) ? "rgb(56, 14, 5)" : "rgb(0, 86, 117)");
	ctx.fillText(levels[currentlevel][2]["title"], (ctx.canvas.width - ctx.measureText(levels[currentlevel][2]["title"]).width)/2, 471);

	if (titleTimer > 0) titleTimer--;

	ctx.globalAlpha = 1;

	// DEBUG
	if (debug) {
		ctx.fillStyle = "#F0F";
		ctx.fillRect(- c.x + p.x, - c.y + p.y, 4, 4);
		ctx.fillRect(- c.x + levels[currentlevel][2]["exit"][0], - c.y + levels[currentlevel][2]["exit"][1], 4, 4);

		ctx.fillStyle = "#333";
		for (var i = Math.floor(c.x/TILESIZE); i < Math.ceil((c.x + ctx.canvas.width)/TILESIZE); i++) {
			ctx.fillRect(- c.x + TILESIZE * i, 0, 1, ctx.canvas.height);
		}

		for (var i = Math.floor(c.y/TILESIZE); i < Math.ceil((c.y + ctx.canvas.height)/TILESIZE); i++) {
			ctx.fillRect(0, - c.y + TILESIZE * i, ctx.canvas.width, 1);
		}

		ctx.font = "bold 20px Courier New";
		ctx.fillText("X " + Math.floor(p.x*100)/100 + " | Y " + Math.floor(p.y*100)/100, 42, 25);
		ctx.fillText("X " + Math.floor(p.x/TILESIZE)+ " | Y " + Math.floor(p.y/TILESIZE) , 42, 57);
	}

	// FADE
	if (dipState > 0) {
		ctx.fillStyle = "rgba(0, 0, 0, " + (1 - Math.abs(DIPLENGTH/2 - dipState) / DIPLENGTH * 2) + ")";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}
}

// ==========================================

var PLAYERSIZE = 40;
function Player(x, y) {
	this.x = x;
	this.y = y;

	this.vx = 0;
	this.vy = 0;
}

function Camera(x, y) {
	this.x = x;
	this.y = y;
}

// ==========================================

function keyDn(e) {
	//console.log(e.keyCode);
	switch (e.keyCode) {
		case 87:	up = true;
					break;
		case 65:	left = true;
					break;
		case 83:	down = true;
					break;
		case 68:	right = true;
					break;
		case 32:	swap();
					break;
		case 80:	debug = !debug;
	}
}

function keyUp(e) {
	switch (e.keyCode) {
		case 87:	up = false;
					break;
		case 65:	left = false;
					break;
		case 83:	down = false;
					break;
		case 68:	right = false;
					break;
	}
}