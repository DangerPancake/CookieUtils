import RenderLib from "../RenderLib/index.js";
//import Party from "../Atomx/skyblock/Party.js";

let testBlock = null;
let range = -1;
let distance = 0;
let yaw = 0;
let pitch = 0;
let playerPos = null;
let unitvector = null;
let pingBlock1 = null;
let pingBlock2 = null;
let pingBlock3 = null;
let pingBlock4 = null;
//let party = null;
register('renderWorld', () => {
    //if (party == null) {
    //    party = new Party();
    //}
    if (testBlock !== null) {
        RenderLib.drawEspBox(Math.floor(testBlock.getX())+0.5, Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())+0.5, 1, 1, 0, 0, 1, 1, true);
        Tessellator.drawString("Hello there!", Math.floor(testBlock.getX())+0.5, Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())+0.5);
    }
    if (pingBlock1 !== null) {
        RenderLib.drawEspBox(Math.floor(pingBlock1.getX())+0.5, Math.floor(pingBlock1.getY()), Math.floor(pingBlock1.getZ())+0.5, 1, 1, 0, 0, 1, 1, true);
    }
    if (pingBlock2 !== null) {
        RenderLib.drawEspBox(Math.floor(pingBlock2.getX())+0.5, Math.floor(pingBlock2.getY()), Math.floor(pingBlock2.getZ())+0.5, 1, 1, 0, 0, 1, 1, true);
    }
    if (pingBlock3 !== null) {
        RenderLib.drawEspBox(Math.floor(pingBlock3.getX())+0.5, Math.floor(pingBlock3.getY()), Math.floor(pingBlock3.getZ())+0.5, 1, 1, 0, 0, 1, 1, true);
    }
    if (pingBlock4 !== null) {
        RenderLib.drawEspBox(Math.floor(pingBlock4.getX())+0.5, Math.floor(pingBlock4.getY()), Math.floor(pingBlock4.getZ())+0.5, 1, 1, 0, 0, 1, 1, true);
    }



});

register("command", (user) => {
    if (user != null) {
        range = user;
    }
    //ChatLib.chat(Player.lookingAt());
    playerPos = new Vector(Player.getX(),Player.getY() + 1.62,Player.getZ());
    yaw = Player.getYaw()*Math.PI/180;
    pitch = Player.getPitch()*Math.PI/180;
    unitvector = new Vector(-Math.sin(yaw) * Math.cos(pitch),-Math.sin(pitch),Math.cos(yaw) * Math.cos(pitch));

    testBlock = new Vector(playerPos.getX(), playerPos.getY(), playerPos.getZ());
    while (true) {
        distance = Math.sqrt(Math.pow(playerPos.x - testBlock.getX(),2) + Math.pow(playerPos.y - testBlock.getY(),2) + Math.pow(playerPos.z - testBlock.getZ(),2))
        testBlock.add(unitvector);
        if (World.getBlockAt(Math.floor(testBlock.getX()),Math.floor(testBlock.getY()),Math.floor(testBlock.getZ())).getType() != "BlockType{name=minecraft:air}" || testBlock.getY() > 300 || testBlock.getY() < 0 ) {
            break;
        }
        
        if (range != -1 && distance >= range) {
            break;
        }
    }

    if (testBlock.getY() < 300 && testBlock.getY() > 0 && range == -1) {
        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        //ChatLib.command("pc " + Player.getName() + " is pinging!");
        ChatLib.command("pc " + "x: "+ Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY())+ ", z: "+ Math.floor(testBlock.getZ()) + ". Ping sent using CookieUtils");
    } else if (testBlock.getY() < 300 && testBlock.getY() > 0) {
        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        //ChatLib.command("pc " + Player.getName() + " is pinging!");
        ChatLib.command("pc " + "x: "+ Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY())+ ", z: "+ Math.floor(testBlock.getZ()) + ". Ping sent using CookieUtils");
    } else {
        ChatLib.chat("No block found within maximum height.");
    }
    //ChatLib.chat(party.getLeader());
   
}).setName("infos"); // use /infos ingame to get info!! btw i love people called makali

register("chat", (player, x, y, z, event) => {
    ChatLib.chat("rehehe " + player + " " + x + " " + y + " " + z);
    pingBlock1 = new Vector(x, y, z);
}).setCriteria("Party > ${player}: x: ${x}, y: ${y}, z: ${z}. Ping sent using CookieUtils");

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZ() {
        return this.z;
    }

    setX(x) {
        this.x = x;
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

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

}

class pingList {
    constructor() {

    }
}