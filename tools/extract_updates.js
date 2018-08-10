function getById(id, arr){
  for(let j = 0; j < arr.length; j++){
    if(arr[j].id == id){
      return arr[j];
    }
  }
}
function getSpellEffect(id, db){
  return getById(id,db.spells).effects[0];
}
function getBounces(id, db){
  return getById(id,db.projectiles).bounces;
}
function getAuraEffect(id, db){
  getById(id, db.auras).effects[0];
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
