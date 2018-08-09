function getSpellEffect(id, db){
  for(let j = 0; j < db.spells.length; j++){
    if(db.spells[j].id == id){
      return db.spells[j].effects[0];
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
    }else if(eff.efficiency){
      return eff.efficiency;
    }else{return null;}
  }else if(eff.type && eff.type === "mod_spell"){
    return getModStat(getAuraEffect(11025520, db), db);
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
