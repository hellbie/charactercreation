var IMPLANT = [
    { // i0
        "name": "Électrospatiale Hydramodul Mk1",
        "type": "implantArms",
        "desc": "A prototype model of the KTUC-AF Hydraulic Arms, one of the first of its kind.",
        "cooldown": 10,
        "cooldowntrigger": "Exhaustion: Disabled for 10 seconds after critical successes.",
        "effect": ["msk", "nch"],
        "stats": {
            "msk": [2, 3, 0, 0, 0, 0, 0],
            "nch": [-1, 0, 0, 0, 0, 0, 0]
        }
    }
];
var IMPLANT_AREAS = ["implantArms", "implantLegs"];

var WEAPON = [
    { // w0
        "name": "Bare Fists",
        "type": "melee",
        "desc": "Your own arms.",
        "stat": "msk",
        "statreq": 1, // muscloskeletal must at least be 1 for this weapon
        "dmgstatic": 0,
        "dmgroll": 1 // 1d10 + muscloskeletal stat 
    },
    { // w1
        "name": "Crowbar",
        "type": "melee",
        "desc": "A crowbar.",
        "stat": "msk",
        "statreq": 4, // muscloskeletal must at least be 3 for this weapon
        "dmgstatic": 3,
        "dmgroll": 2 // 3 + 2d10 + muscloskeletal stat
    },
    { // w2
        "name": "Saotek K52R1",
        "type": "precisionpistol",
        "desc": "A firearm model from Saotek, a subsidiary of KTUC-AF.",
        "stat": "ref",
        "statreq": 3, // reflex must at least be 3 for this weapon
        "dmgstatic": 15,
        "dmgroll": 1 // 5 + 4d10 * body part multiplier
    }
];
var WEAPON_AREAS = ["melee", "precisionpistol", "precisionrifle", "automaticpistol", "automaticrifle"];

var WEAPON_AREA_VERBOSE_DICT = {
    "melee": "Melee",
    "precisionpistol": "Precision Pistol",
    "precisionrifle": "Precision Rifle",
    "automaticpistol": "Automatic Pistol",
    "automaticrifle": "Automatic Rifle"
};

var ARMOR = [
    { // a0
        "name": "KTUC-AF Mercenary Grade Ballistic Vest",
        "type": "chest",
        "desc": "Issued for KTUC-AF Mercenaries.",
        "staticNegation": 2,
        "rollNegation": 3
    }
];

var ARMOR_AREAS = ["chest", "head", "legs", "arms", "feet"];

var ARMOR_AREA_VERBOSE_DICT = {
    "chest": "Chest",
    "head": "Head",
    "legs": "Legs",
    "arms": "Arms",
    "feet": "Feet"
};

var JUNK = [
    {
        "name": "Bottle of Bleach",
        "desc": "A bottle of Bleach."
    }   
];

function itemRefer(id) {

    switch (id[0]) {
        case "w":
            return WEAPON[Number(id.slice(1))];
        case "i":
            return IMPLANT[Number(id.slice(1))];
        case "a":
            return ARMOR[Number(id.slice(1))];
        default:
            return JUNK[Number(id.slice(1))];
    }
}

function addToCharacter(id) {
    if (!(char.inventory.includes(id))) {
        char.inventory.push(id);
        q("#invBox").appendChild(createDocElementWeapon(id));
    }
}

function removeFromCharacter(id) {
    char.inventory.splice(char.inventory.indexOf(id), char.inventory.indexOf(id) + 1);
}

function removeFromEquipped(id) {
    char.equipped.splice(char.equipped.indexOf(id), char.equipped.indexOf(id) + 1);
}

function calculateDmgNegations(check=char) {
    var staticN = 0;
    var rollN = 0;
    for (var rep = 0; rep < ARMOR_AREAS.length; rep++) {
        if (check.armor[ARMOR_AREAS[rep]] != "") {
            staticN += itemRefer(check.armor[ARMOR_AREAS[rep]]).staticNegation;
            rollN += itemRefer(check.armor[ARMOR_AREAS[rep]]).rollNegation;
        }
    }
    if (check == char) {
        q("#stdN").innerText = staticN;
        q("#rdN").innerText = rollN;
    }
    return [staticN, rollN];
}

function calculateDmg(check=char) {
    var staticDmg = 0;
    var rolls = 0;
    if (check.weapon != []) {
        staticDmg += itemRefer(check.weapon[0]).dmgstatic;
        rolls += itemRefer(check.weapon[0]).dmgroll;
    }
    if (check == char) {
        staticDmg += check.stats[itemRefer(check.weapon[0]).stat][0];
        q("#stdN").innerText = staticN;
        q("#rdN").innerText = rollN;
    }
    return [staticDmg, rolls];
}

function equip(id) {
    if (char.inventory.includes(id) && !(char.equipped.includes(id))) {
        switch (id[0]) {
            case "w":
                try {
                    q(".w" + char.weapon[0]).classList.remove("equipped");
                    removeFromEquipped("w" + char.weapon[0]);
                    char.equipped.push(id);
                }
                catch {
                    char.equipped.push(id);
                }
                var weaponDmgRollStr = (itemRefer(id).dmgstatic + char.stats[itemRefer(id).stat][0]) + " + " + itemRefer(id).dmgroll + "d10";
                q("#selectedW").innerText = itemRefer(id).name;
                q("#selectedWStat").innerText = statnamedict[itemRefer(id).stat];
                q("#selectedWRoll").innerText = weaponDmgRollStr;
                q("." + id).classList.add("equipped");

                char.weapon = [Number(id.slice(1))];
                break;
            case "i":
                try {
                    removeFromEquipped(id);
                }
                catch {
                    char.equipped.push(id);
                }
                char.implants.push([Number(id.slice(1))]);
                break;
            case "a":
                var equipSlot = itemRefer(id).type;
                if (char.armor[equipSlot] != "") {
                    q(".a" + char.armor[equipSlot]).classList.remove("equipped");
                    removeFromEquipped("a" + char.armor[equipSlot]);
                }
                char.armor[equipSlot] = id;
                char.equipped.push(id);
                calculateDmgNegations();
                q("." + id).classList.add("equipped");
                break;
            default:
                break;
        }
    }
}

function qIT(content) {
    var qitp = document.createElement("div");
    qitp.innerHTML = "<i>" + content + "</i>";
    return qitp;
}

function createDocElementWeapon(id) {
    var itemInfo = itemRefer(id);
    var par = document.createElement("div");
    par.classList = "itemBox";
    par.classList.add(id);
    par.classList.add("type" + id[0]);
    var title = document.createElement("div");
    title.classList = "h3";
    title.innerText = itemInfo.name;
    var description = document.createElement("div");
    var weaponDmgRollStr = (itemInfo.dmgstatic + char.stats[itemInfo.stat][0]) + " + " + itemInfo.dmgroll + "d10";
    description.innerText = itemInfo.desc
    par.appendChild(title);
    switch (id[0]) {
        case "w":
            par.appendChild(qIT("Attack Stat: " + statnamedict[itemInfo.stat]));
            par.appendChild(qIT("Equip Threshold: " + itemInfo.statreq));
            par.appendChild(qIT("Damage Roll: " + weaponDmgRollStr));
            break;
        case "i":
            // todo: implement implants
            break;
        case "a":
            par.appendChild(qIT("Static Damage Negation: " + itemInfo.staticNegation))
            par.appendChild(qIT("Rolled Damage Negation: " + itemInfo.rollNegation))
            break;
        default:
            break;
    }

    par.appendChild(description);
    par.onclick = function () {
        const wid = id;
        equip(wid);
    }
    return par;
}