var map = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1],
	[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,1],
	[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,1,0,1,1,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,1,0,0,0,1,1,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,2,2,2,2,2,2,2,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,2,2,2,2,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,1,1,2,2,2,2,1,2,1,1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
/*										 |									 |									 |									 |									 |									 |									 |									 |									 |									 |									 |									 |
	0 = air				coordinates: 	x = (col-6)/2
	1 = wall							y = ln-2
	2 = death
	3 = invisible wall
	
*/

buttons[0] = new Button(28,2,false); // first door
scripts[0] = new Script();
scripts[0].tick = function () {
	if (scripts[0].t == 0) {
		buttons[0].toggle();
		map[5][18] = 3;
		map[6][18] = 3;
		drawbg();
	}
	scripts[0].t++;
	if (scripts[0].t == 40) {
		map[5][18] = 0;
		map[6][18] = 0;
		scripts[0].stop();
	}
}
scripts[0].render = function () {
	ctx.fillStyle = "#000";
	ctx.fillRect(40*(18-currenttile*18)-20, 40*5-scripts[0].t, 40, 40);
	ctx.fillRect(40*(18-currenttile*18)-20, 40*6+scripts[0].t, 40, 40);
}

buttons[1] = new Button(112,9,false); // hearts' door
scripts[1] = new Script();
scripts[1].tick = function () {
	if (scripts[1].t == 0) {
		buttons[1].toggle();
		map[10][125] = 3;
		map[9][125] = 3;
		map[10][126] = 3;
		map[9][126] = 3;
		drawbg();
	}
	scripts[1].t++;
	if (scripts[1].t == 80) {
		map[10][125] = 0;
		map[9][125] = 0;
		map[10][126] = 0;
		map[9][126] = 0;
		scripts[1].stop();
	}
}
scripts[1].render = function () {
	ctx.fillStyle = "#000";
	ctx.fillRect(40*(125-currenttile*18)-20, 40*9-scripts[1].t, 80, 80);
}

buttons[2] = new Button(53,8,false); // transform 1
scripts[2] = new Script();
scripts[2].tick = function () {
	if (scripts[2].t == 0) {
		buttons[2].toggle();
		map[8][51] = 3;
		map[8][50] = 3;
		map[9][51] = 3;
		map[5][50] = 0;
		map[6][51] = 0;
		map[5][51] = 0;
		map[10][47] = 0;
		map[10][48] = 0;
		map[10][49] = 0;
		map[9][49] = 3;
		map[10][43] = 0;
		map[10][44] = 0;
		map[10][45] = 0;
		drawbg();
	} else
	if (scripts[2].t == 20) {
		map[8][51] = 0;
		map[8][50] = 1;
		map[9][51] = 0;
		map[4][50] = 1;
		map[6][52] = 1;
		map[5][52] = 1;

		map[5][38] = 1;
		map[9][40] = 1;

		map[5][36] = 1;
		map[6][36] = 1;
		map[7][36] = 1;
		drawbg();
	} else
	if (scripts[2].t == 30) {
		map[8][50] = 3;
		map[7][50] = 3;
		map[6][52] = 0;
		map[5][52] = 0;
		drawbg();
	} else
	if (scripts[2].t == 50) {
		map[8][50] = 0;
		map[7][50] = 1;
		map[7][52] = 1;
		map[4][52] = 1;

		map[5][39] = 1;
		drawbg();
	} else
	if (scripts[2].t == 120) {
		map[7][47] = 1;
		map[7][48] = 1;
		map[7][49] = 1;
		map[9][49] = 0;
		map[7][43] = 1;
		map[7][44] = 1;
		map[7][45] = 1;
		drawbg();
		scripts[2].stop();
	}
	scripts[2].t++;
}
scripts[2].render = function () {
	ctx.fillStyle = "#000";
	if (scripts[2].t <= 20) {
		ctx.fillRect(40*(51-currenttile*18)-scripts[2].t*2-20, 40*8, 40, 40);
		ctx.fillRect(40*(51-currenttile*18)+scripts[2].t*2-20, 40*6, 40, 40);
		ctx.fillRect(40*(51-currenttile*18)+scripts[2].t*2-20, 40*5, 40, 40);
		ctx.fillRect(40*(51-currenttile*18)-20, 40*9+scripts[2].t*2, 40, 40);
		ctx.fillRect(40*(50-currenttile*18)-20, 40*5-scripts[2].t*2, 40, 40);

		ctx.fillRect(40*(38-currenttile*18)-20, 40*4+scripts[2].t*2, 40, 40);
		ctx.fillRect(40*(40-currenttile*18)-20, -40+scripts[2].t*20, 40, 40);

		ctx.fillRect(40*(35-currenttile*18)+scripts[2].t*2-20, 40*5, 40, 120);
	} else
	if (scripts[2].t <= 50 && scripts[2].t >= 30) {
		ctx.fillRect(40*(50-currenttile*18)-20, 40*8-scripts[2].t*2+60, 40, 40);
		ctx.fillRect(40*(52-currenttile*18)-20, 40*6+scripts[2].t*2-60, 40, 40);
		ctx.fillRect(40*(52-currenttile*18)-20, 40*5-scripts[2].t*2+60, 40, 40);

		ctx.fillRect(40*(38-currenttile*18)-20+scripts[2].t*2-60, 40*5, 40, 40);
	}

	if (scripts[2].t <= 120) {
		ctx.fillRect(40*(47-currenttile*18)-20, 40*10-scripts[2].t, 120, 40);
		ctx.fillRect(40*(43-currenttile*18)-20, 40*10-scripts[2].t, 120, 40);
	}
}

buttons[3] = new Button(37,0,false); // transform 2: the drop (dubstep, yaay!)
scripts[3] = new Script();
scripts[3].tick = function () {
	if (scripts[3].t == 0) {
		buttons[3].toggle();
		checkpoint = [2260,280];
		posx = 1500;
		map[4][37] = 0;
		map[8][37] = 0;
		drawbg();
	} else
	if (scripts[3].t == 10) {
		map[6][37] = 1;
		map[7][37] = 1;
		drawbg();
	} else
	if (scripts[3].t == 15) {
		map[6][37] = 0;
		map[7][37] = 0;
		map[9][37] = 0;
		map[10][37] = 0;
		drawbg();
	} else
	if (scripts[3].t == 20) {
		map[6][38] = 1;
		map[7][38] = 1;
		drawbg();
	} else
	if (scripts[3].t == 160) {
		map[9][38] = 3;
		map[10][38] = 3;
		map[10][39] = 0;
		drawbg();
	} else
	if (scripts[3].t == 200) {
		map[9][38] = 0;
		map[10][38] = 0;
		drawbg();
	} else
	if (scripts[3].t == 220) {
		map[5][53] = 3;
		map[5][54] = 3;
		map[6][53] = 3;
		map[6][54] = 3;
		drawbg();
	} else
	if (scripts[3].t == 260) {
		map[5][53] = 0;
		map[5][54] = 0;
		map[6][53] = 0;
		map[6][54] = 0;
		drawbg();
		scripts[3].stop();
	}
	scripts[3].t++;
}
scripts[3].render = function () {
	ctx.fillStyle = "#000";
	if (scripts[3].t <= 10) {
		ctx.fillRect(40*(37-currenttile*18)-20, 40*4+scripts[3].t*8, 40, 40);
		ctx.fillRect(40*(37-currenttile*18)-20, 40*8-scripts[3].t*4, 40, 40);
	} else
	if (scripts[3].t <= 20 && scripts[3].t >= 15) {
		ctx.fillRect(40*(37-currenttile*18)-20+scripts[3].t*8-120, 40*6, 40, 40);
		ctx.fillRect(40*(37-currenttile*18)-20+scripts[3].t*8-120, 40*7, 40, 40);
		ctx.fillRect(40*(37-currenttile*18)-20+scripts[3].t*8-120, 40*9, 40, 40);
		ctx.fillRect(40*(37-currenttile*18)-20+scripts[3].t*8-120, 40*10, 40, 40);
	} else
	if (scripts[3].t <= 200 && scripts[3].t >= 160) {
		ctx.fillRect(40*(38-currenttile*18)-20, 40*9-scripts[3].t+160, 40, 40);
		ctx.fillRect(40*(38-currenttile*18)-20, 40*10+scripts[3].t-160, 80, 40);
	} else
	if (scripts[3].t <= 260 && scripts[3].t >= 220) {
		ctx.fillRect(40*(53-currenttile*18)-20, 40*5-scripts[3].t+220, 80, 40);
		ctx.fillRect(40*(53-currenttile*18)-20, 40*6+scripts[3].t-220, 80, 40);
	}
}

buttons[4] = new Button(94,1,false); // leap of faith trigger
scripts[4] = new Script();
scripts[4].tick = function () {
	if (scripts[4].t == 0) {
		buttons[4].toggle();
		timescale = 10;
		targetzoomscale = 5;
		targettranslatex = -100;
		checkpoint = [3865,80];
	} else
	if (scripts[4].t == 20) {
		map[6][96] = 1;
		drawbg();
	} else
	if (scripts[4].t == 25) {
		map[6][97] = 1;
		drawbg();
	} else
	if (scripts[4].t == 30) {
		map[6][98] = 1;
		drawbg();
	} else
	if (scripts[4].t == 35) {
		map[5][98] = 1;
		drawbg();
	} else
	if (scripts[4].t == 40) {
		map[5][99] = 1;
		drawbg();
	} else
	if (scripts[4].t == 45) {
		map[5][100] = 1;
		drawbg();
	} else
	if (scripts[4].t == 50) {
		map[5][101] = 1;
		drawbg();
	} else
	if (scripts[4].t == 55) {
		map[5][102] = 1;
		drawbg();
	} else
	if (scripts[4].t == 60) {
		map[5][103] = 1;
		drawbg();
		timescale = 1;
		targetzoomscale = 1;
		targettranslatex = 0;
		scripts[4].stop();
	}
	scripts[4].t++;
}
scripts[4].render = function () {
	if (scripts[4].t <= 20) {
		ctx.fillRect(40*(96-currenttile*18)-20, -40+scripts[4].t*14, 40, 40);
	}
	if (scripts[4].t >= 5 && scripts[4].t <= 25) {
		ctx.fillRect(40*(97-currenttile*18)-20, -40+scripts[4].t*14-70, 40, 40);
	}
	if (scripts[4].t >= 10 && scripts[4].t <= 30) {
		ctx.fillRect(40*(98-currenttile*18)-20, -40+scripts[4].t*14-140, 40, 40);
	}
	if (scripts[4].t >= 15 && scripts[4].t <= 35) {
		ctx.fillRect(40*(98-currenttile*18)-20, -40+scripts[4].t*12-12*15, 40, 40);
	}
	if (scripts[4].t >= 20 && scripts[4].t <= 40) {
		ctx.fillRect(40*(99-currenttile*18)-20, -40+scripts[4].t*12-12*20, 40, 40);
	}
	if (scripts[4].t >= 25 && scripts[4].t <= 45) {
		ctx.fillRect(40*(100-currenttile*18)-20, -40+scripts[4].t*12-12*25, 40, 40);
	}
	if (scripts[4].t >= 30 && scripts[4].t <= 50) {
		ctx.fillRect(40*(101-currenttile*18)-20, -40+scripts[4].t*12-12*30, 40, 40);
	}
	if (scripts[4].t >= 35 && scripts[4].t <= 55) {
		ctx.fillRect(40*(102-currenttile*18)-20, -40+scripts[4].t*12-12*35, 40, 40);
	}
	if (scripts[4].t >= 40 && scripts[4].t <= 60) {
		ctx.fillRect(40*(103-currenttile*18)-20, -40+scripts[4].t*12-12*40, 40, 40);
	}
}

buttons[5] = new Button(77,6,false); // raise headbang part
scripts[5] = new Script();
scripts[5].tick = function () {
	if (scripts[5].t == 0) {
		buttons[5].toggle();
		map[6][85] = 3;
		drawbg();
	}
	if (scripts[5].t == 20) {
		map[6][85] = 0;
	}
	if (scripts[5].t == 80) {
		map[6][85] = 3;
	}
	scripts[5].t++;
	if (scripts[5].t == 100) {
		map[6][85] = 1;
		drawbg();
		buttons[5].toggle();
		scripts[5].t = 0;
		scripts[5].stop();
	}
}
scripts[5].render = function () {
	if (scripts[5].t <= 20) {
		ctx.fillRect(40*(85-currenttile*18)-20, 40*6-scripts[5].t*2, 40, 40);
	} else
	if (scripts[5].t >= 80 && scripts[5].t <= 100) {
		ctx.fillRect(40*(85-currenttile*18)-20, 40*5+scripts[5].t*2-160, 40, 40);
	}
}

buttons[6] = new Button(89,7,false); // headbang lower floor clear
scripts[6] = new Script();
scripts[6].tick = function () {
	if (scripts[6].t == 0) {
		buttons[6].toggle();
		buttons[5].toggle();
		checkpoint = [3580,360];
		scripts[5].t = 101;
		map[6][85] = 3;
		drawbg();
	} else
	if (scripts[6].t == 20) {
		map[6][85] = 0;
	} else
	if (scripts[6].t == 40) {
		invis = true;
		posxtmp = posx;
		posytmp = posy;
		posx = 2260;
		posy = 280;
	} else
	if (scripts[6].t == 90) {
		map[10][64] = 1;
		map[10][65] = 1;
		map[10][66] = 1;
		drawbg();
	} else
	if (scripts[6].t == 210) {
		map[7][64] = 1;
		map[7][65] = 1;
		map[7][66] = 1;
		drawbg();
	} else
	if (scripts[6].t == 290) {
		invis = false;
		posx = posxtmp;
		posy = posytmp;
	}
	scripts[6].t++;
	if (scripts[6].t == 291) {
		scripts[6].stop();
	}
}
scripts[6].render = function () {
	if (scripts[6].t <= 20) {
		ctx.fillRect(40*(85-currenttile*18)-20, 40*6-scripts[6].t*2, 40, 40);
	}
	if (scripts[6].t >= 50 && scripts[6].t <= 210) {
		ctx.fillRect(40*(64-currenttile*18)-20, 40*11-scripts[6].t+50, 120, 40);
	}
}

buttons[7] = new Button(116,4,false); // bowl ledge
scripts[7] = new Script();
scripts[7].tick = function () {
	if (scripts[7].t == 0) {
		buttons[7].toggle();
		checkpoint = [4380,200];
		map[5][114] = 3;
	} else
	if (scripts[7].t == 20) {
		map[5][114] = 1;
		drawbg();
	}
	scripts[7].t++;
	if (scripts[7].t == 21) {
		scripts[7].stop();
	}
}
scripts[7].render = function () {
	ctx.fillRect(40*(113-currenttile*18)-20+scripts[7].t*2, 40*5, 40, 40);
}

buttons[8] = new Button(178,8,false);
scripts[8] = new Script();
scripts[8].tick = function () {
	if (scripts[8].t == 0) {
		buttons[8].toggle();
		checkpoint = [7140,400];
	} else if (scripts[8].t == 5) {
		invis = true;
		posxtmp = posx;
		posytmp = posy;
		posx = 5820;
		posy = 200;
	} else if (scripts[8].t == 10) {
		map[5][150] = 0;
		map[5][155] = 0;
		map[8][162] = 0;
		drawbg();
	} else if (scripts[8].t == 50) {
		map[5][158] = 1;
		map[7][159] = 1;
		map[9][160] = 1;
		drawbg();
	} else if (scripts[8].t == 60) {
		posx = posxtmp;
		posy = posytmp;
		invis = false;
	}
	scripts[8].t++;
	if (scripts[8].t == 61) {
		scripts[8].stop();
	}
}
scripts[8].render = function () {
	if (scripts[8].t >= 10 && scripts[8].t < 30) {
		ctx.fillRect(40*(150-currenttile*18)-20+(scripts[8].t-10)*8, 40*5, 40, 40);

		ctx.fillRect(40*(155-currenttile*18)-20, 40*5+(scripts[8].t-10)*4, 40, 40);
		ctx.fillRect(40*(162-currenttile*18)-20-(scripts[8]-10)*2/15, 40*8, 40, 40);
	} else if (scripts[8].t >= 30 && scripts[8].t <= 50) {
		ctx.fillRect(40*(150-currenttile*18)-20+(scripts[8].t-10)*8, 40*5, 40, 40);

		ctx.fillRect(40*(155-currenttile*18)-20+(scripts[8].t-10)*4*20, 40*5, 40, 40);
		ctx.fillRect(40*(158-currenttile*18)-20, 40*(8-(scripts[8].t-10)/10), 40, 40);
	}
}

function autoCheckpoint(n) {
	if (n == 7) checkpoint = [5100,440];
	if (n == 8) checkpoint = [5820,200];
}