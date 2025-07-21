// ==== Utility Functions, World/NPC Definitions, Player State ====
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const worldLocations = [
  {name:"Heavenly Sect", type:"Sect"},
  {name:"Mystic Mountain", type:"Mountain"},
  {name:"Imperial City", type:"City"},
  {name:"Spirit Forest", type:"Forest"},
  {name:"Azure Lake", type:"Lake"},
  {name:"Red Temple", type:"Temple"},
  {name:"Jade Kingdom", type:"Kingdom", resources:{wealth:200, qi:300, troops:50}, ruler:null},
  {name:"Iron Kingdom", type:"Kingdom", resources:{wealth:150, qi:180, troops:40}, ruler:null},
  {name:"Dragon Kingdom", type:"Kingdom", resources:{wealth:320, qi:400, troops:110}, ruler:null}
];

let npcFamilies = ["Zhou", "Mei", "Chen", "Li", "Xiao", "Wang", "Yu", "Tian", "Luo", "Fang", "Qin", "Hua", "Lan", "Jin", "Rong", "Bo", "Wei", "Shen", "Min", "Yan"];
let bossNames = [
  {name:"Demon Lord", trait:"Tyrannical", type:"boss", color:"npc-boss"},
  {name:"Evil Patriarch", trait:"Cunning", type:"boss", color:"npc-boss"},
  {name:"Rogue Immortal", trait:"Unpredictable", type:"boss", color:"npc-boss"},
  {name:"Heavenly Calamity", trait:"Destructive", type:"boss", color:"npc-boss"}
];
let npcTypes = [
  {type:"rival", label:"Rival", color:"npc-rival"},
  {type:"ally", label:"Ally", color:"npc-ally"},
  {type:"family", label:"Family", color:"npc-family"},
  {type:"love", label:"Love Interest", color:"npc-love"},
  {type:"mentor", label:"Mentor", color:"npc-mentor"},
  {type:"disciple", label:"Disciple", color:"npc-disciple"},
  {type:"enemy", label:"Enemy", color:"npc-enemy"}
];
let npcTraits = ["Loyal", "Ambitious", "Hot-headed", "Wise", "Jealous", "Generous", "Secretive", "Bold", "Kind", "Scheming", "Righteous", "Detached"];

let npcPool = [];
let knownNPCs = [];
function createNPC(index) {
  if (index < bossNames.length) {
    let boss = bossNames[index];
    let locationObj = randomFrom(worldLocations.filter(l=>l.type==="Kingdom"||l.type==="Sect"));
    return {
      id: "boss-"+boss.name.replace(" ","")+"-"+Math.floor(Math.random()*10000),
      name: boss.name,
      type: "boss",
      label: "Boss Enemy",
      color: boss.color,
      trait: boss.trait,
      family: boss.name + " Faction",
      affiliation: boss.name + " Faction",
      relationship: Math.floor(Math.random()*40),
      talent: 7 + index,
      age: 200 + index*50,
      qi: 400 + index*100,
      qiPerSec: 8 + index*2,
      realmIndex: Math.min(22, 12+index*2),
      miniStageIndex: 3,
      alive: true,
      married: false,
      spouseId: null,
      history: [],
      location: locationObj.name
    };
  }
  let typeObj = Math.random()<0.2 ? {type:"enemy", label:"Enemy", color:"npc-enemy"} : randomFrom(npcTypes);
  let family = randomFrom(npcFamilies) + " Family";
  let locationObj = randomFrom(worldLocations);
  let affiliation = locationObj.type === "Kingdom" ? locationObj.name : family;
  return {
    id: "npc-"+index+"-"+family+"-"+Math.floor(Math.random()*10000),
    name: randomFrom(npcFamilies)+" "+(Math.random()<0.4 ? randomFrom(npcFamilies) : ""),
    type: typeObj.type,
    label: typeObj.label,
    color: typeObj.color,
    trait: randomFrom(npcTraits),
    family: family,
    affiliation: affiliation,
    relationship: clamp(Math.floor(Math.random()*60)+20,0,100),
    talent: clamp(Math.floor(Math.random()*4)+1,1,6),
    age: Math.floor(Math.random()*30)+14,
    qi: Math.floor(Math.random()*150),
    qiPerSec: 1,
    realmIndex: Math.floor(Math.random()*3),
    miniStageIndex: Math.floor(Math.random()*2),
    alive: true,
    married: false,
    spouseId: null,
    history: [],
    location: locationObj.name
  };
}
function generateNPCPool(n=18) {
  npcPool = [];
  knownNPCs = [];
  for (let i=0;i<n;i++) npcPool.push(createNPC(i));
}
generateNPCPool();

let player = {
  name: "You",
  age: 16,
  health: 100,
  talent: 2,
  relationships: 0,
  wealth: 50,
  spiritStones: 15,
  qi: 0,
  qiPerSec: 1,
  realmIndex: 0,
  miniStageIndex: 0,
  quests: [],
  alive: true,
  infamy: 0,
  kingdom: null
};

// ==== UI Element References ====
const ageDisplay = document.getElementById('ageDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const talentDisplay = document.getElementById('talentDisplay');
const relDisplay = document.getElementById('relDisplay');
const wealthDisplay = document.getElementById('wealthDisplay');
const spiritStoneDisplay = document.getElementById('spiritStoneDisplay');
const qiDisplay = document.getElementById('qiDisplay');
const qpsDisplay = document.getElementById('qpsDisplay');
const infamyDisplay = document.getElementById('infamyDisplay');
const realmDisplay = document.getElementById('realmDisplay');
const miniStageDisplay = document.getElementById('miniStageDisplay');
const advanceBtn = document.getElementById('advanceBtn');
const eventMsg = document.getElementById('eventMsg');
const breakthroughMsg = document.getElementById('breakthroughMsg');
const worldEventBanner = document.getElementById('worldEventBanner');
const familyTreeDiv = document.getElementById('familyTree');
const inheritedQuestsDiv = document.getElementById('inheritedQuests');
const npcPanel = document.getElementById('npcPanel');
const knownNpcListDiv = document.getElementById('knownNpcList');
const relationshipBtn = document.getElementById('relationshipBtn');
const closeNpcPanelBtn = document.getElementById('closeNpcPanel');
const worldBtn = document.getElementById('worldBtn');
const worldTab = document.getElementById('worldTab');
const locationList = document.getElementById('locationList');
const closeWorldTabBtn = document.getElementById('closeWorldTab');
const kingdomModal = document.getElementById('kingdomModal');
const kingdomNameInput = document.getElementById('kingdomNameInput');
const confirmKingdomNameBtn = document.getElementById('confirmKingdomNameBtn');
const kingdomModalMsg = document.getElementById('kingdomModalMsg');

// ==== Save & Load System ====
function saveGame() {
  const gameState = {
    player,
    npcPool,
    knownNPCs,
  };
  localStorage.setItem('greatdao_save', JSON.stringify(gameState));
}
function loadGame() {
  const data = localStorage.getItem('greatdao_save');
  if (data) {
    try {
      const state = JSON.parse(data);
      player = state.player;
      npcPool = state.npcPool;
      knownNPCs = state.knownNPCs;
      updateUI();
    } catch(e) {
      alert("Load failed!");
    }
  } else {
    alert("No save found!");
  }
}

// ==== World News Feed ====
let worldNews = [];
function addWorldNews(msg, important=false) {
  const now = new Date();
  const ts = now.toLocaleDateString() + " " + now.toLocaleTimeString();
  worldNews.unshift({msg, ts, important});
  if (worldNews.length > 20) worldNews.pop();
  renderWorldNews();
}
function renderWorldNews() {
  const newsFeed = document.getElementById('newsFeed');
  newsFeed.innerHTML = worldNews.length === 0 ? "<li>No news yet.</li>" :
    worldNews.map(item =>
      `<li class="news-item${item.important ? ' news-important' : ''}">
        <span class="news-timestamp">${item.ts}</span> ${item.msg}
      </li>`
    ).join("");
}
document.getElementById('worldNewsBtn').onclick = function() {
  renderWorldNews();
  document.getElementById('worldNewsPanel').style.display = "block";
};
document.getElementById('closeWorldNewsBtn').onclick = function() {
  document.getElementById('worldNewsPanel').style.display = "none";
};

// ==== Cultivation Stages ====
const mainRealms = [
  "Third Rate Master", "Second Rate Master", "First Rate Master", "Peak Master", "Three Flowers Gather at the Summit",
  "Five Energies Converging at the Origin", "Ultimate Pinnacle", "Beyond the Path to Heaven (First Stage of Manifestation)",
  "Treading Heaven Beyond the Path (Second Stage of Manifestation)", "Beyond Treading Heavens (Third Stage of Manifestation)",
  "Fourth Stage of Manifestation", "Fifth Stage of Manifestation", "Qi Gathering", "Qi Refining",
  "Qi Building", "Core Formation", "Nascent Soul", "Heavenly Being", "Middle Boundary: Four Pillars",
  "Middle Boundary: Integration", "Middle Boundary: Star Shattering", "Middle Boundary: Star Rebirth",
  "Middle Boundary: Entering Nirvana", "Great Boundary: True Immortal"
];
const miniStages = ["Early", "Middle", "Late", "Peak"];
const qiNeeded = [
  [100, 200, 400, 700], [1200, 1800, 2400, 3200], [5000, 7000, 9000, 12000], [20000, 25000, 32000, 40000],
  [60000, 80000, 110000, 150000], [220000, 260000, 300000, 340000], [400000, 500000, 600000, 700000],
  [800000, 900000, 1050000, 1200000], [1500000, 1800000, 2100000, 2500000], [3000000, 3500000, 4000000, 4500000],
  [5000000, 6000000, 7000000, 8000000], [10000000, 12000000, 14000000, 16000000], [20000000, 22000000, 24000000, 26000000],
  [30000000, 35000000, 40000000, 45000000], [50000000, 60000000, 70000000, 80000000],
  [100000000, 120000000, 140000000, 160000000], [200000000, 220000000, 240000000, 260000000],
  [300000000, 350000000, 400000000, 450000000], [500000000, 600000000, 700000000, 800000000],
  [1000000000, 1200000000, 1400000000, 1600000000], [2000000000, 2200000000, 2400000000, 2600000000],
  [3000000000, 3500000000, 4000000000, 4500000000], [5000000000, 6000000000, 7000000000, 8000000000],
  [10000000000, 12000000000, 14000000000, 16000000000]
];

// ==== World Tab Logic ====
worldBtn.onclick = function() {
  renderWorldTab();
  worldTab.style.display = "block";
};
closeWorldTabBtn.onclick = function() {
  worldTab.style.display = "none";
};

function renderWorldTab() {
  let locMap = {};
  worldLocations.forEach(loc => locMap[loc.name] = []);
  knownNPCs.forEach(npc => {
    if (!locMap[npc.location]) locMap[npc.location] = [];
    locMap[npc.location].push(npc);
  });
  locationList.innerHTML = Object.keys(locMap).map(locName => {
    let loc = worldLocations.find(l=>l.name===locName);
    let npcsHere = locMap[locName] || [];
    let isKingdom = loc?.type === "Kingdom";
    let isControlled = player.kingdom && player.kingdom.location === locName;
    let controlBtn = !isControlled && isKingdom && !loc.ruler ?
      `<button onclick="claimKingdom('${locName}')">Conquer & Control</button>` : "";
    let kingdomInfo = isKingdom ?
      `<div class="kingdom-info">
        Wealth: ${loc.resources.wealth} | Qi: ${loc.resources.qi} | Troops: ${loc.resources.troops} 
        | Ruler: ${loc.ruler || "None"}
        ${controlBtn}
      </div>` : "";
    let mergedActionsBtn = `<button class="merged-actions-btn" onclick="openActionsMenu('${locName}', event)">Actions</button>`;
    return `
      <div class="location-block">
        <div class="location-title">${loc?.name || locName} <small>(${loc?.type || ""})</small></div>
        ${kingdomInfo}
        <div class="location-npcs">
          ${npcsHere.length ? npcsHere.map(npc =>
            `<span class="${npc.color}">${npc.name} (${npc.label}, Talent:${npc.talent})
              <button class="merged-actions-btn" onclick="openActionsMenuForNPC('${npc.id}', event)">Actions</button>
            </span>`
          ).join(", ") : "<em>No known NPCs here.</em>"}
        </div>
        ${mergedActionsBtn}
      </div>
    `;
  }).join("");
}

// ==== Merged Actions Menus ====
let actionsMenuDiv = null;
function openActionsMenu(locName, ev) {
  closeActionsMenu();
  actionsMenuDiv = document.createElement('div');
  actionsMenuDiv.className = "actions-menu";
  actionsMenuDiv.style.top = ev.clientY + "px";
  actionsMenuDiv.style.left = ev.clientX + "px";
  let loc = worldLocations.find(l=>l.name===locName);
  let isKingdom = loc?.type === "Kingdom";
  let btns = [
    `<button onclick="offendParty('${locName}');closeActionsMenu();">Offend</button>`,
    isKingdom ?
      `<button onclick="wipeKingdom('${locName}');closeActionsMenu();">Wipe Out Kingdom</button>` :
      `<button onclick="wipeFamily('${locName}');closeActionsMenu();">Wipe Out Family</button>`,
    isKingdom && !loc.ruler ? `<button onclick="claimKingdom('${locName}');closeActionsMenu();">Conquer & Control</button>` : ""
  ];
  actionsMenuDiv.innerHTML = btns.join("");
  document.body.appendChild(actionsMenuDiv);
  ev.stopPropagation();
}
function openActionsMenuForNPC(npcId, ev) {
  closeActionsMenu();
  actionsMenuDiv = document.createElement('div');
  actionsMenuDiv.className = "actions-menu";
  actionsMenuDiv.style.top = ev.clientY + "px";
  actionsMenuDiv.style.left = ev.clientX + "px";
  actionsMenuDiv.innerHTML = `<button onclick="killNPC('${npcId}');closeActionsMenu();">Kill</button>`;
  document.body.appendChild(actionsMenuDiv);
  ev.stopPropagation();
}
function closeActionsMenu() {
  if (actionsMenuDiv && actionsMenuDiv.parentNode) actionsMenuDiv.parentNode.removeChild(actionsMenuDiv);
  actionsMenuDiv = null;
}
document.body.onclick = closeActionsMenu;

// ==== WORLD ACTIONS ====
function offendParty(locName) {
  let loc = worldLocations.find(l=>l.name===locName);
  knownNPCs.forEach(npc => {
    if (npc.location === locName) {
      npc.type = "rival";
      npc.label = "Rival";
      npc.color = "npc-rival";
      npc.relationship = clamp(npc.relationship-40,0,100);
      npc.history.push("You offended their party!");
    }
  });
  player.infamy += 10;
  eventMsg.textContent = `You have offended the entire party at ${locName}. They are now your rivals. Infamy increased!`;
  addWorldNews(`Player offended all at ${locName}. Now rivals.`, true);
  updateUI();
}

function killNPC(npcId) {
  let npc = knownNPCs.find(n=>n.id===npcId);
  if (npc) {
    let realmDiff = player.realmIndex - npc.realmIndex;
    if (realmDiff >= 2) {
      npc.alive = false;
      npc.history.push("Killed by player");
      player.infamy += 15;
      eventMsg.textContent = `You killed ${npc.name}. Infamy increased!`;
      addWorldNews(`Player killed ${npc.name} at ${npc.location}.`, true);
      if (npc.type === "boss") {
        let stones = 50 + Math.floor(Math.random()*50);
        player.spiritStones += stones;
        addWorldNews(`Player defeated boss ${npc.name} and looted ${stones} Spirit Stones!`, true);
      }
    } else {
      eventMsg.textContent = `You are not strong enough to kill ${npc.name}.`;
    }
    updateUI();
  }
}

function wipeFamily(locName) {
  let affected = knownNPCs.filter(npc => npc.affiliation === locName || npc.family === locName);
  if (affected.length === 0) {
    eventMsg.textContent = "No family found to wipe out here.";
    return;
  }
  let canWipe = player.realmIndex >= 8;
  if (canWipe) {
    affected.forEach(npc => { npc.alive = false; npc.history.push("Family wiped out by player"); });
    player.infamy += 40;
    eventMsg.textContent = `You have wiped out the ${locName}. Infamy greatly increased!`;
    addWorldNews(`Player wiped out the ${locName}.`, true);
  } else {
    eventMsg.textContent = "You must reach at least the 8th realm to wipe out a family.";
  }
  updateUI();
}

function wipeKingdom(locName) {
  let loc = worldLocations.find(l=>l.name===locName);
  if (!loc || loc.type !== "Kingdom") {
    eventMsg.textContent = "Not a kingdom.";
    return;
  }
  let canWipe = player.realmIndex >= 12;
  if (canWipe) {
    knownNPCs.forEach(npc => { if (npc.location === locName) npc.alive = false; });
    loc.ruler = null;
    player.infamy += 100;
    eventMsg.textContent = `You have wiped out the kingdom of ${locName}. World will remember this atrocity. Infamy massively increased!`;
    addWorldNews(`Player wiped out the kingdom of ${locName}! Atrocity shakes the world!`, true);
  } else {
    eventMsg.textContent = "You must reach at least the 12th realm to wipe out a kingdom.";
  }
  updateUI();
}

function claimKingdom(locName) {
  let loc = worldLocations.find(l=>l.name===locName);
  if (!loc || loc.type !== "Kingdom" || loc.ruler) {
    eventMsg.textContent = "Cannot claim this kingdom.";
    return;
  }
  let rivals = knownNPCs.filter(npc => npc.location === locName && npc.type === "rival" && npc.alive);
  let canClaim = player.realmIndex >= 7 && rivals.length === 0;
  if (canClaim) {
    showKingdomNamingModal(loc);
  } else if (player.realmIndex < 7) {
    eventMsg.textContent = "You must reach at least the 7th realm to conquer a kingdom.";
  } else {
    eventMsg.textContent = "You must defeat all rivals in this kingdom before conquering.";
  }
  updateUI();
}

function showKingdomNamingModal(locationObj) {
  kingdomModal.style.display = 'block';
  kingdomModalMsg.textContent = '';
  confirmKingdomNameBtn.onclick = function() {
    let name = kingdomNameInput.value.trim();
    if (!name || name.length < 2) {
      kingdomModalMsg.textContent = "Name must be at least 2 characters.";
      return;
    }
    player.kingdom = {
      name: name,
      location: locationObj.name,
      resources: {...locationObj.resources},
      troops: locationObj.resources?.troops || 40
    };
    locationObj.ruler = player.name;
    kingdomModal.style.display = 'none';
    eventMsg.textContent = `You have claimed the kingdom "${name}"! Manage its resources wisely.`;
    addWorldNews(`Player has claimed and named the kingdom "${name}" at ${locationObj.name}!`, true);
    updateUI();
  };
}
kingdomModal.onclick = function(e){if(e.target===kingdomModal)kingdomModal.style.display='none';};

setInterval(function() {
  if (player.kingdom) {
    player.kingdom.resources.wealth += 3 + Math.floor(player.kingdom.troops/10);
    player.kingdom.resources.qi += 6 + Math.floor(player.talent/2);
    player.kingdom.troops += Math.random()<0.05 ? 1 : 0;
    player.spiritStones += 2 + Math.floor(player.kingdom.troops/20);
    if (Math.random()<0.22) {
      addWorldNews(`Kingdom "${player.kingdom.name}" gains resources: Wealth ${player.kingdom.resources.wealth}, Qi ${player.kingdom.resources.qi}, Troops ${player.kingdom.troops}, Spirit Stones ${player.spiritStones}.`);
    }
    updateUI();
  }
}, 4000);

// ==== Life/Idle/Stats & Cultivation ====
setInterval(function() {
  if (player.health > 0 && player.alive) {
    player.qi += player.qiPerSec;
  }
  updateUI();
  let nextQiNeeded = qiNeeded[player.realmIndex]?.[player.miniStageIndex] || 0;
  advanceBtn.disabled = !(player.qi >= nextQiNeeded);
}, 1000);

setInterval(function() {
  if (!player.alive) return;
  player.age++; player.health = Math.max(player.health - 2, 0);
  if (player.health <= 0) {
    eventMsg.textContent = "You died! Your legacy passes to your descendant.";
    breakthroughMsg.textContent = "";
    addWorldNews("Player died. Descendant inherits legacy.", true);
    player = {
      name: "Descendant",
      age: 16,
      health: 100,
      talent: Math.max(2, Math.floor(player.talent * (0.7 + Math.random()*0.3))),
      relationships: Math.max(0, Math.floor(player.relationships * 0.5)),
      wealth: 50,
      spiritStones: Math.max(10, Math.floor(player.spiritStones * 0.5)),
      qi: Math.max(0, Math.floor(player.qi * 0.3)),
      qiPerSec: 1 + Math.max(2, Math.floor(player.talent * (0.7 + Math.random()*0.3))),
      realmIndex: Math.max(0, player.realmIndex - 1),
      miniStageIndex: 0,
      quests: [],
      alive: true,
      infamy: Math.floor(player.infamy * 0.7),
      kingdom: null
    };
    generateNPCPool();
    updateUI();
  }
}, 12000);

// ==== Life Actions ====
document.getElementById('studyBtn').onclick = function() {
  if (player.wealth >= 5) {
    player.wealth -= 5; player.talent += 1;
    eventMsg.textContent = "You studied hard! Talent increased.";
    addWorldNews("Player studied. Talent increased.");
  } else {
    eventMsg.textContent = "Not enough wealth to study.";
  }
  updateUI();
};
document.getElementById('trainBtn').onclick = function() {
  player.health = Math.max(player.health - 3, 0); player.qiPerSec += player.talent;
  eventMsg.textContent = "You trained. Qi/sec increased by your talent.";
  addWorldNews("Player trained. Qi/sec increased.");
  updateUI();
};
document.getElementById('workBtn').onclick = function() {
  player.wealth += 15; player.spiritStones += 4; player.health = Math.max(player.health - 2, 0);
  eventMsg.textContent = "You worked and earned money and Spirit Stones.";
  addWorldNews("Player worked. Wealth and Spirit Stones increased.");
  updateUI();
};
document.getElementById('restBtn').onclick = function() {
  player.health = Math.min(player.health + 6, 100);
  eventMsg.textContent = "You rested. Health restored.";
  addWorldNews("Player rested. Health restored.");
  updateUI();
};
document.getElementById('meetBtn').onclick = function() {
  let unknowns = npcPool.filter(npc=>!knownNPCs.some(k=>k.id===npc.id));
  if (unknowns.length) {
    let npc = randomFrom(unknowns);
    knownNPCs.push(npc);
    eventMsg.textContent = `You met ${npc.name} (${npc.label}, Talent:${npc.talent}).`;
    addWorldNews(`Player met ${npc.name} (${npc.label}, Talent:${npc.talent}).`);
  } else {
    eventMsg.textContent = "No new NPCs to meet.";
  }
  updateUI();
};
document.getElementById('cultivateBtn').onclick = function() {
  player.qi += 10*player.talent;
  player.health = Math.max(player.health - 1, 0);
  eventMsg.textContent = "You meditated. Qi increased.";
  addWorldNews("Player meditated. Qi increased.");
  updateUI();
};
advanceBtn.onclick = function() {
  let nextQiNeeded = qiNeeded[player.realmIndex]?.[player.miniStageIndex] || 0;
  if (player.qi < nextQiNeeded) {
    eventMsg.textContent = "Not enough Qi to advance!";
    return;
  }
  player.qi -= nextQiNeeded;
  player.miniStageIndex++;
  if (player.miniStageIndex >= miniStages.length) {
    player.miniStageIndex = 0;
    player.realmIndex++;
    breakthroughMsg.textContent = `Breakthrough! You advanced to ${mainRealms[player.realmIndex]}.`;
    addWorldNews(`Player broke through to ${mainRealms[player.realmIndex]}.`, true);
  } else {
    breakthroughMsg.textContent = `Advanced to ${miniStages[player.miniStageIndex]} stage of ${mainRealms[player.realmIndex]}.`;
    addWorldNews(`Player advanced to ${miniStages[player.miniStageIndex]} stage of ${mainRealms[player.realmIndex]}.`);
  }
  updateUI();
};

// ==== Relationships Panel ====
relationshipBtn.onclick = function() {
  renderKnownNPCPanel();
  npcPanel.style.display = "block";
};
closeNpcPanelBtn.onclick = function() {
  npcPanel.style.display = "none";
};
function renderKnownNPCPanel() {
  knownNpcListDiv.innerHTML = knownNPCs.length === 0 ? "<em>No known NPCs yet.</em>" :
    knownNPCs.filter(npc=>npc.alive).map(npc =>
      `<div class="npc-block ${npc.color}">
        <strong>${npc.name}</strong> (${npc.label}, Talent:${npc.talent}, ${npc.trait})
        <br>Relationship: ${npc.relationship}
        <br>Location: ${npc.location}
        <br>Affiliation: ${npc.affiliation}
      </div>`
    ).join("");
}

// ==== UI Update ====
function updateUI() {
  document.getElementById('playerNameDisplay').textContent = player.name;
  document.getElementById('wealthDisplay').textContent = player.wealth;
  document.getElementById('spiritStoneDisplay').textContent = player.spiritStones;
  document.getElementById('wealthDisplayBar').textContent = player.wealth;
  document.getElementById('spiritStoneDisplayBar').textContent = player.spiritStones;
  document.getElementById('talentDisplay').textContent = player.talent;
  document.getElementById('ageDisplay').textContent = player.age;
  document.getElementById('healthDisplay').textContent = player.health;
  document.getElementById('relDisplay').textContent = player.relationships;
  document.getElementById('qiDisplay').textContent = Math.floor(player.qi);
  document.getElementById('qpsDisplay').textContent = Math.floor(player.qiPerSec);
  document.getElementById('infamyDisplay').textContent = player.infamy;
  document.getElementById('realmDisplay').textContent = mainRealms[player.realmIndex] || "Peak";
  document.getElementById('miniStageDisplay').textContent = miniStages[player.miniStageIndex] || "";
  document.getElementById('ageBar').style.width = (clamp((player.age-16)/84,0,1)*100)+"%";
  document.getElementById('healthBar').style.width = (clamp(player.health/100,0,1)*100)+"%";
  document.getElementById('talentBar').style.width = (clamp(player.talent/10,0,1)*100)+"%";
  document.getElementById('wealthBar').style.width = (clamp(player.wealth/100,0,1)*100)+"%";
  document.getElementById('stoneBar').style.width = (clamp(player.spiritStones/100,0,1)*100)+"%";
  document.getElementById('relBar').style.width = (clamp(player.relationships/20,0,1)*100)+"%";
  let nextQiNeeded = qiNeeded[player.realmIndex]?.[player.miniStageIndex] || 100;
  document.getElementById('qiBar').style.width = (clamp(player.qi/nextQiNeeded,0,1)*100)+"%";
  document.getElementById('qpsBar').style.width = (clamp(player.qiPerSec/100,0,1)*100)+"%";
  document.getElementById('infamyBar').style.width = (clamp(player.infamy/100,0,1)*100)+"%";
  advanceBtn.disabled = !(player.qi >= nextQiNeeded);
}

// ==== Any Remaining Helpers & Events ====
// Random world event generator
function triggerRandomWorldEvent() {
  const events = [
    "A mysterious fog descends upon the land, lowering everyone's Qi gain.",
    "A traveling merchant visits your kingdom, offering rare treasures.",
    "A demon beast rampages in Spirit Forest!",
    "Heavenly blessings shower upon the cultivators. Talent increased for all!",
    "A war breaks out between Jade Kingdom and Iron Kingdom."
  ];
  const idx = Math.floor(Math.random() * events.length);
  worldEventBanner.textContent = events[idx];
  addWorldNews(events[idx], true);
  setTimeout(() => { worldEventBanner.textContent = ""; }, 7000);
}
setInterval(triggerRandomWorldEvent, 60000); // every 60 seconds

// Save/Load Buttons
if(document.getElementById('saveBtn')) {
  document.getElementById('saveBtn').onclick = saveGame;
}
if(document.getElementById('loadBtn')) {
  document.getElementById('loadBtn').onclick = loadGame;
}

// Initial UI Sync
updateUI();
renderWorldNews();
