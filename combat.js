testEnemyStat = {
    "name": "Enemy Name",
    "health": 1,
    "stats": {
        "acr": 0, // accelerative reckoning
        "amg": 0, // amygdalomodulation
        "kia": 0 // kinetic absorption
    },
    "armor": {
        "chest": "",
        "head": "",
        "legs": "",
        "arms": "",
        "feet": ""
    },
    "weapon": []
}

testMercenary = {
    "name": "Mercenary",
    "maxhealth": 20,
    "curhealth": 0,
    "attackroll": 5,
    "stats": {
        "acr": 0, // accelerative reckoning
        "amg": 0, // amygdalomodulation
        "kia": 0 // kinetic absorption
    },
    "armor": {
        "chest": "a0",
        "head": "",
        "legs": "",
        "arms": "",
        "feet": ""
    },
    "weapon": ["w1"]
}

function calcEnemyAttackRoll() {return testMercenary.attackroll + " - " + testMercenary.stats.acr};

function calcEnemyDamageRoll() {return calculateDmg(testMercenary)[0] + " - " + testMercenary.stats.kia + " + (" + calculateDmg(testMercenary)[1] + " - " + testMercenary.stats.amg + ")d10"}

function renderEnemy() {
    q("#enemyName").innerText = testMercenary.name;
    q("#enemyAttack").innerText = calcEnemyAttackRoll();
    q("#enemyDamage").innerText = calcEnemyDamageRoll();
}

renderEnemy()