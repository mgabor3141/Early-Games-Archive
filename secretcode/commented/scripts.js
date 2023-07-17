var colors = ["#0000FF","#00FF00","#FF0000","#FFFF00","#00FFFF","#FF00FF","#000000","#CCCCCC"];

var selection = [null,null,null,null]; // itt t�rol�dik a kiv�laszt�s (als� sor), n�gy sz�m ami a fenti sz�nek k�z�l az egyik sorsz�ma
var target = [null,null,null,null]; // itt t�rol�dik a secret (fels� sor), szint�n 4 sz�nsorsz�m (vagy null, azaz �res (a null �rt�k nem egyenl� a 0 �rt�kkel!))
var attnum = 0; // pr�b�lkoz�s sorsz�ma

// <--- egysoros komment kezd�se

/* <--- t�bbsoros komment kezd�se
	szintaxis: varos = ["Budapest","Praga","NY"]
	ez egy t�mb. az �rt�kek null�t�l sz�mozva vannak. visszakeres�s: 'varos[1]' --> "Praga"-t ad vissza
	az index v�ltoz�t is elfogad:
	
	a = 2;
	b = varos[a];

	b �rt�ke "NY"   
*/

function init() { // ez megh�v�dik a j�t�k bet�lt�sekor
	for (i = 0; i <= 7; i++) { // jobb oldali gombok kisz�nez�se a fenti sz�nekkel
		document.getElementById("color"+i).style.backgroundColor = colors[i];
	}

	for (i = 0; i <= 3; i++) { // a n�gy secret sz�n: n�gy randomsz�m 0-7ig
		target[i] = Math.floor(Math.random()*8);
	}
}

function addColor(num) { // megh�v�dik amikor hozz�adsz egy sz�nt a kiv�lasztottakhoz (LOL), 'num' param�ter, sz�n sorsz�m
	for (i = 0; i <= 3; i++) { // a 'selection' t�mb elej�r�l elmegy az els� null (�res, nem foglalt) selection dobozig, �s odarakja a num param�ter �rt�k�t
		if (selection[i] == null) {
			selection[i] = num;
			break;
		}
	}

	for (i = 0; i <= 3; i++) { // megjelen�ti a selectiont (ugye a v�ltoz� ('selection') az nem l�tszik, az csak a mem�ri�ban van)
		document.getElementById("select"+i).style.backgroundColor = colors[selection[i]]; // ezek ilyen kin�zeti dolgok, programoz�s szempontj�b�l l�nyegtelen, ezekkel ne foglalkozz
	}
}

function enterColors() { // amikor r�nyomsz alul a gombra (vagy enter) akkor h�v�dik meg, ez a l�nyeg!
	if (attnum > 14) return; // ha elfogytak a pr�b�lkoz�sok => return, azaz le�ll, nem megy tov�bb a function-ben
	for (i = 0; i <= 3; i++) { // ha valamelyik selection �res (null) => return
		if (selection[i] == null) return;
	}

	for (i = 0; i <= 3; i++) { // kijelz�s (sz�nez�s)
		document.getElementById(i+"att"+attnum).style.backgroundColor = colors[selection[i]];
	}

	yellow = 0; // na itt j�n a te �tleted, a csekkol�s
	red = 0; // inicializ�lunk k�t v�ltoz�t, red �s yellow, ide fogjuk pakolni a v�geredm�nyt
	selchecked = []; // selchecked azaz selection checked, ide j�nnek azoknak a selection mez�knek a sorsz�mai, amiket m�r nem kell n�zni
	checked = []; // uganez csak a secret (aka target) mez�k sorsz�maival
	for (i = 0; i <= 3; i++) { //s�rg�k keres�se
		if (selection[i] == target[i]) { // ha a k�t �rt�k ugyanaz, egyez�st tal�ltunk
			yellow++; // s�rg�k sz�m�t n�velj�k. szintaxis: "a++" ugyanaz mint hogy "a = a + 1" csak r�vid�tve
			checked[checked.length] = i; // megjegyezz�k hogy se ezt a selection-t
			selchecked[selchecked.length] = i; // se ezt a target-et m�r ne n�zz�k
		}
	}
	for (i = 0; i <= 3; i++) { // pirosak
		loop: for (j = 0; j <= 3; j++) { // <-- EZ a 'loop' c�mk�j� for (sor eleje), sim�n el van nevezve h hivatkozni lehessen r� (l�sd lentebb) | am. meg: egym�sba �gyazott for ciklus: v�gigmegy�nk minden 'selection'-�n, de minden l�p�sben minden 'target'en is: a targeteket 4*4=16-szor n�zt�k
			if (j != i && selection[i] == target[j]) { // ha egyez�st tal�ltunk, nem azonos sorsz�m� mez�k�n
				for (k = 0; k < checked.length; k++) { // a mez� r�sze-e a nem csekkoland� targeteknek
					if (j == checked[k]) continue loop; // ha igen, tov�bbl�v�k a 'loop' c�mk�j� ciklusban
				}
				for (k = 0; k < selchecked.length; k++) { // illetve r�sze-e a nem csekkoland� selection-�knek
					if (i == selchecked[k]) continue loop; // ha igen, tov�bbl�p�nk
				}
				red++; // ha nem, tal�ltunk egy pirosat
				checked[checked.length] = j; // �s ezeket a mez�ket hozz�adjuk a nem csekkoland�akhoz
				selchecked[selchecked.length] = i; // szintax: "a = [3,1,4,1,5];" a t�mb, hossza: "a.length" 5-�t ad vissza.
			} // 'a' utols� elem�nek elemsz�ma 4 (0-t�l kezdt�nk sz�mozni), teh�t egy �j elem elemsz�ma pont a.length lesz
		} // teh�t "a[a.length] = 10;" ut�n a t�mb�nk �j �rt�ke (tartalma) [3,1,4,1,5,10] lesz. hozz�toldottunk a t�mb v�g�hez.
	}

	for (i = 0; i < red; i++) { // ki�r�s
		document.getElementById("red"+attnum).innerHTML += "&bull;";
	}
	for (i = 0; i < yellow; i++) {
		document.getElementById("yellow"+attnum).innerHTML += "&bull;";
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = "#FFFFFF";
	}

	//console.log("red: " + red + " yellow: "+yellow);
	if (yellow == 4 && red == 0) showTarget(); // ha nyert: megmutatjuk a megold�st
	if (attnum == 14) { showTarget(); alert("You suck!");} // ha vesztett, megrov�sban r�szes�tj�k

	selection = [null,null,null,null]; // t�r�lj�k a selection-t
	attnum++; // megn�velj�k a pr�b�lkoz�sok sz�m�t
} // id�ig tartott a l�nyeg

function showTarget() {
	for (i = 0; i <= 3; i++) { // po�n lel�v�se (target megmutat�sa)
		document.getElementById("target"+i).innerHTML = "";
		document.getElementById("target"+i).style.backgroundColor = colors[target[i]];
	}
}

function clearColor(num) { // selection-b�l t�rl�s (az al�bbi kommenteket eleve od�rtam, m�g magamnak)
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
		selection.splice(num,1);
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = (selection[i] == null)?"#FFFFFF":colors[selection[i]];
	}
}

function keyDown(e) { // billenty�k kezel�se
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