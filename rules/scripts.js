window.addEventListener("load", initialise, false);

var canvas;
var ctx;
var bctx;
var imgl = new Array();

var currenttile;

var map;

var speed = 5;
var gravity = 0.7;

var timescale = 1;
var zoomscale = 1;
var targetzoomscale = 1;
var translatex = 0;
var targettranslatex = 0;
var translatey = 0;
var targettranslatey = 0;

var gravityvel = 0;

var posx = 160;
var posy = 440;

var checkpoint = [160,440];
//var checkpoint = [2260,280];

var look = "r";

var up = false;
var down = false;
var left = false;
var goleft = false;
var right = false;
var goright = false;
var space = false;

var noclip = false;

var invis = false;
var dead = 0;

var benchmark = false;

var run = 0;
var fall = 0;

var buttons = new Array;var scripts = new Array;
var scriptfunctions = new Array;
var particles = new Array;

var gore = true;
var colors = ["#F00","#0F0","#00F","#FF0","#F0F","#0FF",];

function initialise() {
	canvas = document.getElementById('canvas');
	if (!canvas.getContext) {
		alert("Too old browser!");
		return;
	}
	ctx = canvas.getContext('2d');
	bctx = document.getElementById('background').getContext('2d');

	ctx.font="bold 12pt Courier New";

	ctx.save();
	bctx.save();

	var currenttile = 0;

	loadImages();
	drawbg();
	game();
}

function autoCheckpoint() { }

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
	for (i = 0; i < img.length; i++) {
		imgl[img[i]] = new Image();
		imgl[img[i]].src = "img/"+img[i]+".png";
		//ctx.clearRect(0, 0, 720, 480);
		//ctx.fillText("Loading images... "+String(i*100/img.length).slice(0,2)+"%", 50, 200);
	}
}

function drawbg() {
	bctx.clearRect(0, 0, 720, 480);
	for (i = currenttile*18; i <= (currenttile+1)*18; i++) {
		tmpsize = (zoomscale == 1)?40:41;
		for (j = 0; j < map.length; j++) {
			bctx.fillStyle = "#000";
			if (map[j][i] != 0 && map[j][i] != 3 && map[j][i] != 2) bctx.fillRect(40*(i-currenttile*18)-20, 40*j, tmpsize, tmpsize);
			//if (map[j][i] == 2) bctx.fillRect(40*(i-currenttile*18)-20, 40*j, tmpsize, 3);
			if (map[j][i] == 2) {				bctx.fillRect(40*(i-currenttile*18)-20, 40*j+tmpsize/2, tmpsize, tmpsize/2);				bctx.fillStyle = "#333";				bctx.beginPath();				bctx.lineTo(40*(i-currenttile*18)-20, 40*j+tmpsize/2);				bctx.lineTo(40*(i-currenttile*18), 40*j);				bctx.lineTo(40*(i-currenttile*18)+20, 40*j+tmpsize/2);				bctx.closePath();				bctx.fill();			}
		}
	}
}

function game() {
	var next = setTimeout("game()",15);
	tick();
	render();
}

function tick() {
	if (Math.round(posx/5) != posx/5 && timescale == 1) posx += (Math.round(posx/5)-posx/5)*5;

	if (dead > 0) {
		if (dead == 1) {
			invis = false;
		} else if (dead == 14) {
			posx = checkpoint[0];
			posy = checkpoint[1];
			respawnEffect(posx,posy);
		}
		dead--;
	}

	if (!invis && !noclip) {
		gravityvel += gravity/timescale;
		try {
			if (map[Math.floor((posy + gravityvel)/40)][Math.floor((posx+19)/40)] == 0 && map[Math.floor((posy + gravityvel)/40)][Math.floor((posx-20)/40)] == 0 && //alsó sarkok
				map[Math.floor((posy + gravityvel - 69)/40)][Math.floor((posx+19)/40)] == 0 && map[Math.floor((posy + gravityvel - 69)/40)][Math.floor((posx-20)/40)] == 0) { // felsõ sarkok
				posy += gravityvel/timescale;
				fall = 1;
			} else if (map[Math.floor((posy + gravityvel)/40)][Math.floor((posx+19)/40)] == 2 && map[Math.floor((posy + gravityvel)/40)][Math.floor((posx-20)/40)] == 2) {
				if (!left) goleft = false;
				if (!right) goright = false;
				fall = 0;
				spawnBlood(posx, posy-30, gravityvel);
				dead = 80;
				invis = true;
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
			posx += speed/timescale;
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
			posx -= speed/timescale;
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
	}

	if (noclip) {
		if (right) posx += 5;
		if (left) posx -= 5;
		if (up) posy -= 5;
		if (down) posy += 5;
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
		autoCheckpoint(currenttile);
		drawbg();
	}	for (i in particles) {		particles[i].l--;		if (particles[i].l == 0) {			particles.splice(i,1);			continue;		}		if (particles[i].stuck) continue;		particles[i].vx += particles[i].ax;
		particles[i].vy += particles[i].ay;		particles[i].x += particles[i].vx;		particles[i].y += particles[i].vy;		
		if (particles[i].type == 0) {			if (map[Math.floor(particles[i].y/40)] !== undefined && map[Math.floor(particles[i].y/40)][Math.floor(particles[i].x/40)] == 1) particles[i].stick();			if (map[Math.floor(particles[i].y/40)] !== undefined && map[Math.floor(particles[i].y/40)][Math.floor(particles[i].x/40)] == 2 && particles[i].y%40 >= 20) particles[i].stick();
		} else if (particles[i].type == 1 && particles[i].l % 2 == 0) {
			var angle = Math.random()*Math.PI*2;
			particles[particles.length] = new Particle(particles[i].x, particles[i].y, Math.cos(angle)*1, Math.sin(angle)*1, 0, 0, 10, 7, 2, "#003", 2);
		}	}
}function spawnBlood(x,y,v) {	for (var i = 0; i <= 150; i++) {		var angle = Math.random()*Math.PI*2;		var size = 2+Math.random()*3+v*1.3;		particles[particles.length] = new Particle(x-10+Math.floor(Math.random()*21),y-10+Math.floor(Math.random()*21),Math.cos(angle)*size,Math.sin(angle)*size);
		if (!gore) particles[particles.length-1].color = colors[Math.floor(Math.random()*colors.length)];	}}

function respawnEffect(x,y) {
	particles[particles.length] = new Particle(x - 20, y - 60, 0, 0, 0.2, 0.2, 15, 5, 1, "#0F9");
	particles[particles.length] = new Particle(x + 20, y - 60, 0, 0, -0.2, 0.2, 15, 5, 1, "#0F9");
	particles[particles.length] = new Particle(x - 20, y - 20, 0, 0, 0.2, -0.2, 15, 5, 1, "#0F9");
	particles[particles.length] = new Particle(x + 20, y - 20, 0, 0, -0.2, -0.2, 15, 5, 1, "#0F9");
}
function Particle(x,y,vx,vy,ax,ay,l,f,t,color, size) {
	this.l = (typeof l === "undefined") ? 160 : l;	// lifetime
	this.f = (typeof f === "undefined") ? 80 : f;	// fade at
	this.x = x;	this.y = y;	this.vx = vx;	this.vy = vy;	this.ax = (typeof ax === "undefined") ? 0 : ax;
	this.ay = (typeof ay === "undefined") ? gravity : ay;
	this.color = (typeof color === "undefined") ? "#F00" : color;	this.stuck = false;	this.stick = function () {		this.stuck = true;	}
	this.type = (typeof t === "undefined") ? 0 : t;
	this.size = (typeof size === "undefined") ? 4 : size;}
function render() {
	ctx.clearRect(0, 0, 720, 480);

	if (zoomscale == 1) { ctx.restore(); bctx.restore(); }

	if (targettranslatex != translatex || targettranslatey != translatey) {
		tmptranslatex = (targettranslatex - translatex > 0)?20:((targettranslatex - translatex < 0)?-20:0);
		tmptranslatey = (targettranslatey - translatey > 0)?20:((targettranslatey - translatey < 0)?-20:0);
		ctx.translate(tmptranslatex,tmptranslatey);
		bctx.translate(tmptranslatex,tmptranslatey);
		translatex += tmptranslatex;
		translatey += tmptranslatey;
		drawbg();
	}

	if (targetzoomscale != zoomscale) {
		tmpscale = (targetzoomscale - zoomscale >= 1)?21/20:20/21;
		ctx.scale(tmpscale,tmpscale);
		bctx.scale(tmpscale,tmpscale);
		zoomscale += (targetzoomscale - zoomscale)/Math.abs(targetzoomscale - zoomscale);
		drawbg();
	}

/* 	ctx.fillStyle = "#00F"; // old character
	ctx.fillRect(posx-20-currenttile*18*40-20, posy-70, 40, 70); */

	for (i = 0; i < buttons.length; i++) {
		if (buttons[i].state) {
			ctx.fillStyle = "#0A0";
		} else {
			ctx.fillStyle = "#A00";
		}
		ctx.fillRect(buttons[i].x*40-currenttile*18*40-20, buttons[i].y*40, 40, 40);
	}

	if (!invis) {
		ctx.drawImage(imgl["t_idle_"+look],posx-20-currenttile*18*40-20,posy-70);
		if (run != 0) {
			ctx.drawImage(imgl["b_running_"+look+run],posx-20-currenttile*18*40-20,posy-35);
		} else if (fall != 0) {
			ctx.drawImage(imgl["b_falling_"+look+fall],posx-20-currenttile*18*40-20,posy-35);
		} else {
			ctx.drawImage(imgl["b_idle"],posx-20-currenttile*18*40-20,posy-35);
		}
	}

	ctx.fillStyle = "#000";
	for (i = 0; i < scripts.length; i++) {
		if (scripts[i].state) scripts[i].render();
	}

	for (i in particles) {		ctx.fillStyle = particles[i].color;		ctx.globalAlpha = particles[i].l/particles[i].f;		ctx.fillRect(particles[i].x-currenttile*18*40-20-particles[i].size/2,particles[i].y-particles[i].size/2,particles[i].size,particles[i].size);		ctx.globalAlpha = 1;	}

	ctx.fillStyle = "#888";
	if (benchmark >= 1) {
		ctx.fillText("x = ["+Math.floor(posx/40)+"] "+posx, 40, 40);
		ctx.fillText("y = ["+Math.floor((posy-1)/40)+"] "+posy, 40, 60);
		ctx.fillText("tile = "+currenttile, 40, 80);
		ctx.fillText("R"+run+((run <= 9)?" ":"")+" L"+look+"  A"+fall+"  I"+(invis?"1":"0"), 40, 100);

		if (left) ctx.fillText("<", 45, 120);
		if (goleft) ctx.fillText("<", 40, 120);
		if (right) ctx.fillText(">", 65, 120);
		if (goright) ctx.fillText(">", 70, 120);
	}
	if (benchmark == 2) {
		for (i = 1; i <= 14; i++) {
			ctx.fillRect(0,i*40,720,1);
		}
		for (i = 1; i <= 18; i++) {
			ctx.fillRect(i*40-20,0,1,480);		}
		
		ctx.fillStyle = "#F00";
		ctx.fillRect(posx-1-currenttile*18*40-20, posy-1, 2, 2); 	}
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
	console.log(e.keyCode);
	switch(e.keyCode) {
		case (38): 	up = true;
					e.preventDefault();
					break;
		case (32):	space = true;
					e.preventDefault();
					break;
		case (37):	left = true;
					goleft = true;
					e.preventDefault();
					break;
		case (39):	right = true;
					goright = true;
					e.preventDefault();
					break;
		case (40):	down = true;
					break;
		case (80):	gore = !gore;
					break;
		case (81):	if (benchmark < 2) { benchmark++ } else { benchmark = 0; }
					break;
		case (87):	noclip = !noclip;
					goleft = false;
					goright = false;
	}
}function billfel(e) {
	switch(e.keyCode) {
		case (38): 	up = false;
					break;
		case (37):	left = false;
					break;
		case (39):	right = false;
					break;
		case (40):	down = false;
	}
}