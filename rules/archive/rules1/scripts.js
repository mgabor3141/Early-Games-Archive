window.addEventListener("load", initialise, false);

var canvas;
var ctx;
var bctx;
var imgl = new Array();

var currenttile;

var map;

var speed = 5;
var gravity = 0.7;

var gravityvel = 0;

var posx = 80;
var posy = 440;
var look = "r";

function initialise() {
	canvas = document.getElementById('canvas');
	if (!canvas.getContext) {
		alert("Too old browser!");
		return;
	}
	ctx = canvas.getContext('2d');
	bctx = document.getElementById('background').getContext('2d');

	up = false;
	left = false;
	right = false;

	var currenttile = 0;

	loadImages();
	drawbg();
	game();
}

function loadImages() {
	var img = [
		"b_idle","t_idle"
	];
	for (var i = 0; i < img.length; i++) {
		imgl[img[i]] = new Image();
		imgl[img[i]].src = "img/"+img[i]+".png";
	}
}

function drawbg() {
	bctx.clearRect(0, 0, 720, 480);
	bctx.fillStyle = "#000";
	for (i = currenttile*18; i <= (currenttile+1)*18; i++) {
		for (j = 0; j < map.length; j++) {
			if (map[j][i] != 0) bctx.fillRect(40*(i-currenttile*18)-20, 40*j, 40, 40);
		}
	}
}

function game() {
	tick();
	render();
	var next = setTimeout("game()",15);
}

function tick() {
	gravityvel += gravity;
	try {
		if (map[Math.floor((posy + gravityvel)/40)][Math.floor((posx+19)/40)] == 0 && map[Math.floor((posy + gravityvel)/40)][Math.floor((posx-20)/40)] == 0 && //alsó sarkok
			map[Math.floor((posy + gravityvel - 69)/40)][Math.floor((posx+19)/40)] == 0 && map[Math.floor((posy + gravityvel - 69)/40)][Math.floor((posx-20)/40)] == 0) { // felsõ sarkok
			posy += gravityvel;
		} else {
			if (gravityvel >= 0) posy = (Math.floor((posy + gravityvel)/40)*40);
			if (up) {
				gravityvel = -11.5;
				up = false;
			} else {
				gravityvel = 0;
			}
		}
	}
	catch (e) {
		posy += gravityvel;
	}

	try {
			if (right && map[Math.floor((posy-1)/40)][Math.floor((posx+speed+19)/40)] == 0 && map[Math.floor((posy-1)/40)-1][Math.floor((posx+speed+19)/40)] == 0 && map[Math.floor((posy-69)/40)][Math.floor((posx+speed+19)/40)] == 0) posx += speed;
	} catch (e) {
		try {
			if (right && map[Math.floor((posy-1)/40)][Math.floor((posx+speed+19)/40)] == 0 && map[Math.floor((posy-1)/40)-1][Math.floor((posx+speed+19)/40)] == 0) posx += speed;
		} catch (e) {
			if (right && map[Math.floor((posy-1)/40)][Math.floor((posx+speed+19)/40)] == 0) posx += speed;
		}
	}
	try {
			if (left && map[Math.floor((posy-1)/40)][Math.floor((posx-speed-20)/40)] == 0 && map[Math.floor((posy-1)/40)-1][Math.floor((posx-speed-20)/40)] == 0 && map[Math.floor((posy-69)/40)][Math.floor((posx-speed-20)/40)] == 0) posx -= speed;
	} catch (e) {
		try {
			if (left && map[Math.floor((posy-1)/40)][Math.floor((posx-speed-20)/40)] == 0 && map[Math.floor((posy-1)/40)-1][Math.floor((posx-speed-20)/40)] == 0) posx -= speed;
		} catch (e) {
			if (left && map[Math.floor((posy-1)/40)][Math.floor((posx-speed-20)/40)] == 0) posx -= speed;
		}
	}
	if (Math.floor(posx/(40*18)) != currenttile) {
		currenttile = Math.floor(posx/(40*18));
		drawbg();
	}
}

function render() {
	ctx.clearRect(0, 0, 720, 480);

/* 	ctx.fillStyle = "#00F";
	ctx.fillRect(posx-20-currenttile*18*40-20, posy-70, 40, 70);
	ctx.fillStyle = "#F00";
	ctx.fillRect(posx-1-currenttile*18*40-20, posy-1, 2, 2); */

	ctx.drawImage(imgl["t_idle"],posx-20-currenttile*18*40-20,posy-70);
	ctx.drawImage(imgl["b_idle"],posx-20-currenttile*18*40-20,posy-35);
}

var up = false;
var left = false;
var right = false;

function bill(e) {
	switch(e.keyCode) {
		case (38): 	up = true;
					break;
		case (40):	break;
		case (37):	left = true;
					break;
		case (39):	right = true;
	}
}
function billfel(e) {
	switch(e.keyCode) {
		case (38): 	up = false;
					break;
		case (40):	break;
		case (37):	left = false;
					break;
		case (39):	right = false;
	}
}