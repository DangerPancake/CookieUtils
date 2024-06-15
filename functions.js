
// move the vector class here too later on to make index.js look cleaner (i dont wanna break anything for now) (update: i just tried but i would have to add the namespace
// in front of every vector if i understand this correctly? this would mean everytime you do new vector() you would have to new functions.vector() right?
// UPDATE: I MOVED IT WITHOUT BREAKING ANYTHING YAAAAAAAAAYYYYYY
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

    constructor(x, y, z, name = "", text = "NONE", type = "BOX") {
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


/// get the world instance with this command!!!
class WorldInstance {

    constructor() {
        const minecraft = Java.type('net.minecraft.client.Minecraft').func_71410_x(); // .getMinecraft()s obfuscated method
        const player = minecraft.field_71439_g; // obfuscated, gets the Player
        this.world = player.field_70170_p; // obfuscated, gets the world instance the player is currently in
        this.minecraft = minecraft;
        this.player = player;
    }

    getMinecraft() {
        return this.minecraft;
    }

    getPlayerInstance() {
        if (!this.player) {
            ChatLib.chat("Player instance is undefined.");
        }
        return player;
    }

    getWorldInstance() {
        return this.world;
    }

}

/// check if entities are around you!!!
const AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');
function GetEntitiesWithinAABB(Entity, range) {                /// Object = around what object to check?    Entity = check for what Entities?   range = How far away can the Entity be?
    let world = new WorldInstance();
    let boundingBox = new AxisAlignedBB(
        Player.getX() - range, Player.getY() - range, Player.getZ() - range,
        Player.getX() + range, Player.getY() + range, Player.getZ() + range
    );

    return world.getWorldInstance().func_72872_a(Entity, boundingBox); // obfuscated method for getEntitiesWithinAABB()       please make sure you pass the Entity.class() in it
}





/*
    function isSheepWithinRange() {
        let boundingBox = new AxisAlignedBB(
            Player.getX() - 1, Player.getY() - 1, Player.getZ() - 1,
            Player.getX() + 1, Player.getY() + 1, Player.getZ() + 1
        );

        let minecraft = Minecraft.func_71410_x();
        let player = minecraft.field_71439_g;
        let world = player.field_70170_p;
        let sheepList = world.func_72872_a(EntitySheep.class, boundingBox);

        try {
            return sheepList[0];
        }
        catch (err) {
            return null;
        }
    }


    let isNearby = isSheepWithinRange();
    ChatLib.chat(isNearby);


*/













function CountdownTitle(seconds) {
    for (let i = seconds; i >= 0; i--) {
        (function (i) {
            setTimeout(() => {
                Client.showTitle(i, "", 10, 30, 10)
            }, (seconds - i) * 1000);
        })(i);
    }
}

function pseudoString(length) {
    let string = "@";
    for (let i = 0; i < length; i++) {
        let random;
        do {
            random = Math.floor(Math.random() * 94) + 33; // Random value between 33 and 126 (inclusive)
        } while (random === 46); // If the random value is 46 (.), re-roll
        string += String.fromCharCode(random); // Append the character
    }
    return string;
}


function printAMessage(message, addString) {
    if (addString) {
        let r = message + " " + pseudoString(11)
        ChatLib.say(r);
        //ChatLib.chat(r)
    } else {
        ChatLib.say(message);
    }
}

/**
 * Plays a sound and sets cooldown
 * 
 * @param {Sound} sound - A sound ogg file from constants.js 
 * @param {Number} cd - Cooldown caused by sound play.
 */
let soundCD = false;
function playSound(sound, cd) {
    if (soundCD === true) return;

    sound.play();
    soundCD = true;
    setTimeout(() => {
        soundCD = false;
    }, cd);
}

function getCurrentArea() {
    let temp = TabList?.getNames()?.map(name => name?.removeFormatting())[41];
    if (temp != null) {
        temp = temp.replace(/Area:\s*/i, "");
        temp = temp.replace(/Dungeon:\s*/i, "");
    }
    return temp;
}

function sendPingWaypoint(x, y, z, t, ty, p) {
    printAMessage("x: " + x + ", y: " + y + ", z: " + z + " t: " + t + ", t:" + ty + ". /cu", p)
}

export { Vector, pseudoString, printAMessage, playSound, CountdownTitle, getCurrentArea, sendPingWaypoint, WorldInstance, GetEntitiesWithinAABB };