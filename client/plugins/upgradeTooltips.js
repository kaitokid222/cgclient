function getSpellEffect(id, db){
  for(let j = 0; j < db.spells.length; j++){
    if(db.spells[j].id == id){
      return db.spells[j].effects[0];
    }
  }
}

function getBounces(id, db){
  for(let j = 0; j < db.projectiles.length; j++){
    if(db.projectiles[j].id == id){
      return db.projectiles[j].bounces;
    }
  }
}

function getAuraEffect(id, db){
  for(let j = 0; j < db.auras.length; j++){
    if(db.auras[j].id == id){
      return db.auras[j].effects[0];
    }
  }
}

function getModStat(d, db){
  let eff = undefined;
  if(typeof(d) == "number"){
    eff = getSpellEffect(d, db);
  }else{
    eff = d;
  }
  if(eff.type && eff.type === "mod_stat" || eff.type && eff.type === "mod_stat_percent"){
    if(eff.value){
      return eff.value;
    }else{return null;}
  }else if(eff.type && eff.type === "mod_spell"){
    if(eff.mod.effect){
      return getModStat(getAuraEffect(eff.mod.effect.data.id, db), db);
    }else if(eff.mod.effectivity){
      return eff.mod.effectivity;
    }else if(eff.mod.projectileId){
      return getBounces(eff.mod.projectileId, db);
    }else{
      return eff;
    }
  }else{
    if(eff.type == "apply_aura"){
      return getModStat(getAuraEffect(eff.id, db), db);
    }else if(eff.type == "trigger_spell"){
      return getModStat(getSpellEffect(eff.spellId, db), db);
    }
  }
}
class Upgrade{
  constructor(upgrade, db){
    this.name = upgrade.name;
    this.values = [];
    for(let i = 0; i < upgrade.ids.length; i++){
      this.values.push(getModStat(upgrade.ids[i], db));
    }
  }
}
class Minion{
  constructor(factory, db){
    this.name = factory.name;
    this.id = factory.id;
    this.description = factory.description;
    this.meta = factory.meta;
    this.price = factory.price;
    this.role = factory.role;
    this.upgrades = [];
    for(let i = 0; i < factory.minion.upgrades.length; i++){
      this.upgrades.push(new Upgrade(factory.minion.upgrades[i], db));
    }
  }
}
class Tower{
  constructor(factory, db){
    this.name = factory.name;
    this.id = factory.id;
    this.description = factory.description;
    this.meta = factory.meta;
    this.price = factory.price;
    this.role = factory.role;
    this.upgrades = [];
    for(let i = 0; i < factory.tower.upgrades.length; i++){
      this.upgrades.push(new Upgrade(factory.tower.upgrades[i], db));
    }
  }
}
function extractUpgrades(db){
  let minions = [];
  let towers = [];
  for(let i = 0; i < db.factories.length; i++){
    if(db.factories[i].minion){
      minions.push(new Minion(db.factories[i], db));
    }else if(db.factories[i].tower){
      towers.push(new Tower(db.factories[i], db));
    }
  }
  return {minions: minions, towers: towers};
}
window.cg.tooltip = {
  upgrade : 0,
  text : ``,
  getText:""
};
window.cg.upgradeDB = undefined;
window.cg.event.on("session ready", ()=>{cg.upgradeDB = extractUpgrades(JSON.parse(localStorage.getItem("config")));});
function getUpgradeDescription(upgrade, number){
  let c, n;
  let e = `<span style="color : rgb(125,125,125);">` + upgrade.name.toUpperCase() + ` UPGRADE: ` + (number+1) + ` -  </span>`;
  if(number === 0){
    c = 0;
    n = upgrade.values[number];
  }else if(number > upgrade.values.length-1){
    c = upgrade.values[number-1];
    n = "MAX";
  }else{
    c = upgrade.values[number-1];
    n = upgrade.values[number];
  }
  switch(upgrade.name){
    case "chain damage":
      if(n !== "MAX"){
        n = n*10 + '%';
      }
      e += `increases ` + upgrade.name + ` by ` + c*10 + `% effectivity<span style="color : rgb(0,255,0);"> (-> ` + n + ` effectivity). </span>`;
      return e;
    case "range":
      e += `increases ` + upgrade.name + ` by ` + c + ` tiles <span style="color : rgb(0,255,0);">(-> ` + n + ` tiles).</span>`;
      return e;
    case "movement speed":
      e += `increases ` + upgrade.name + ` by ` + c + ` tiles/s <span style="color : rgb(0,255,0);">(-> ` + n + ` tiles/s).</span>`;
      return e;
    case "attack speed":
      e += `increases ` + upgrade.name + ` by ` + c + `/s <span style="color : rgb(0,255,0);">(-> ` + n + `/s).</span>`;
      return e;
    case "regeneration":
    case "freeze":
    case "thorns":
      if(n !== "MAX"){
        n = n*10 + '%';
      }
      e += `increases ` + upgrade.name + ` by ` + c*10 + `% <span style="color : rgb(0,255,0);">(-> ` + n + `).</span>`;
      return e;
    default:
      e += `increases ` + upgrade.name + ` by ` + c + ` <span style="color : rgb(0,255,0);">(-> ` + n + `).</span>`;
      return e;
  }
}
function getUpgrade(id){
  for(let i = 0; i < cg.upgradeDB.minions.length; i++){
    if(cg.upgradeDB.minions[i].id == id){
      return cg.upgradeDB.minions[i].upgrades[cg.tooltip.upgrade];
    }
  }
  for(let i = 0; i < cg.upgradeDB.towers.length; i++){
    if(cg.upgradeDB.towers[i].id == id){
      return cg.upgradeDB.towers[i].upgrades[cg.tooltip.upgrade];
    }
  }
}
function findActiveFactory(p){
  let a = cg.game.state.players[p].factories;
  for(let f of a){
    if(f.selected){
      return f;
    }
  }
}
cg.screens.add("ingame-tooltip", ()=>{
  let f = findActiveFactory(cg.game.state.activePlayerIndex);
  let lvl = 0;
  if(cg.tooltip.upgrade === 0){
    lvl = f.upgrade_1;
  }else if(cg.tooltip.upgrade === 1){
    lvl = f.upgrade_2;
  }else{
    lvl = f.upgrade_3;
  }
  let fup = getUpgrade(f.eid);
  let articleStyle = ``;
  articleStyle += `"text-align:center;font-size: 16px; position: fixed; left: 7.4rem; bottom: 0; right:23.4rem; padding:0.5rem 1rem 0.5rem 1rem; background-color: rgba(27,31,34,.75); border-radius: 4px;"`
  let et =  `<div id="tooltip" class="active" style=`+articleStyle+`>`;
  et += ` <div>` + getUpgradeDescription(fup, lvl) + `</div>`;
  et += `</div>`;
  cg.screens.update("ingame-tooltip",et).addClass("clickthrough");
});
for(let i = 0; i < cg.upgradebuttons.length; i++){
  cg.upgradebuttons[i].on("mousein", ()=>{cg.tooltip.upgrade = i;cg.screens.show("ingame-tooltip");});
  cg.upgradebuttons[i].on("mouseout", ()=>{cg.screens.hide();});
}
