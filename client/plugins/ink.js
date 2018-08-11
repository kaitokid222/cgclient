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
    autoupgrade : 0,
    autowalls : 0,
};

window.cg.menuButtons = [];
cg.menuButtons.push(new menuButton("spawnbot","Keep Spawning", "cg.toggleautospawn(); hideMenu();"));
cg.menuButtons.push(new menuButton("upgradebot","Upgrade Minions", "cg.toggleupgradehelper(); hideMenu();"));
cg.menuButtons.push(new menuButton("wallbot","Spam Walls", "cg.togglewallspam(); hideMenu();"));

window.cg.toggleautospawn = function(){
	if(cg.toolsettings.autospawn === 0){
		cg.toolsettings.autospawn = 1;
	}else{
		cg.toolsettings.autospawn = 0;
	}
	cg.menuButtons[0].toggle();
}

window.cg.toggleupgradehelper = function(){
	if(cg.toolsettings.autoupgrade === 0){
		cg.toolsettings.autoupgrade = 1;
	}else{
		cg.toolsettings.autoupgrade = 0;
	}
	cg.menuButtons[1].toggle();
}

window.cg.togglewallspam = function(){
	if(cg.toolsettings.autowalls === 0){
		cg.toolsettings.autowalls = 1;
	}else{
		cg.toolsettings.autowalls = 0;
	}
	cg.menuButtons[2].toggle();
}

window.cg.checkstacks = function(){
	
}

window.showtoolMenu = function() {
	let e = "";
		e += '<button><div>CG-Helper</div></button>',
		e += '<div class="menu-spacer"></div>',
		cg.menuButtons.forEach(function(b){
			e += b.getHtml(),
			e += '<div class="menu-spacer"></div>';
		});
		e += '<div class="menu-spacer"></div>',
		e += '<button><div>by h8 & shurutsue</div></button>',
		//e += `<button onclick="Screens.show('inkmenu'); hideMenu();"><div class="icon">${cg.icons.get("play")}</div><div>MODIFICATIONS</div></button>`, 
		$("#menu .links").innerHTML = e,
		$("#menu").classList.add("active"),
		$("#menu-tint").classList.add("active")
}

document.addEventListener('keyup', (e) => {
	// F5
	if (e.keyCode === 116)
		chrome.runtime.reload();
	// F10
	if (e.keyCode === 121){
		if(!$("#menu").classList.contains("active")){
			if(cg.game.status === 0){
				//showMenu();
				showtoolMenu();
			}else if(cg.game.status === 2){
				// ingame
				showtoolMenu();
			}
		}else{
			hideMenu();
		}
	}
}, false);

/*cg.screens.add("inkmenu",() => {
	cg.screens.update("inkmenu", `<div class="container-full"><button class="close" onclick="cg.screens.hide()">${cg.icons.get("close")}</button><div class="content-text"><h2>First one!</h2><h3>Header</h3><ul class="changes"><li class="buffed">in a list</li><li class="nerfed">in a list</li><li class="added">in a list</li></ul><button class="box previous" onclick="Screens.show('home')">BUTTON</button></div></div>`)
});*/

// cg.game.state.players[0].factories
// Object.keys(cg.game.state.players[0].factories).forEach(key => console.log(key, cg.game.state.players[0].factories[key]))`,

/*cg.event.on("joined lobby", () => {
	console.log("Joined Lobby")
});

cg.event.on("left lobby", () => {
	console.log("Left Lobby")
});*/