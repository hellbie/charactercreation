var char = {
    "name": "CHARACTER NAME",
    "health": 5,
    "cpc": 1,
    "exp": 0,
    "statpool": 25,
    "ammo": 0, // how much ammo left
    "inventory": ["w0"],
    "equipped": ["w0"],
    "weapon": ["w0"],
    "armor": {
        "chest": "",
        "head": "",
        "legs": "",
        "arms": "",
        "feet": ""
    },
    "implants": [],
    "stats": {
        "msk": [1, 0, 0, 0, 0, 0, 0],
        "ref": [1, 0, 0, 0, 0, 0, 0],
        "cal": [1, 0, 0, 0, 0, 0, 0],
        "imm": [1, 0, 0, 0, 0, 0, 0],
        "hom": [1, 0, 0, 0, 0, 0, 0],
        "mem": [1, 0, 0, 0, 0, 0, 0],
        "lif": [1, 0, 0, 0, 0, 0, 0],
        "ded": [1, 0, 0, 0, 0, 0, 0],
        "nch": [1, 0, 0, 0, 0, 0, 0],
        "spc": [1, 0, 0, 0, 0, 0, 0],
    }
};

var statnamedict = {
    "msk": "Muscloskeletal",
    "ref": "Reflexes",
    "cal": "Calorimetrics",
    "imm": "Immune System",
    "hom": "Homeostasis",
    "lif": "Linguistic Factory",
    "ded": "Deduction",
    "nch": "Neurochemistry",
    "spc": "Sensory Processing",
    "mem": "Memory"
};
var statfuncdict = {
    "msk": function(arg){},
    "ref": function(arg){},
    "cal": function(arg){
        char.health += 5 * arg;
    },
    "imm": function(arg){},
    "hom": function(arg){},
    "lif": function(arg){},
    "ded": function(arg){},
    "nch": function(arg){},
    "spc": function(arg){},
    "mem": function(arg){}
};
var cavg = 1;
var pavg = 1;

function calcStatpool() {
    return (pavg + cavg) * 5 + char.statpool;
}
function calcAvg() {
    pavg = (char.stats["msk"][0] + char.stats["ref"][0] + char.stats["cal"][0] + char.stats["imm"][0] + char.stats["hom"][0]) / 5;
    cavg = (char.stats["mem"][0] + char.stats["lif"][0] + char.stats["ded"][0] + char.stats["nch"][0] + char.stats["spc"][0]) / 5;
    q("#cavg").innerText = Math.floor(cavg);
    q("#pavg").innerText = Math.floor(pavg);
}

function getSkillPool(str) {
    var arr = char.stats[str];
    var sum = 0;
    arr.forEach(x => {
        sum += x;
    });
    q("#s-" + str).innerText = arr[0] * 3 - (sum - arr[0]);
    return arr[0] * 3 - (sum - arr[0]);
}
function valAdd(str, add = 1) {
    var curVal = char.stats[str][0]; // get major skill value
    if (curVal + add >= 1 && char.statpool - add >= 0 && getSkillPool(str) + add * 3 > 0 && curVal + add < 11) {
        curVal += add;
        char.statpool -= add;
        char.stats[str][0] = curVal; // set major skill value
        document.getElementById(str).innerText = curVal;
        statfuncdict[str](Math.sign(add));
    }
    SAVESTORAGE();
    getSkillPool(str);
    renderChanges();
}
function valMinorAdd(str, id, add = 1) {
    var curVal = char.stats[str][id]; // get skill value
    if (curVal + add >= 0 && getSkillPool(str) - add >= 0 && curVal + add < 11) {
        curVal += add;
        char.stats[str][id] = curVal; // set skill value
        document.getElementById("s" + str + id).innerText = curVal;
    }
    SAVESTORAGE();
    getSkillPool(str);
    renderChanges();
}