import RenderLib from "../RenderLib/index.js";

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
let delete_Waypoint_after = 1000; //default set to 1000ms

//renders pings
register('renderWorld', () => {
    for (let i = 0; i < pingList.length; i++) {

        // TYPE DETECTION: CURRENTLY ONLY WORKS WITH "BOX", "INNERBOX" AND ALSO "BARITONEBOX" I WILL WORK ON IT TOMORROW IM TIRED - ALSO THE WAYPOINT DELETION TIME IS STILL SET TO 1SECOND I WILL FIX TOMORROW!!! //
        if (pingList[i].type == undefined || pingList[i].type == "BOX") {
            RenderLib.drawEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        } else if (pingList[i].type == "INNERBOX") {
            RenderLib.drawInnerEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        } else if (pingList[i].type == "BARITONEBOX") {
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

//creates a new ping depending on where the player is looking and posts it in chat
register("command", (user, text, type) => {
    if (user != null) {
        range = user;
    }
    if (text == null) {
        text = "null";
    }

    playerPos = new Vector(Player.getX(), Player.getY() + 1.62, Player.getZ());
    yaw = Player.getYaw() * Math.PI / 180;
    pitch = Player.getPitch() * Math.PI / 180;
    unitvector = new Vector(-Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    testBlock = new Vector(playerPos.getX(), playerPos.getY(), playerPos.getZ());
    drawtype = type ?? "BOX";
    drawtype = "TYPE:" + drawtype;

    

    //creates a ray
    while (true) {
        distance = Math.sqrt(Math.pow(playerPos.x - testBlock.getX(), 2) + Math.pow(playerPos.y - testBlock.getY(), 2) + Math.pow(playerPos.z - testBlock.getZ(), 2))
        testBlock.add(unitvector);
        if (World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType() != "BlockType{name=minecraft:air}" || testBlock.getY() > 300 || testBlock.getY() < 0) {
            break;
        }

        if (range != -1 && distance >= range) {
            break;
        }
    }
    //posting in chat
    if (testBlock.getY() < 300 && testBlock.getY() > 0 && range == -1) {
        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        ChatLib.command("pc " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ". " + drawtype + " /CU");
        //ChatLib.command("tellraw Quektos \"Party > [MVP] Quektos: " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ". " + drawtype + " /CU \"");

    } else if (testBlock.getY() < 300 && testBlock.getY() > 0) {
        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        ChatLib.command("pc " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ". " + drawtype + " /CU");
        //ChatLib.command("tellraw Quektos \"Party > [MVP] Quektos: " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ". " + drawtype + " /CU \"");
        // currently /tellraw instead of /pc so it works in single player
    } else {
        ChatLib.chat("No block found within maximum height.");
    }
    temp = 0;
    for (let i = 0; i < pingList.length; i++) {
        if (pingList[i].getName() == Player.getName()) {
            if (text == "null") {
                pingList[i] = new Vector(testBlock.getX(), testBlock.getY(), testBlock.getZ(), Player.getName());
                setTimeout(() => {
                    pingList.shift();
                }, delete_Waypoint_after);
            } else {
                pingList[i] = new Vector(testBlock.getX(), testBlock.getY(), testBlock.getZ(), Player.getName(), text);
                ChatLib.chat(pingList[i]);
                setTimeout(() => {
                    pingList.shift();
                }, delete_Waypoint_after);
            }
            temp = 1;
            break;
        }
    }
    if (temp == 0) {
        if (text == "null") {

            pingList.push(new Vector(testBlock.getX(), testBlock.getY(), testBlock.getZ(), Player.getName()));
            setTimeout(() => {
                pingList.shift();
            }, delete_Waypoint_after);
        } else {
            pingList.push(new Vector(testBlock.getX(), testBlock.getY(), testBlock.getZ(), Player.getName(), text));
            setTimeout(() => {
                pingList.shift();
            }, delete_Waypoint_after);
        }
    }

}).setName("infos"); // use /infos ingame to get info!! btw i love people called makali

//fetches waypoints from other users
register("chat", (temp1, rank, player, x, y, z, text, type, event) => {
    if (player != Player.getName()) {
        temp = 0;
        
        for (let i = 0; i < pingList.length; i++) {
            if (pingList[i].getName() == player) {
                if (text == null || text == "" || text == " " || text == "null") {
                    pingList[i] = new Vector(x, y, z, player, "", type);
                    setTimeout(() => {
                        pingList.shift();
                    }, delete_Waypoint_after);
                } else {
                    pingList[i] = new Vector(x, y, z, player, text, type);
                    setTimeout(() => {
                        pingList.shift();
                    }, delete_Waypoint_after);
                }
                temp = 1;
                break;
            }
        }
        if (temp == 0) {
            if (text == null || text == "" || text == " " || text == "null") {
                pingList.push(new Vector(x, y, z, player, "", type));
                setTimeout(() => {
                    pingList.shift();
                }, delete_Waypoint_after);
            } else {
                pingList.push(new Vector(x, y, z, player, text, type));
                setTimeout(() => {
                    pingList.shift();
                }, delete_Waypoint_after);
            }
        }
    }
}).setCriteria("${temp1} ${rank} ${player}: x: ${x}, y: ${y}, z: ${z}, t: ${text}. TYPE:${type} /CU");

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

    setX(x) {
        this.x = x;
    }

    setName(name) {
        this.name = name;
    }

    setY(y) {
        this.y = y;
    }

    setZ(z) {
        this.z = z;
    }

    setType(type) {
        this.type = type;
    }

    add(vector) {
        this.x += vector.getX()
        this.y += vector.getY()
        this.z += vector.getZ()
    }
}
