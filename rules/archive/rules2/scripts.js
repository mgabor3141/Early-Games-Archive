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

var posx = 160;
var posy = 440;

var checkpoint = [160,440];

var look = "r";

var up = false;
var left = false;
var goleft = false;
var right = false;
var goright = false;
var space = false;

var run = 0;
var fall = 0;

var buttons = new Array;
var scripts = new Array;
var scriptfunctions = new Array;

function initialise() {
	canvas = document.getElementById('canvas');
	if (!canvas.getContext) {
		alert("Too old browser!");
		return;
	}
	ctx = canvas.getContext('2d');
	bctx = document.getElementById('background').getContext('2d');

	var currenttile = 0;	

	loadImages();
	drawbg();
	game();
}

function loadImages() {
	var img = [
		"b_idle",
		"t_idle_r",
		"t_idle_l",
		"b_running_r1",
		"b_running_r2",
		"b_running_r3",
		"b_running_r4",
		"b_running_r5",
		"b_running_r6",
		"b_running_r7",
		"b_running_r8",
		"b_running_r9",
		"b_running_r10",
		"b_running_r11",
		"b_running_r12",
		"b_running_r13",
		"b_running_r14",
		"b_running_l1",
		"b_running_l2",
		"b_running_l3",
		"b_running_l4",
		"b_running_l5",
		"b_running_l6",
		"b_running_l7",
		"b_running_l8",
		"b_running_l9",
		"b_running_l10",
		"b_running_l11",
		"b_running_l12",
		"b_running_l13",
		"b_running_l14",
		"b_falling_r1",
		"b_falling_l1"
	];
	ctx.font="24pt Helvetica";
	for (i = 0; i < img.length; i++) {
		imgl[img[i]] = new Image();
		imgl[img[i]].src = "img/"+img[i]+".png";
		ctx.clearRect(0, 0, 720, 480);
		ctx.fillText("Loading images... "+String(i*100/img.length).slice(0,2)+"%", 50, 200);
	}
}

function drawbg() {
	bctx.clearRect(0, 0, 720, 480);
	for (i = currenttile*18; i <= (currenttile+1)*18; i++) {
		for (j = 0; j < map.length; j++) {
			bctx.fillStyle = "#000";
			if (map[j][i] != 0 && map[j][i] != 3) bctx.fillRect(40*(i-currenttile*18)-20, 40*j, 40, 40);
			bctx.fillStyle = "#3FF";
			if (map[j][i] == 2) bctx.fillRect(40*(i-currenttile*18)-20, 40*j, 40, 3);
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
			fall = 1;
		} else if (map[Math.floor((posy + gravityvel)/40)][Math.floor((posx+19)/40)] == 2 && map[Math.floor((posy + gravityvel)/40)][Math.floor((posx-20)/40)] == 2) {
			if (!left) goleft = false;
			if (!right) goright = false;
			fall = 0;
			posx = checkpoint[0];
			posy = checkpoint[1];
			drawbg();
		} else {
			goleft = left;
			goright = right;
			fall = 0;
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

	if (goright && map[Math.floor((posy-1)/40)][Math.floor((posx+speed+19)/40)] == 0 && map[Math.floor((posy-1)/40)-1][Math.floor((posx+speed+19)/40)] == 0 && map[Math.floor((posy-69)/40)][Math.floor((posx+speed+19)/40)] == 0) {
		goleft = false;
		posx += speed;
		look = "r";
		if (run == 14) {
			run = (fall==1) ? 0 : 1;
		} else {
			run = (fall==1) ? 0 : run+1;
		}
	} else if (goright) {
		goleft = false;
		if (!right) goright = false;
		run = 0;
		look = "r";
	} else if (goleft && map[Math.floor((posy-1)/40)][Math.floor((posx-speed-20)/40)] == 0 && map[Math.floor((posy-1)/40)-1][Math.floor((posx-speed-20)/40)] == 0 && map[Math.floor((posy-69)/40)][Math.floor((posx-speed-20)/40)] == 0) {
		goright = false;
		posx -= speed;
		look = "l";
		if (run == 14) {
			run = (fall==1) ? 0 : 1;
		} else {
			run = (fall==1) ? 0 : run+1;
		}
	} else if (goleft) {
		goright = false;
		if (!left) goleft = false;
		run = 0;
		look = "l";
	} else {
		run = 0;
	}

	if (space) {
		buttonFind = false;
		i = 0;
		for (i = 0; (i < buttons.length && buttonFind == false); i++) {
			if (buttons[i].x == Math.floor(posx/40) && buttons[i].y == Math.floor((posy-1)/40)-1) {
				buttonFind = true;
				scripts[i].run();
			}
		}
		if (!buttonFind) {
			//alert("attack");
		}
		space = false;
	}

	for (i = 0; i < scripts.length; i++) {
		if (scripts[i].state) scripts[i].tick();
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

	for (i = 0; i < buttons.length; i++) {
		if (buttons[i].state) {
			ctx.fillStyle = "#0A0";
		} else {
			ctx.fillStyle = "#A00";
		}
		ctx.fillRect(buttons[i].x*40-currenttile*18*40-20, buttons[i].y*40, 40, 40);
	}

	ctx.drawImage(imgl["t_idle_"+look],posx-20-currenttile*18*40-20,posy-70);
	if (run != 0) {
		ctx.drawImage(imgl["b_running_"+look+run],posx-20-currenttile*18*40-20,posy-35);
	} else if (fall != 0) {
		ctx.drawImage(imgl["b_falling_"+look+fall],posx-20-currenttile*18*40-20,posy-35);
	} else {
		ctx.drawImage(imgl["b_idle"],posx-20-currenttile*18*40-20,posy-35);
	}

	for (i = 0; i < scripts.length; i++) {
		if (scripts[i].state) scripts[i].render();
	}
}

function Button(x,y,state) {
	this.x = x;
	this.y = y;
	this.state = state;
	this.toggle = function () {
		this.state = !this.state;
	}
}

function Script() {
	this.state = false;
	this.t = 0;
	this.run = function () { this.state = true; }
	this.stop = function () { this.state = false; }
	this.tick = function () {}
	this.render = function () {}
}

function bill(e) {
	switch(e.keyCode) {
		case (38): 	up = true;
					break;
		case (32):	space = true;
					break;
		case (37):	left = true;
					goleft = true;
					break;
		case (39):	right = true;
					goright = true;
	}
}
function billfel(e) {
	switch(e.keyCode) {
		case (38): 	up = false;
					break;
		case (37):	left = false;
					break;
		case (39):	right = false;
	}
}