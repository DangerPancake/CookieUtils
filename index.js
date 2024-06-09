import RenderLib from "../RenderLib/index.js";
import settings from "./settings";
import "./functions.js";
import { Vector, deleteWaypoint } from "./functions.js";

//all variables are defined here in order to limit the chances of a memory leak occuring
////////////// we should make a seperate file to store all the variables or add them to the option.js file?
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
let [red, green, blue] = [0, 0, 1];
let [alpha, phase] = [1, true];


//renders pings
register('renderWorld', () => {
    for (let i = 0; i < pingList.length; i++) {
        let wp = pingList[i];
        let [wptype, wptext] = [wp.getType(), wp.getText()];
        let [wpx, wpy, wpz] = [Math.floor(wp.getX()), Math.floor(wp.getY()), Math.floor(wp.getZ())];


        // draw Waypoint
        if (wptype == null || wptype == "BOX") {
            RenderLib.drawEspBox(wpx + 0.5, wpy, wpz + 0.5, width, height, red, green, blue, alpha, phase);
        } else if (wptype == "INNERBOX") {
            RenderLib.drawInnerEspBox(wpx + 0.5, wpy, wpz + 0.5, width, height, red, green, blue, alpha, phase);
        } else if (wptype == "BARITONEBOX") {
            RenderLib.drawBaritoneEspBox(wpx + 0.5, wpy, wpz + 0.5, width, height, red, green, blue, alpha, phase);
        }

        // draw Waypoint Text
        if (wptext == null || wptext == "null") {
            Tessellator.drawString(wp.getName(), wpx + 0.5, wpy + 1, wpz + 0.5);
        } else {
            Tessellator.drawString(wptext, wpx + 0.5, wpy + 1, wpz + 0.5);
        }
    }

});

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
    settings.openGUI();
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
        text = "null";
    }

    if (type == null) {
        switch (settings.pingShape) {
            case 1:
                type = "INNERBOX";
            case 2:
                type = "BARITONEBOX";
            case 0:
                type = "BOX";
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
        ChatLib.command("pc " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ", t:" + type + ". Generated using Cookie Utils /cu");
    } else {
        ChatLib.chat("No block found within maximum height.");
    }

}).setName("infos").setAliases("ping"); // use /infos ingame to get info!! btw i love people called makali

//fetches waypoints from other users
register("chat", (player, x, y, z, text, type, event) => {
    ChatLib.chat("Ping fetched from " + player);
    if (/to(?:\s+\w+)+:/i.test(player)) {
        player = Player.getName();
    } else {
        player = player.split(':')[0].trim().split(' ').pop();
    }
    temp = 0;
    for (let i = 0; i < pingList.length; i++) {
        if (pingList[i].getName() == player) {
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
}).setCriteria("${player}: x: ${x}, y: ${y}, z: ${z}, t: ${text}, t:${type}. Generated using Cookie Utils /cu").setContains();



/*
References
tablist = TabList?.getNames()?.map(name => name?.removeFormatting());
scoreboard = Scoreboard.getLines(true)?.map(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, ""));
*/