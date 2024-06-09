import RenderLib from "../RenderLib/index.js";
import settings from "./settings";
import "./functions.js";
import { Vector, pseudoString, printAMessage } from "./functions.js";

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

//renders pings
register('renderWorld', () => {
    for (let i = 0; i < pingList.length; i++) {
        let wp = pingList[i];
        let [wptype, wptext] = [wp.getType(), wp.getText()];
        let [wpx, wpy, wpz] = [Math.floor(wp.getX()), Math.floor(wp.getY()), Math.floor(wp.getZ())];
        [red, green, blue, alpha] = [settings.red, settings.green, settings.blue, 1];
        // draw Waypoint
        if (wptype == null || wptype == "BOX") {
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

register("chat", (dragon, event) => {
    if (settings.m7Drags) {
        if (dragon == "APEX") {
            printAMessage("pc x: 26, y: 18, z: 92 t: GREEN, t:BOX. Generated using Cookie Utils / cu", settings.addText);
        } else if (dragon == "ICE") {
            printAMessage("pc x: 82, y: 18, z: 96 t: BLUE, t:BOX. Generated using Cookie Utils /cu", settings.addText);
        } else if (dragon == "FLAME") {
            printAMessage("pc x: 83, y: 18, z: 57 t: ORANGE, t:BOX. Generated using Cookie Utils /cu", settings.addText);
        } else if (dragon == "SOUL") {
            printAMessage("pc x: 56, y: 20, z: 124 t: SOUL, t:BOX. Generated using Cookie Utils /cu", settings.addText);
        } else if (dragon == "POWER") {
            printAMessage("pc x: 27, y: 18, z: 56 t: RED, t:BOX. Generated using Cookie Utils /cu", settings.addText);
        }
    }
}).setCriteria("The ${dragon} dragon is spawning!").setContains();

//called every tick
register("tick", () => {
    if (pingList.length != 0) {
        if (counter > 2) {
            if (TabList?.getNames()?.map(name => name?.removeFormatting())[41] != lastArea && lastArea != null) {
                pingList = [];
            }
            counter = 0;
            lastArea = TabList?.getNames()?.map(name => name?.removeFormatting())[41];
        }
        counter += 1;
    }
});

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
        printAMessage("tell NotFishion " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + " t: " + text + ", t:" + type + ". Generated using Cookie Utils /cu", settings.addText);
    } else {
        ChatLib.chat("No block found within maximum height.");
    }

}).setName("infos").setAliases("ping"); // use /infos ingame to get info!! btw i love people called makali

//fetches waypoints from other users
register("chat", (player, x, y, z, text, type, event) => {
    if (/to(?:\s+\w+)+:/i.test(player)) {
        player = Player.getName();
    } else {
        player = player.split(':')[0].trim().split(' ').pop();
    }
    temp = 0;
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
}).setCriteria("${player}: x: ${x}, y: ${y}, z: ${z} t: ${text}, t:${type}. Generated using Cookie Utils /cu").setContains();

/*
References
tablist = TabList?.getNames()?.map(name => name?.removeFormatting());
scoreboard = Scoreboard.getLines(true)?.map(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, ""));
*/
