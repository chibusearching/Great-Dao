// List of all cultivation realms in order
const realms = [
  "Third Rate Master",
  "Second Rate Master",
  "First Rate Master",
  "Peak Master",
  "Three Flowers Gather at the Summit",
  "Five Energies Converging at the Origin",
  "Ultimate Pinnacle",
  "Beyond the Path to Heaven (First Stage of Manifestation)",
  "Treading Heaven Beyond the Path (Second Stage of Manifestation)",
  "Beyond Treading Heavens (Third Stage of Manifestation)",
  "Fourth Stage of Manifestation",
  "Fifth Stage of Manifestation",
  "Qi Gathering",
  "Qi Refining",
  "Qi Building",
  "Core Formation",
  "Nascent Soul",
  "Heavenly Being",
  "Middle Boundary: Four Pillars",
  "Middle Boundary: Integration",
  "Middle Boundary: Star Shattering",
  "Middle Boundary: Star Rebirth",
  "Middle Boundary: Entering Nirvana",
  "Great Boundary: True Immortal"
];

// Realms with mini-stages
const realmsWithMiniStages = [
  "Third Rate Master",
  "Second Rate Master",
  "First Rate Master",
  "Peak Master",
  "Qi Gathering",
  "Qi Refining",
  "Qi Building",
  "Core Formation",
  "Nascent Soul",
  "Heavenly Being",
  "Middle Boundary: Four Pillars",
  "Middle Boundary: Integration",
  "Middle Boundary: Star Shattering",
  "Middle Boundary: Star Rebirth",
  "Middle Boundary: Entering Nirvana"
];

const miniStages = ["Early", "Middle", "Late"];

// Exponentially increasing Qi requirements (idle style)
// You can adjust the multiplier for faster/slower progression
const qiRequirements = [
  1000,      // Third Rate Master
  2500,      // Second Rate Master
  6000,      // First Rate Master
  15000,     // Peak Master
  40000,     // Three Flowers Gather at the Summit
  100000,    // Five Energies Converging at the Origin
  250000,    // Ultimate Pinnacle
  600000,    // Beyond the Path to Heaven...
  1500000,   // Treading Heaven Beyond the Path...
  3500000,   // Beyond Treading Heavens...
  8000000,   // Fourth Stage of Manifestation
  18000000,  // Fifth Stage of Manifestation
  40000000,  // Qi Gathering
  90000000,  // Qi Refining
  200000000, // Qi Building
  450000000, // Core Formation
  1000000000, // Nascent Soul
  2300000000, // Heavenly Being
  5200000000, // Middle Boundary: Four Pillars
  12000000000, // Middle Boundary: Integration
  27000000000, // Middle Boundary: Star Shattering
  60000000000, // Middle Boundary: Star Rebirth
  140000000000, // Middle Boundary: Entering Nirvana
  500000000000 // Great Boundary: True Immortal
];

// Player state
let realmIndex = 0;
let miniStageIndex = 0;
let heavenlyDaoDefeated = false; // For Great Boundary: True Immortal

// Get player's Qi
function getQi() {
  return parseInt(document.getElementById("qiDisplay").textContent, 10) || 0;
}

function updateRealmDisplay() {
  const realm = realms[realmIndex];
  document.getElementById("realmDisplay").textContent = realm;
  if (realmsWithMiniStages.includes(realm)) {
    document.getElementById("miniStageDisplay").textContent = miniStages[miniStageIndex] + " stage";
  } else {
    document.getElementById("miniStageDisplay").textContent = "";
  }
}

function askDeepQuestion(callback) {
  // Psychology/human/mind questions pool (add more as you like)
  const questions = [
    "What is the greatest fear that holds you back from reaching your full potential?",
    "If you could change one thing about your mind or your character, what would it be and why?",
    "Describe a time when you confronted a deeply held belief or bias. What happened?",
    "What do you believe is the true meaning of self-awareness?",
    "How do you find meaning in suffering or failure?"
  ];
  const question = questions[Math.floor(Math.random() * questions.length)];
  let answer = prompt(`Three Flowers Gather at the Summit requires reflection:\n\n${question}\n\nEnter your answer:`);

  callback(answer || "");
}

function analyzeAnswer(answer) {
  // Simple analysis: longer and more thoughtful answers give more advancement
  if (!answer.trim()) return 1;
  if (answer.length > 150 && /I|me|my|self|believe|think|feel/i.test(answer)) return 3;
  if (answer.length > 60) return 2;
  return 1;
}

document.getElementById("advanceBtn").onclick = function() {
  const realm = realms[realmIndex];
  let breakthroughMsg = document.getElementById("breakthroughMsg");
  breakthroughMsg.textContent = "";

  // Great Boundary: True Immortal requirement
  if (realm === "Great Boundary: True Immortal" && !heavenlyDaoDefeated) {
    let confirmFight = confirm("To advance, you must defeat the Heavenly Dao. Attempt challenge?");
    if (confirmFight) {
      let win = Math.random() > 0.6; // 40% chance to win, idle style
      if (win) {
        heavenlyDaoDefeated = true;
        breakthroughMsg.textContent = "You have defeated the Heavenly Dao! You ascend to the peak!";
        // You could auto-advance, or require another click
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
    breakthroughMsg.textContent = `You need at least ${qiRequired.toLocaleString()} Qi to advance (${playerQi.toLocaleString()}/${qiRequired.toLocaleString()}).`;
    return;
  }

  // Special: Three Flowers Gather at the Summit
  if (realm === "Three Flowers Gather at the Summit") {
    askDeepQuestion(function(answer) {
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
};

// Example: increment age on "Advance"
document.getElementById("advanceBtn").addEventListener("click", function() {
  let ageElem = document.getElementById("ageDisplay");
  let age = parseInt(ageElem.textContent, 10);
  ageElem.textContent = age + 1;
});

// On page load, show initial realm
window.onload = function() {
  updateRealmDisplay();
  document.getElementById("wealthDisplayBar").textContent = "50";
  document.getElementById("spiritStoneDisplayBar").textContent = "15";
};

// Example diamond button handlers (expand as you wish)
document.getElementById("studyBtn").onclick = function() {
  alert("You studied and gained knowledge!");
};
document.getElementById("trainBtn").onclick = function() {
  alert("You trained and gained strength!");
};
document.getElementById("workBtn").onclick = function() {
  alert("You worked and earned some wealth!");
};
document.getElementById("restBtn").onclick = function() {
  alert("You rested and regained some health!");
};
document.getElementById("meetBtn").onclick = function() {
  alert("You met someone interesting!");
};
document.getElementById("cultivateBtn").onclick = function() {
  // Example: Increase Qi by 10,000 per cultivate
  let qiElem = document.getElementById("qiDisplay");
  let currentQi = parseInt(qiElem.textContent, 10) || 0;
  qiElem.textContent = currentQi + 10000;
  alert("You cultivated and your Qi increased by 10,000!");
};
document.getElementById("relationshipBtn").onclick = function() {
  document.getElementById("npcPanel").style.display = "block";
};
document.getElementById("closeNpcPanel").onclick = function() {
  document.getElementById("npcPanel").style.display = "none";
};
document.getElementById("worldBtn").onclick = function() {
  document.getElementById("worldTab").style.display = "block";
};
document.getElementById("closeWorldTab").onclick = function() {
  document.getElementById("worldTab").style.display = "none";
};
document.getElementById("worldNewsBtn").onclick = function() {
  document.getElementById("worldNewsPanel").style.display = "block";
};
document.getElementById("closeWorldNewsBtn").onclick = function() {
  document.getElementById("worldNewsPanel").style.display = "none";
};
// Save/Load buttons are left for your implementation
