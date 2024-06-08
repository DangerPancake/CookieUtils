import RenderLib from "../RenderLib/index.js";
import settings from "./settings";
import "./functions.js";

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

//renders pings
register('renderWorld', () => {
    for (let i = 0; i < pingList.length; i++) {

        // TYPE DETECTION: CURRENTLY ONLY WORKS WITH "BOX", "INNERBOX" AND ALSO "BARITONEBOX" I WILL WORK ON IT TOMORROW IM TIRED - ALSO THE WAYPOINT DELETION TIME IS STILL SET TO 1SECOND I WILL FIX TOMORROW!!! //
        if (pingList[i].getType() == null || pingList[i].getType() == "BOX") {
            RenderLib.drawEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        } else if (pingList[i].getType() == "INNERBOX") {
            RenderLib.drawInnerEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        } else if (pingList[i].getType() == "BARITONEBOX") {
            RenderLib.drawBaritoneEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        }
        // RenderLib.drawInnerEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        if (pingList[i].getText() == null || pingList[i].getText() == "null") {
            Tessellator.drawString(pingList[i].getName(), Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()) + 1, Math.floor(pingList[i].getZ()) + 0.5);
        } else {
            Tessellator.drawString(pingList[i].getText(), Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()) + 1, Math.floor(pingList[i].getZ()) + 0.5);
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
        ChatLib.command("tell sweatykeycaps " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ", t:" + type + ". Generated using Cookie Utils /cu");
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


//vector class
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    constructor(x, y, z, name) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
    }

    constructor(x, y, z, name, text) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.text = text;
    }

    constructor(x, y, z, name, text, type) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.text = text;
        this.type = type;
    }

    getX() {
        return this.x;
    }

    getName() {
        return this.name;
    }

    getY() {
        return this.y;
    }

    getZ() {
        return this.z;
    }

    getText() {
        return this.text;
    }

    getType() {
        return this.type;
    }

    add(vector) {
        this.x += vector.getX()
        this.y += vector.getY()
        this.z += vector.getZ()
    }
}
/*
References
tablist = TabList?.getNames()?.map(name => name?.removeFormatting());
scoreboard = Scoreboard.getLines(true)?.map(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, ""));
*/
