function getId(arr, id){
  for(let i = 0; i < arr.length; i++){
    if(arr[i].id === id){
      return arr[i];
    }
  }
}
function test(db){
  let newDB = [];

  class Unit{
    constructor(name,minionID,upgrades){
      this.name = name;
      this.upgrades = [];
      for(let i = 0; i < upgrades.length; i++){
        this.upgrades.push(new Upgrade(upgrades[i].name, upgrades[i].ids));
      }
    }
  }

  class Upgrade{
    constructor(name,ids){
      this.name = name;
      this.amount = "";
      for(let i = 0; i < ids.length; i++){
        let a = getId(db.auras, ids[i]);
        if(a.effects[0].type == "trigger_spell"){
          let b = getId(db.auras, a.effects[0].spellId);
          this.amount += b.effects[0].value + '/';
        }else{
          this.amount += a.effects[0].value + '/';
        }
      }
    }
  }

  for(let x = 1; x < db.factories.length; x++){
    if(db.factories[x].minion) newDB.push(new Unit(db.factories[x].name, db.factories[x].minion.id, db.factories[x].minion.upgrades));
    if(db.factories[x].tower) newDB.push(new Unit(db.factories[x].name, db.factories[x].tower.id, db.factories[x].tower.upgrades));
  }
  return newDB;
}

test(JSON.parse(localStorage.getItem("config")));
