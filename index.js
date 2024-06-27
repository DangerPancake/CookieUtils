import RenderLib from "../RenderLib/index.js";
import settings from "./settings";
import "./functions.js";
import { Vector, pseudoString, printAMessage, CountdownTitle, getCurrentArea, sendPingWaypoint, WorldInstance, GetEntitiesWithinAABB, MageCDR, EntityNBTData, updateTimer, fetchClassesFromTablist, GoldorClassTerminals } from "./functions.js";

//all variables are defined here in order to limit the chances of a memory leak occuring
let testBlock = null;
let range = -1;
let distance = 0;
let yaw = 0;
let pitch = 0;
let playerPos = null;
let unitvector = null;
let pingList = [];
let temp = 0;
let lastArea = null;
let counter = 0;

// Waypoint vars
let [width, height] = [1, 1];
let [red, green, blue, alpha] = [0, 0, 1, 1];
let phase = true;

let world = null;
const SHEEP_CLASS = Java.type('net.minecraft.entity.passive.EntitySheep').class;
let nearbySheep = undefined;
let Cooldown = false;
let Mage_Level = 41;
let RegularAbilityCD = 30; // mages guided sheep cd = 30s by default
let trueRegularAbilityCD = RegularAbilityCD * (1 - MageCDR(Mage_Level, true));
let dungeonClasses = null;
let currentClass = null;
let soloClass = null;

import PogObject from "../PogData/index.js";
let timerDisplay = null
let timer = trueRegularAbilityCD * 1000
let MEME = null
// try { MEME = new Sound({ source: "meme.ogg", volume: 1 })} catch (error) {MEME = null}

//renders pings
register('renderWorld', () => {
    for (let i = 0; i < pingList.length; i++) {
        let wp = pingList[i];
        let [wptype, wptext] = [wp.getType(), wp.getText()];
        let [wpx, wpy, wpz] = [Math.floor(wp.getX()), Math.floor(wp.getY()), Math.floor(wp.getZ())];
        [red, green, blue, alpha] = [settings.red, settings.green, settings.blue, 1];
        // draw Waypoint
        if (wptype == null || wptype == "BOX" || wptype == "null") {
            RenderLib.drawEspBox(wpx + 0.5, wpy, wpz + 0.5, width, height, red, green, blue, alpha, phase);
        } else if (wptype == "INNERBOX") {
            RenderLib.drawInnerEspBox(wpx + 0.5, wpy, wpz + 0.5, width, height, red, green, blue, alpha, phase);
        } else if (wptype == "BARITONEBOX") {
            RenderLib.drawBaritoneEspBox(wpx, wpy, wpz, width, height, red, green, blue, alpha, phase);
        } else {
            RenderLib.drawEspBox(wpx + 0.5, wpy, wpz + 0.5, width, height, red, green, blue, alpha, phase);
        }

        // draw Waypoint Text
        if (wptext == null || wptext == "null") {
            Tessellator.drawString(wp.getName(), wpx + 0.5, wpy + 1, wpz + 0.5);
        } else {
            Tessellator.drawString(wptext, wpx + 0.5, wpy + 1, wpz + 0.5);
        }
        
    }
});


// m7 p3 class assigned terminals
let GoldorClassTermsRegister = null;
let section = 0;

let GoldorEntryRegister = register("chat", (event) => {
    
    (function () { // disables GoldorClassTermsRegister if bossfight takes too long. Assumption: failed run
        setTimeout(() => {
            try {
                GoldorClassTermsRegister.unregister();
            } catch (err) { }
        }, (5*60*1000)); // disables after 5*60*1000 ms => 5Minutes
    })();



    section = 1;
    GoldorClassTerminals(settings.f7p3term1, settings.f7p3term2, settings.f7p3term3, settings.f7p3term4, settings.f7p3dev, section);



    GoldorClassTermsRegister = register("chat", (player, action, object, count, endcount, event) => {
        //ChatLib.chat(`Player ${player} ${action} the object ${object}. Count is: ${count} out of ${endcount}`);
        let ParsedCount = parseInt(count, 10);
        let ParsedEndcount = parseInt(endcount, 10);
        if (ParsedCount === ParsedEndcount) {
            section++;
            GoldorClassTerminals(settings.f7p3term1, settings.f7p3term2, settings.f7p3term3, settings.f7p3term4, settings.f7p3dev, section);
            //ChatLib.chat(`Next section reached! ${count}/${endcount} This will be section ${section} now.`);
            if (section === 5) { // reset values since p3 is completed now
                //ChatLib.chat("P3 successfully completed! Awaiting Necron now.");
                section = 0;
                GoldorClassTermsRegister.unregister();
                GoldorClassTermsRegister = null;
            }
        }
    }).setCriteria("${player} ${action} a ${object}! (${count}/${endcount}").setContains();

    
    

}).setCriteria("[BOSS] Storm: At least my son died by your hands.").setContains();

//GoldorClassTermsRegister.unregister();




















// m7 p5 dragon lb waypoints
register("chat", (event) => {
    if (settings.m7Drags && getCurrentArea() == "Catacombs") {
        sendPingWaypoint(26, 18, 92, "GREEN", " ", settings.addText, "/pc ");
        setTimeout(() => {
            sendPingWaypoint(82, 18, 96, "BLUE", " ", settings.addText, "/pc ");
        }, 200);
        setTimeout(() => {
            sendPingWaypoint(83, 18, 57, "ORANGE", " ", settings.addText, "/pc ");
        }, 400);
        setTimeout(() => {
            sendPingWaypoint(56, 20, 124, "PURPLE", " ", settings.addText, "/pc ");
        }, 600);
        setTimeout(() => {
            sendPingWaypoint(27, 18, 56, "RED", " ", settings.addText, "/pc ");
        }, 800);
    }
}).setCriteria("[BOSS] Wither King: We will decide it all, here, now.").setContains();

//dungeons updating class structure
register("chat", (event) => {
    dungeonClasses = fetchClassesFromTablist();
    for (let i = 0; i < dungeonClasses.length; i++) {
        if (dungeonClasses[i].player == Player.getName()) {
            currentClass = dungeonClasses[i].class
        }
    }
    soloClass = true
    for (let i = 0; i < dungeonClasses.length; i++) {
        if (dungeonClasses[i].class == currentClass && dungeonClasses[i].player != Player.getName()) {
            soloClass = false;
        } 
    }
    trueRegularAbilityCD = RegularAbilityCD * (1 - MageCDR(Mage_Level, soloClass));
}).setCriteria("[NPC] Mort: Here, I found this map when I first entered the").setContains();


// DESIGNATED TEST AREA
register("command", () => {
    ChatLib.chat("TESTING ZONEEEEE");
    // JUST THROW CODE HERE WE USE THIS AS DEBUGGING ZONE NOW
    GoldorClassTerminals(settings.f7p3term1, settings.f7p3term2, settings.f7p3term3, settings.f7p3term4, settings.f7p3dev, 1);
}).setName("test");



// POGDATA 
const data = new PogObject("CookieUtils", {
    x: 200,
    y: 100,
});
data.autosave();


register("renderOverlay", () => {
    if (settings.mageSheep) {
        Renderer.drawString(`Sheep Timer: ${timerDisplay} `, 200, 100, true);
    }
});

//called every tick
register("tick", () => {
    if (pingList.length != 0) {
        if (counter > 2) {
            if (getCurrentArea() != lastArea && lastArea != null) {
                pingList = [];
            }
            counter = 0;
            lastArea = getCurrentArea();
        }
        counter += 1;
    }
    currentClass = "Mage"
    //if we are doing the sheep cooldown stuff:
    if (Cooldown == false && getCurrentArea() == "Catacombs" && settings.mageSheep && currentClass == "Mage") {
        //fetch sheep around us
        nearbySheep = GetEntitiesWithinAABB(SHEEP_CLASS, 5);
        if (nearbySheep[0] != undefined) {
            Cooldown = true;
            //set the countdown to the max
            timer = trueRegularAbilityCD*1000
            updateSheepTimer()
            //after the countdown is over set cooldown to true
            setTimeout(() => {
                Cooldown = false;
            }, trueRegularAbilityCD * 1000); 
        }
    }
    if (timer == 0 || timer == null || timerDisplay == "0.00") {
        timerDisplay = "&2READY!!!&r"
    }
});

function updateSheepTimer() {
    // Format timer value as a float
    timerDisplay = parseFloat(`${Math.floor(timer / 1000)}.${Math.floor((timer % 1000) / 100)}${Math.floor((timer % 100) / 10)}`).toFixed(2).toString();
    timer -= 10
    if (timer >= 0) {
        setTimeout(updateSheepTimer, 10); // Call updateTime after 10 milliseconds
    }
}

//opens up the cookie utils GUI
register("command", (user) => {
    if (user == null || user == "" || user == "settings") {
        settings.openGUI();
    }
    if (user == "cp" || user == "clearping") {
        pingList = [];
    }
}).setName("cu").setAliases("cookieutils");

//creates a new ping depending on where the player is looking and posts it in chat
register("command", (user, text, type) => {
    if (user != null) {
        range = user;
    } else {
        if (settings.pingRange == 0) {
            range = -1;
        } else {
            range = settings.pingRange;
        }
    }
    
    if (text == null) {
        if (settings.pingText != null && settings.pingText != "") {
            text = settings.pingText;
        } else {
            text = "null";
        }
        
    }

    if (type == null) {
        if (settings.pingShape == 0) {
            type = "BOX";
        } else if (settings.pingShape == 1) {
            type = "INNERBOX";
        } else {
            type = "BARITONEBOX";
        }
    }

    playerPos = new Vector(Player.getX(), Player.getY() + 1.62, Player.getZ());
    yaw = Player.getYaw() * Math.PI / 180;
    pitch = Player.getPitch() * Math.PI / 180;
    unitvector = new Vector(-Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    testBlock = new Vector(playerPos.getX(), playerPos.getY(), playerPos.getZ());
    
    //creates a ray
    while (true) {
        distance = Math.sqrt(Math.pow(playerPos.x - testBlock.getX(), 2) + Math.pow(playerPos.y - testBlock.getY(), 2) + Math.pow(playerPos.z - testBlock.getZ(), 2))
        testBlock.add(unitvector);
        if (World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType() != "BlockType{name=minecraft:air}" || testBlock.getY() > 300 || testBlock.getY() < 0 || (range != -1 && distance >= range)) {
            break;
        }
    }
    
    //posting in chat
    if (testBlock.getY() < 300 && testBlock.getY() > 0) {

        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        sendPingWaypoint(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ()), text, type, settings.addText);
    } else {
        ChatLib.chat("No block found within maximum height.");
    }
    ChatLib.chat(TabList?.getNames()?.map(name => name?.removeFormatting())[41]);
}).setName("infos").setAliases("ping"); // use /infos ingame to get info!! btw i love people called makali

//fetches waypoints from other users
register("chat", (player, x, y, z, text, type, event) => {
    if (/to(?:\s+\w+)+:/i.test(player)) {
        player = Player.getName();
    } else {
        player = player.split(':')[0].trim().split(' ').pop();
    }
    temp = 0;
    if (settings.acceptPings || player == Player.getName()) {
        for (let i = 0; i < pingList.length; i++) {
            if (pingList[i].getName() == player && settings.onePing) {
                pingList.splice(i, 1);
                pingList.push(new Vector(x, y, z, player, text, type));

                if (settings.delete_waypoint_after != 0) {
                    setTimeout(() => {
                        pingList.splice(pingList.indexOf(r));
                    }, settings.delete_waypoint_after);
                }
                temp = 1;
                break;
            } else if (pingList[i].getText() == text && settings.onePingText && pingList[i].getName() == player) {
                pingList.splice(i, 1);
                pingList.push(new Vector(x, y, z, player, text, type));

                if (settings.delete_waypoint_after != 0) {
                    setTimeout(() => {
                        pingList.splice(pingList.indexOf(r));
                    }, settings.delete_waypoint_after);
                }
                temp = 1;
                break;
            }
        }
        if (temp == 0) {
            let r = new Vector(x, y, z, player, text, type)
            pingList.push(r);
            if (settings.delete_waypoint_after != 0) {
                setTimeout(() => {
                    pingList.splice(pingList.indexOf(r));
                }, settings.delete_waypoint_after);
            }
        }
        ChatLib.chat("Ping fetched from " + player);
        if (MEME != null) {
            //MEME.play();
        }
        
    }
}).setCriteria("${player}: x: ${x}, y: ${y}, z: ${z} t: ${text}, t:${type}. /cu").setContains();

//fetches waypoints from other users using !rwp
register("chat", (player, event) => {
    ChatLib.chat("eheheh");
    if (settings.selfPing) {
        sendPingWaypoint(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ()), "null", " ", settings.addText);
    }
}).setCriteria("${player}: !rwp").setContains();

//displays a countdown on your screen
let countDownActive = false;
register("chat", (seconds, event) => {
    if (countDownActive) return;
    CountdownTitle(seconds);
    countDownActive = true;
    setTimeout(() => {
        countDownActive = false;
    }, seconds);
}).setCriteria("!cdt ${seconds}").setContains();

/*
References
tablist = TabList?.getNames()?.map(name => name?.removeFormatting());
scoreboard = Scoreboard.getLines(true)?.map(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, ""));
*/
