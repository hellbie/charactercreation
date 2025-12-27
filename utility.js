function q(m) {
    return document.querySelector(m);
}
currentSheet = "characterSheet";

function switchSheet(sheet) {
    document.getElementById(currentSheet).style.display = "none";
    document.getElementById(sheet).style.display = "";
    document.getElementById("select" + currentSheet).classList = "";
    document.getElementById("select" + sheet).classList = "current";
    currentSheet = sheet;
}

var statnamearray = ["msk", "ref", "cal", "imm", "hom", "lif", "ded", "nch", "spc", "mem"];


for (var j = 0; j < document.querySelectorAll(".tools").length; j++) {
    const apricot = statnamearray[j];
    document.querySelectorAll(".tools")[j].onmousewheel = function (e) {
        e.preventDefault()
        valAdd(apricot, -Math.sign(e.deltaY));
    }
}
for (var j = 0; j < document.querySelectorAll(".substat > div").length; j++) {
    var el = document.querySelectorAll(".substat > div")[j];
    const apricot = el.getAttribute("skillid");
    const chestnut = el.parentElement.getAttribute("skill");
    el.onmousewheel = function (e) {
        e.preventDefault();
        valMinorAdd(chestnut, apricot, -Math.sign(e.deltaY));
    }
    el.onclick = function (e) {
        valMinorAdd(chestnut, apricot, -(e.button - 1));
    }
    el.oncontextmenu = function (e) {
        e.preventDefault();
        valMinorAdd(chestnut, apricot, -1);
    }
}

function GETSTORAGE() {
    return window.top.location.hash.substring(1);
}

if (GETSTORAGE() != "") {
    char = JSON.parse(atob(GETSTORAGE()));
}
renderChangesComplete();
function SAVESTORAGE() {
    char.name = q("#name").innerText;
    window.top.location.hash = btoa(JSON.stringify(char));
}

q("#cpc").onmousewheel = function (e) {
    e.preventDefault();
    if (char.statpool - 2 * Math.sign(e.deltaY) >= 0 && char.cpc - Math.sign(e.deltaY > 0)) {
        char.statpool -= 2 * Math.sign(e.deltaY);
        char.cpc -= Math.sign(e.deltaY);
    }
    renderChanges();
}
q("#cpc").onclick = function (e) {
    char.statpool += 2;
    char.cpc += 1;
    renderChanges();
}
q("#cpc").oncontextmenu = function (e) {
    e.preventDefault();
    if (char.statpool - 2 >= 0 && char.cpc - 1 > 0) {
        char.statpool -= 2;
        char.cpc -= 1;
        renderChanges();
    }
}

function renderChanges() {
    q("#stat").innerText = char.statpool;
    q("#health").innerText = char.health;
    calcAvg();
    q("#cpc").innerText = char.cpc;
    q("#activeTime").innerText = 3 / char.cpc;
    var weaponDmgRollStr = itemRefer(char.weapon[0]).dmgstatic + " + " + itemRefer(char.weapon[0]).dmgroll + "d10";
    q("#selectedW").innerText = itemRefer(char.weapon[0]).name;
    q("#selectedWStat").innerText = statnamedict[itemRefer(char.weapon[0]).stat];
    q("#selectedWRoll").innerText = weaponDmgRollStr;
}

function renderChangesComplete() {
    q("#name").innerText = char.name;
    renderChanges();
    for (var repeater = 0; repeater < statnamearray.length; repeater++) {
        document.getElementById(statnamearray[repeater]).innerText = char.stats[statnamearray[repeater]][0];
        for (var minor = 1; minor < 7; minor++) {
            try {
                document.getElementById("s" + statnamearray[repeater] + minor).innerText = char.stats[statnamearray[repeater]][minor];
            }
            catch {
                break;
            }
        }
        getSkillPool(statnamearray[repeater]);
    }
    for (var repeater = 0; repeater < char.inventory.length; repeater++) {
        q("#invBox").appendChild(createDocElementWeapon(char.inventory[repeater]));
    }
    for (var repeater = 0; repeater < char.equipped.length; repeater++) {
        q("." + char.equipped[repeater]).classList.add("equipped");
    }
}
