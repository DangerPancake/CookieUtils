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
        RenderLib.drawInnerEspBox(Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ()) + 0.5, 1, 1, 0, 0, 1, 1, true);
        if (pingList[i].getText() == null || pingList[i].getText() == "null") {
            Tessellator.drawString(pingList[i].getName(), Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()) + 1, Math.floor(pingList[i].getZ()) + 0.5);
        } else {
            Tessellator.drawString(pingList[i].getText(), Math.floor(pingList[i].getX()) + 0.5, Math.floor(pingList[i].getY()) + 1, Math.floor(pingList[i].getZ()) + 0.5);
        }
    }
});

//creates a new ping depending on where the player is looking and posts it in chat
register("command", (user, text) => {
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
        ChatLib.command("pc " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ". /CU");

    } else if (testBlock.getY() < 300 && testBlock.getY() > 0) {
        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        ChatLib.command("pc " + "x: " + Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY()) + ", z: " + Math.floor(testBlock.getZ()) + ", t: " + text + ". /CU");

    } else {
        ChatLib.chat("No block found within maximum height.");
    }
    temp = 0;
    for (let i = 0; i < pingList.length; i++) {
        if (pingList[i].getName() == Player.getName()) {
            if (text == "null") {
                pingList[i] = new Vector(testBlock.getX(), testBlock.getY(), testBlock.getZ(), Player.getName());
                setTimeout(pingList.shift(), 100);
            } else {
                pingList[i] = new Vector(testBlock.getX(), testBlock.getY(), testBlock.getZ(), Player.getName(), text);
                ChatLib.chat(pingList[i]);
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
register("chat", (temp1, rank, player, x, y, z, text, event) => {
    if (player != Player.getName()) {
        temp = 0;
        for (let i = 0; i < pingList.length; i++) {
            if (pingList[i].getName() == player) {
                if (text == null || text == "" || text == " ") {
                    pingList[i] = new Vector(x, y, z, player);
                } else {
                    pingList[i] = new Vector(x, y, z, player, text);
                }
                temp = 1;
                break;
            }
        }
        if (temp == 0) {
            if (text == null || text == "" || text == " ") {
                pingList.push(new Vector(x, y, z, player));
            } else {
                pingList.push(new Vector(x, y, z, player, text));
            }
        }
    }
}).setCriteria("${temp1} ${rank} ${player}: x: ${x}, y: ${y}, z: ${z}, t: ${text}. /CU");

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

    add(vector) {
        this.x += vector.getX()
        this.y += vector.getY()
        this.z += vector.getZ()
    }
}
