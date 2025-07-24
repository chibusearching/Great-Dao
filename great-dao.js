// --- REALMS, QI, LIFESPAN TABLES (as before) ---
const realms = [
  "Third Rate Master", "Second Rate Master", "First Rate Master", "Peak Master",
  "Three Flowers Gather at the Summit", "Five Energies Converging at the Origin", "Ultimate Pinnacle",
  "Beyond the Path to Heaven (First Stage of Manifestation)", "Treading Heaven Beyond the Path (Second Stage of Manifestation)",
  "Beyond Treading Heavens (Third Stage of Manifestation)", "Fourth Stage of Manifestation", "Fifth Stage of Manifestation",
  "Qi Gathering", "Qi Refining", "Qi Building", "Core Formation", "Nascent Soul", "Heavenly Being",
  "Middle Boundary: Four Pillars", "Middle Boundary: Integration", "Middle Boundary: Star Shattering",
  "Middle Boundary: Star Rebirth", "Middle Boundary: Entering Nirvana", "Great Boundary: True Immortal"
];

const realmsWithMiniStages = [
  "Third Rate Master", "Second Rate Master", "First Rate Master", "Peak Master",
  "Qi Gathering", "Qi Refining", "Qi Building", "Core Formation", "Nascent Soul", "Heavenly Being",
  "Middle Boundary: Four Pillars", "Middle Boundary: Integration", "Middle Boundary: Star Shattering",
  "Middle Boundary: Star Rebirth", "Middle Boundary: Entering Nirvana"
];
const miniStages = ["Early", "Middle", "Late"];

const qiRequirements = [
  1000, 2500, 6000, 15000, 40000, 100000, 250000, 600000, 1500000, 3500000,
  8000000, 18000000, 40000000, 90000000, 200000000, 450000000, 1000000000,
  2300000000, 5200000000, 12000000000, 27000000000, 60000000000, 140000000000, 500000000000
];

// Lifespan per realm
const realmLifespans = [
  120, 180, 250, 400, 600, 900, 1300, 2000, 3200, 5000, 8000,
  13000, 20000, 33000, 52000, 80000, 130000, 200000, 320000, 520000,
  830000, 1350000, 2200000, Infinity // True Immortal is truly immortal!
];

// --- PLAYER STATE ---
let realmIndex = 0;
let miniStageIndex = 0;
let heavenlyDaoDefeated = false;
let generation = 1; // Track current generation

// --- UTILS ---
function getQi() {
  return parseInt(document.getElementById("qiDisplay").textContent, 10) || 0;
}
function setQi(qi) {
  document.getElementById("qiDisplay").textContent = qi;
}
function getTalent() {
  return parseInt(document.getElementById("talentDisplay").textContent, 10) || 0;
}
function setTalent(tal) {
  document.getElementById("talentDisplay").textContent = tal;
}
function getAge() {
  return parseInt(document.getElementById("ageDisplay").textContent, 10) || 0;
}
function setAge(age) {
  document.getElementById("ageDisplay").textContent = age;
}
function resetHealth() {
  document.getElementById("healthDisplay").textContent = 100;
}
function updateRealmDisplay() {
  const realm = realms[realmIndex];
  document.getElementById("realmDisplay").textContent = realm;
  if (realmsWithMiniStages.includes(realm)) {
    document.getElementById("miniStageDisplay").textContent = miniStages[miniStageIndex] + " stage";
  } else {
    document.getElementById("miniStageDisplay").textContent = "";
  }
  // Show lifespan info
  document.getElementById("lifespanDisplay").textContent = realmLifespans[realmIndex] === Infinity
    ? "∞"
    : realmLifespans[realmIndex] + " yrs";
  // Show generation
  document.getElementById("generationDisplay").textContent = generation;
}

// --- DEEP QUESTION SYSTEM ---
function askDeepQuestion(callback) {
  const questions = [
    "What is the greatest fear that holds you back from reaching your full potential?",
    "If you could change one thing about your mind or your character, what would it be and why?",
    "Describe a time when you confronted a deeply held belief or bias. What happened?",
    "What do you believe is the true meaning of self-awareness?",
    "How do you find meaning in suffering or failure?"
  ];
  const question = questions[Math.floor(Math.random() * questions.length)];
  let answer = prompt(
    `Three Flowers Gather at the Summit requires reflection:\n\n${question}\n\nEnter your answer:`
  );
  callback(answer || "");
}
function analyzeAnswer(answer) {
  if (!answer.trim()) return 1;
  if (answer.length > 150 && /I|me|my|self|believe|think|feel/i.test(answer)) return 3;
  if (answer.length > 60) return 2;
  return 1;
}

// --- ADVANCE LOGIC (manual and auto) ---
function tryAdvanceRealmOrStage(isAuto = false) {
  const realm = realms[realmIndex];
  let breakthroughMsg = document.getElementById("breakthroughMsg");
  breakthroughMsg.textContent = "";

  // Great Boundary: True Immortal requirement
  if (realm === "Great Boundary: True Immortal" && !heavenlyDaoDefeated) {
    if (isAuto) return; // Don't auto-advance at this realm!
    let confirmFight = confirm("To advance, you must defeat the Heavenly Dao. Attempt challenge?");
    if (confirmFight) {
      let win = Math.random() > 0.6;
      if (win) {
        heavenlyDaoDefeated = true;
        breakthroughMsg.textContent = "You have defeated the Heavenly Dao! You ascend to the peak!";
      } else {
        breakthroughMsg.textContent = "You failed to defeat the Heavenly Dao. Try again after preparing!";
      }
    } else {
      breakthroughMsg.textContent = "You must face the Heavenly Dao to advance.";
    }
    return;
  }

  // Qi requirement check (skip for Heavenly Dao challenge)
  const qiRequired = qiRequirements[realmIndex];
  const playerQi = getQi();
  if (playerQi < qiRequired) {
    if (!isAuto) {
      breakthroughMsg.textContent =
        `You need at least ${qiRequired.toLocaleString()} Qi to advance (${playerQi.toLocaleString()}/${qiRequired.toLocaleString()}).`;
    }
    return;
  }

  // Special: Three Flowers Gather at the Summit
  if (realm === "Three Flowers Gather at the Summit") {
    if (isAuto) return; // Don't auto-advance at this realm!
    askDeepQuestion(function (answer) {
      let advanceRealms = analyzeAnswer(answer);
      breakthroughMsg.textContent = `Your reflection allows you to advance ${advanceRealms} time(s)!`;
      let nextIndex = realmIndex + advanceRealms;
      if (nextIndex >= realms.length) nextIndex = realms.length - 1;
      realmIndex = nextIndex;
      miniStageIndex = 0;
      updateRealmDisplay();
    });
    return;
  }

  // Normal mini-stage/realm progression
  if (realmsWithMiniStages.includes(realm)) {
    if (miniStageIndex < miniStages.length - 1) {
      miniStageIndex++;
      breakthroughMsg.textContent = `Advanced to ${miniStages[miniStageIndex]} stage of ${realm}.`;
    } else {
      if (realmIndex < realms.length - 1) {
        realmIndex++;
        miniStageIndex = 0;
        updateRealmDisplay();
        breakthroughMsg.textContent = `Breakthrough! Entered ${realms[realmIndex]}.`;
        return;
      } else {
        breakthroughMsg.textContent = "You have reached the peak of cultivation!";
        return;
      }
    }
  } else {
    if (realmIndex < realms.length - 1) {
      realmIndex++;
      miniStageIndex = 0;
      breakthroughMsg.textContent = `Breakthrough! Entered ${realms[realmIndex]}.`;
    } else {
      breakthroughMsg.textContent = "You have reached the peak of cultivation!";
      return;
    }
  }
  updateRealmDisplay();
}

// --- AGING, LIFESPAN, DEATH/LEGACY ---
function checkLifespan() {
  const age = getAge();
  const lifespan = realmLifespans[realmIndex];
  if (age >= lifespan && lifespan !== Infinity) {
    // Death! Trigger legacy
    triggerGenerationLegacy();
    return true;
  }
  return false;
}

function triggerGenerationLegacy() {
  // Save legacy (e.g., 20% of current Qi and +1 talent carry over)
  const oldQi = getQi();
  const oldTalent = getTalent();
  const newQi = Math.floor(oldQi * 0.2);
  const newTalent = oldTalent + 1;

  // Reset stats
  setAge(16);
  setQi(newQi);
  setTalent(newTalent);
  resetHealth();
  // Reset realm & stages
  realmIndex = 0;
  miniStageIndex = 0;
  heavenlyDaoDefeated = false;
  generation++;
  
  // Notify
  document.getElementById("breakthroughMsg").textContent =
    `You died of old age. Your legacy continues as generation ${generation}! (+1 Talent, 20% Qi carried)`;

  updateRealmDisplay();
}

// --- TICK SYSTEM ---
function gameTick() {
  // Increase age by 1 every tick (e.g., 5 seconds)
  setAge(getAge() + 1);

  // Check lifespan and handle legacy if needed
  if (!checkLifespan()) {
    // Optionally, try to auto-advance realm if enough Qi
    // (Uncomment the next line to allow idle auto-advancement)
    // tryAdvanceRealmOrStage(true);
  }
}
setInterval(gameTick, 5000); // 1 year = 5 seconds

// --- MANUAL ADVANCE BUTTON ---
document.getElementById("advanceBtn").onclick = function () {
  setAge(getAge() + 1); // Manual advance also ages you
  tryAdvanceRealmOrStage(false);
};

// --- ON LOAD ---
window.onload = function () {
  updateRealmDisplay();
  document.getElementById("wealthDisplayBar").textContent = "50";
  document.getElementById("spiritStoneDisplayBar").textContent = "15";
  setAge(16);
  document.getElementById("generationDisplay").textContent = generation;
};

// --- CULTIVATE BUTTON: Gain Big Qi ---
document.getElementById("cultivateBtn").onclick = function () {
  let qiElem = document.getElementById("qiDisplay");
  let currentQi = parseInt(qiElem.textContent, 10) || 0;
  qiElem.textContent = currentQi + 10000;
  alert("You cultivated and your Qi increased by 10,000!");
};

// --- OTHER BUTTONS (unchanged) ---
document.getElementById("studyBtn").onclick = function () {
  alert("You studied and gained knowledge!");
};
document.getElementById("trainBtn").onclick = function () {
  alert("You trained and gained strength!");
};
document.getElementById("workBtn").onclick = function () {
  alert("You worked and earned some wealth!");
};
document.getElementById("restBtn").onclick = function () {
  alert("You rested and regained some health!");
};
document.getElementById("meetBtn").onclick = function () {
  alert("You met someone interesting!");
};
document.getElementById("relationshipBtn").onclick = function () {
  document.getElementById("npcPanel").style.display = "block";
};
document.getElementById("closeNpcPanel").onclick = function () {
  document.getElementById("npcPanel").style.display = "none";
};
document.getElementById("worldBtn").onclick = function () {
  document.getElementById("worldTab").style.display = "block";
};
document.getElementById("closeWorldTab").onclick = function () {
  document.getElementById("worldTab").style.display = "none";
};
document.getElementById("worldNewsBtn").onclick = function () {
  document.getElementById("worldNewsPanel").style.display = "block";
};
document.getElementById("closeWorldNewsBtn").onclick = function () {
  document.getElementById("worldNewsPanel").style.display = "none";
};
// Save/Load buttons are left for your implementation
