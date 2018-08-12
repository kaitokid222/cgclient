class menuButton{
  constructor(name, text, onclick, icon){
    this.name = name;
    this.icon = icon || "play";
    this.onclick = onclick || `console.log('missing onclick in button');`;
    this.text = text || "unnamed";
  }
  getHtml(){
    let html = `<button id="`+ this.name + `" onclick="` + this.onclick + `">`;
    if(this.icon){
      html += `<div class="icon">` + cg.icons.get(this.icon) + `</div>`;
    }
    html += `<div>` + this.text + `</div></button>`
    return html;
  }
  toggle(){
	if(this.icon == "play"){
	  this.icon = "wait";
	}else{
	  this.icon = "play";
	}
  }
}

window.cg.toolsettings = {
    autospawn : 0,
    autospawn_limit : 15,
    autoupgrade : 0,
    autoupgrade_min : 3,
    autowalls : 0,
};

window.cg.menuButtons = [];
cg.menuButtons.push(new menuButton("spawnbot","Keep Spawning", "cg.toggleautospawn(); hideMenu();"));
cg.menuButtons.push(new menuButton("upgradebot","Upgrade Minions", "cg.toggleupgradehelper(); hideMenu();"));
cg.menuButtons.push(new menuButton("wallbot","Spam Walls", "cg.togglewallspam(); hideMenu();"));

// minions 
window.cg.toggleautospawn = function(){
	if(cg.toolsettings.autospawn === 0){
		cg.toolsettings.autospawn = 1;
		window.cg.spawninterval = setInterval(cg.SpawnMinion, 1200);
		cg.messages.show("activated auto-spawner!");
	}else{
		cg.toolsettings.autospawn = 0;
		clearInterval(cg.spawninterval);
		cg.messages.show("deactivated auto-spawner!");
	}
	cg.menuButtons[0].toggle();
}

window.cg.setautospawnlimit = function(){
	cg.toolsettings.autospawn_limit = document.getElementById("sendlimit").value;
	document.getElementById("sendlimit_label").innerHTML = document.getElementById("sendlimit").value;
}

window.cg.checklimit = function(){
	let i = (cg.toolsettings.autospawn_limit/30).toFixed(2);
	if(cg.game.state.players[cg.game.playerIndex].minion_limit < i){
		return true;
	}else{
		return false;
	}
}

window.cg.SpawnMinion = function() {
	if (2 === cg.game.status && 0 === cg.game.state.warmup) {
		if(cg.checklimit() === true){
			const t = [];
			for (let e, o = 1; o < 6; o++)
				(e = cg.game.state.players[cg.game.playerIndex].factories[o]).stacks_current > 0 && 0 === e.cooldown_seconds && t.push(e);
			if (t.length){
				const e = cg.arrayRandom(t);
				cg.gameserver.emit("ActivateFactory", {index: e.index,position: 0});
			}
		}
	}
}

window.cg.arrayRandom = function(t) {
	return t[Math.floor(Math.random() * t.length)]
}
// eof minion

// upgradehelper
window.cg.toggleupgradehelper = function(){
	if(cg.toolsettings.autoupgrade === 0){
		cg.toolsettings.autoupgrade = 1;
		window.cg.upgradeinterval = setInterval(cg.tryUpgrade, 1200);
		cg.messages.show("activated upgrade-helper!");
	}else{
		cg.toolsettings.autoupgrade = 0;
		clearInterval(cg.upgradeinterval);
		cg.messages.show("deactivated upgrade-helper!");
	}
	cg.menuButtons[1].toggle();
}

window.cg.tryUpgrade = function() {
	if (2 === cg.game.status && 0 === cg.game.state.warmup) {
		let i = (cg.toolsettings.autoupgrade_min/30).toFixed(2);
		if(cg.game.state.players[cg.game.playerIndex].minion_limit > i){
			const t = [];
			for (let e, o = 1; o < 6; o++)
				(e = cg.game.state.players[cg.game.playerIndex].factories[o]).hasOwnProperty("stacks_current") === true && 0 === e.cooldown_seconds && t.push(e);
			if (t.length){
				const e = cg.arrayRandom(t);
				e.upgradeLowest();
			}
		}
	}
}

window.cg.setautoupgrademin = function(){
	cg.toolsettings.autoupgrade_min = document.getElementById("limitminimum").value;
	document.getElementById("limitminimum_label").innerHTML = document.getElementById("limitminimum").value;
}

// eof upgrades
window.cg.togglewallspam = function(){
	if(cg.toolsettings.autowalls === 0){
		cg.toolsettings.autowalls = 1;
		cg.messages.show("activated autowalls!");
	}else{
		cg.toolsettings.autowalls = 0;
		cg.messages.show("deactivated autowalls!");
	}
	cg.menuButtons[2].toggle();
}



window.showtoolMenu = function() {
	let e = "";
	let i = cg.toolsettings.autospawn_limit;
	let c = cg.toolsettings.autoupgrade_min;
		e += '<button><div>CG-Helper</div></button>';
		e += '<div class="menu-spacer"></div>';
		cg.menuButtons.forEach(function(b){
			e += b.getHtml();
			if(b.name == "spawnbot"){
				if(cg.toolsettings.autospawn === 1){
					e += '<div class="form-item form-range">';
					e += '<label for="sendlimit">Spawn until<span id="sendlimit_label">'+ i +'</span></label>';
					e += '<input type="range" value="'+ i +'" step="3" min="3" max="30" id="sendlimit" oninput="cg.setautospawnlimit()" onchange="cg.setautospawnlimit()">';
					e += '</div>';
				}
			}
			if(b.name == "upgradebot"){
				if(cg.toolsettings.autoupgrade === 1){
					e += '<div class="form-item form-range">';
					e += '<label for="limitminimum">Spawn until<span id="limitminimum_label">'+ c +'</span></label>';
					e += '<input type="range" value="'+ c +'" step="3" min="3" max="'+ i +'" id="limitminimum" oninput="cg.setautoupgrademin()" onchange="cg.autoupgrademin()">';
					e += '</div>';
				}
			}
			e += '<div class="menu-spacer"></div>';
		});
		e += '<div class="menu-spacer"></div>';
		e += '<button><div>by h8 & shurutsue</div></button>';
		$("#menu .links").innerHTML = e;
		$("#menu").classList.add("active");
		$("#menu-tint").classList.add("active");
}

document.addEventListener('keyup', (e) => {
	// F5
	if (e.keyCode === 116)
		chrome.runtime.reload();
	// F10
	if (e.keyCode === 121){
		if(!$("#menu").classList.contains("active")){
			if(cg.game.status === 0){
				showMenu();
			}else if(cg.game.status === 2){
				showtoolMenu();
			}
		}else{
			hideMenu();
		}
	}
}, false);

/*cg.screens.add("inkmenu",() => {
	cg.screens.update("inkmenu", `<div class="container-full">
	<button class="close" onclick="cg.screens.hide()">${cg.icons.get("close")}</button>
	<div class="content-text"><h2>First one!</h2><h3>Header</h3><ul class="changes"><li class="buffed">in a list</li><li class="nerfed">in a list</li><li class="added">in a list</li></ul><button class="box previous" onclick="Screens.show('home')">BUTTON</button></div></div>`)
});*/

// cg.game.state.players[0].factories
// Object.keys(cg.game.state.players[0].factories).forEach(key => console.log(key, cg.game.state.players[0].factories[key]))`,

/*cg.event.on("joined lobby", () => {
	console.log("Joined Lobby")
});

cg.event.on("left lobby", () => {
	console.log("Left Lobby")
});*/