import RenderLib from "../RenderLib/index.js";

let testBlock = null;
let range = -1;
let distance = 0;
let yaw = 0;
let pitch = 0;
let playerPos = null;
let unitvector = null;
let pingList = [];
let temp = 0;

register('renderWorld', () => {

    for (let i = 0; i < pingList.length; i++) {
        RenderLib.drawEspBox(Math.floor(pingList[i].getX())+0.5, Math.floor(pingList[i].getY()), Math.floor(pingList[i].getZ())+0.5, 1, 1, 0, 0, 1, 1, true);
        if (pingList[i].getText() == null) {
            Tessellator.drawString(pingList[i].getName(), Math.floor(pingList[i].getX())+0.5, Math.floor(pingList[i].getY())+1, Math.floor(pingList[i].getZ())+0.5);
        } else {
            Tessellator.drawString(pingList[i].getText(), Math.floor(pingList[i].getX())+0.5, Math.floor(pingList[i].getY())+1, Math.floor(pingList[i].getZ())+0.5);
        }
    }
    
});

register("command", (user, text) => {
    if (user != null) {
        range = user;
    }
    if (text == null || text == "null") {
        text = "";
    } 
    
    playerPos = new Vector(Player.getX(),Player.getY() + 1.62,Player.getZ());
    yaw = Player.getYaw()*Math.PI/180;
    pitch = Player.getPitch()*Math.PI/180;
    unitvector = new Vector(-Math.sin(yaw) * Math.cos(pitch),-Math.sin(pitch),Math.cos(yaw) * Math.cos(pitch));
    if (text == "") {
        testBlock = new Vector(playerPos.getX(), playerPos.getY(), playerPos.getZ(), Player.getName());
    } else {
        testBlock = new Vector(playerPos.getX(), playerPos.getY(), playerPos.getZ(), text);
    }
    
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
        if (text != "") {
            ChatLib.command("pc " + "x: "+ Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY())+ ", z: "+ Math.floor(testBlock.getZ()) + ". /CU " + text);
        } else {
            ChatLib.command("pc " + "x: "+ Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY())+ ", z: "+ Math.floor(testBlock.getZ()) + ". /CU ");
        }
        
    } else if (testBlock.getY() < 300 && testBlock.getY() > 0) {
        ChatLib.chat("Block at: " + Math.floor(testBlock.getX()) + ", " + Math.floor(testBlock.getY()) + ", " + Math.floor(testBlock.getZ()) + " is: " + World.getBlockAt(Math.floor(testBlock.getX()), Math.floor(testBlock.getY()), Math.floor(testBlock.getZ())).getType().getName());
        //ChatLib.command("pc " + Player.getName() + " is pinging!");
        if (text != "") {
            ChatLib.command("pc " + "x: "+ Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY())+ ", z: "+ Math.floor(testBlock.getZ()) + ". /CU " + text);
        } else {
            ChatLib.command("pc " + "x: "+ Math.floor(testBlock.getX()) + ", y: " + Math.floor(testBlock.getY())+ ", z: "+ Math.floor(testBlock.getZ()) + ". /CU ");
        }
        
    } else {
        ChatLib.chat("No block found within maximum height.");
    }
    temp = 0;
    for (let i = 0; i < pingList.length; i++) {
        if (pingList[i].getName() == Player.getName()) {
            if (text == null || text == "") {
                //pingList[i] = new Vector(testBlock.getX(),testBlock.getY(),testBlock.getZ(), Player.getName());
            } else {
                //pingList[i] = new Vector(testBlock.getX(),testBlock.getY(),testBlock.getZ(), Player.getName(), text);
            }
            temp = 1;
            break;
        }
    }
    if (temp == 0) {
        if (text == null || text == "") {
            //pingList.push(new Vector(testBlock.getX(),testBlock.getY(),testBlock.getZ(), Player.getName()));
        } else {
            //pingList.push(new Vector(testBlock.getX(),testBlock.getY(),testBlock.getZ(), Player.getName(), text));
        }
    }
   
}).setName("infos"); // use /infos ingame to get info!! btw i love people called makali

register("chat", (temp1, rank, player, x, y, z, text, event) => {
    ChatLib.chat("rehehe " + player + " " + x + " " + y + " " + z);
    if (player == Player.getName()) {
        temp = 0;
        for (let i = 0; i < pingList.length; i++) {
            if (pingList[i].getName() == player) {
                if (text == null || text == "" || text == " ") {
                    pingList[i] = new Vector(x,y,z, player);
                } else {
                    pingList[i] = new Vector(x,y,z, player, text);
                }
                temp = 1;
                break;
            }
        }
        if (temp == 0) {
            if (text == null || text == "" || text == " ") {
                pingList.push(new Vector(x,y,z, player));
            } else {
                pingList.push(new Vector(x,y,z, player, text));
            }
        }
    }
    
    
}).setCriteria("${temp1} ${rank} ${player}: x: ${x}, y: ${y}, z: ${z}. /CU ${text}");


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

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

}
