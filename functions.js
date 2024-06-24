
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
            return null;
        }
        return this.player;
    }

    getWorldInstance() {
        return this.world;
    }

}

/// check if entities are around you!!!
const AxisAlignedBB = Java.type('net.minecraft.util.AxisAlignedBB');
function GetEntitiesWithinAABB(Entity, range = 2) {                /// Object = around what object to check?    Entity = check for what Entities?   range = How far away can the Entity be?
    let world = new WorldInstance();
    let boundingBox = new AxisAlignedBB(
        Player.getX() - range, Player.getY() - range, Player.getZ() - range,
        Player.getX() + range, Player.getY() + range, Player.getZ() + range
    );

    let entities = world.getWorldInstance().func_72872_a(Entity, boundingBox); // obfuscated method for getEntitiesWithinAABB()       please make sure you pass the Entity.class() in it
    
    let array = [];
    for (let i = 0; i < entities.length; i++) {
        array.push(entities[i]);
    }
    return array;
    
}

function MageCDR(Mage_level, soloMage) {
    let base = 0.25;
    if (soloMage) { base *= 2; }
    base += Math.floor(Mage_level / 2) / 100;
    return base;
}


/// returns the nbt data of an entity
const NBTTagComp = Java.type('net.minecraft.nbt.NBTTagCompound');
function EntityNBTData(ENTITYCLASS) {
    let nbt = new NBTTagComp();
    let randomentity = ENTITYCLASS;
    try {
        randomentity.func_70109_d(nbt);
    } catch (err) {
        ChatLib.chat("${randomentity.class} doesnt have fetchable nbt data");
    }
    
    ChatLib.chat(nbt);
    return nbt;
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



// Function to update the timer
function updateTimer(timer, timerArray) {
    // Function to update the timer and manage intervals
    function updateTime() {
        // Calculate seconds, tenths, and hundredths
        let seconds = Math.floor(timer / 1000);
        let tenths = Math.floor((timer % 1000) / 100);
        let hundredths = Math.floor((timer % 100) / 10);

        // Format timer value as a float
        let formattedTimer = parseFloat(`${seconds}.${tenths}${hundredths}`);

        // Set external timer variable
        setExternalTimer(formattedTimer);

        // removes old timer entries so your pc doesnt explode
        if (timerArray.length > 5) {
            timerArray.shift();
        }

        // Push current timer value to array
        timerArray.push(formattedTimer);

        // Decrement timer
        timer -= 10;

        // Check if timer has reached 0
        if (timer >= 0) {
            setTimeout(updateTime, 10); // Call updateTime after 10 milliseconds
        } else {
            console.log("Timer has reached 0!");
            setExternalTimer(0); // Signal that timer has reached 0
        }
    }

    // Function to set external timer variable
    function setExternalTimer(value) {
        externalTimer = value;
        console.log(`External timer updated: ${externalTimer}`);
    }

    // Initial call to start updating time
    updateTime();

    // Return the timer array for external manipulation if needed
    return timerArray;
}



















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





// GOLDOR CLASS TERMINALS
function GoldorClassTerminals(Tank, Archer, Bers, Mage, Healer, f7p3section) {  // basically self explanatory but: name of the people assigned the class term        f7p3section: what section of the p3 you are in (integer)
    let section = f7p3section;
    let pseudoStringLength = 10;
    let tellDelay = 700; //in ms

    switch (section) {
        case 1:
            (function () {
                Tank && ChatLib.command("tell " + Tank + " x: 111, y: 113, z: 73 t: 1, t:INNERBOX. /cu " + "TRQARFASGAFAF");
                setTimeout(() => {
                    Mage && ChatLib.command("tell " + Mage + " x: 111, y: 119, z: 79 t: 2, t:INNERBOX. /cu " + "QUZIZDNBDKOI");
                }, tellDelay);
                setTimeout(() => {
                    Healer && ChatLib.command("tell " + Healer + " x: 110, y: 119, z: 93 t:device, t:INNERBOX. /cu " + "FAAFUHAIHFIUFHIH");
                }, tellDelay*2);
                setTimeout(() => {
                    Bers && ChatLib.command("tell " + Bers + " x: 89, y: 112, z: 92 t: 3, t:INNERBOX. /cu " + "FUHFIUHFIAUHD");
                }, tellDelay*3);
                setTimeout(() => {
                    Archer && ChatLib.command("tell " + Archer + " x: 89, y: 122, z: 101 t: 4, t:INNERBOX. /cu " + "cFDAUHFIHFU");
                }, tellDelay*4);
                ChatLib.chat("&2section " + section + "&r");
            })();
            break;
        case 2:
            (function () {
                Tank && ChatLib.command("tell " + Tank + " x: 68, y: 109, z: 121 t: 1, t:INNERBOX. /cu " + "ABBBDUDUBDUBD");
                setTimeout(() => {
                    Healer && ChatLib.command("tell " + Healer + " x: 60, y: 131, z: 141 t:device, t:BOX. /cu " + "LLVVLVLVLVFKKFF");
                }, tellDelay);
                setTimeout(() => {
                    Mage && ChatLib.command("tell " + Mage + " x: 59, y: 120, z: 122 t: 2, t:BOX. /cu " + "SFEQRFAFAERFQRQ");
                }, tellDelay*2);
                setTimeout(() => {
                    Bers && ChatLib.command("tell " + Bers + " x: 47, y: 109, z: 121 t: 3, t:INNERBOX. /cu " + "FEFAFEAFFAFAEFAE");
                }, tellDelay*3);
                setTimeout(() => {
                    Archer && ChatLib.command("tell " + Archer + " x: 39, y: 108, z: 143 t: 4, t:INNERBOX. /cu " + "HJHHRRHHRHRHRH");
                }, tellDelay*4);
                ChatLib.chat("&2section " + section + "&r");
            }) ();
            break;
            
        case 3:
            (function () {
                Tank && ChatLib.command("tell " + Tank + " x: -3, y: 109, z: 112 t: 1, t:INNERBOX. /cu " + "BNDJDBDBJDBDJDBJ");
                setTimeout(() => {
                    Mage && ChatLib.command("tell " + Mage + " x: -3, y: 119, z: 93 t: 2, t:INNERBOX. /cu " + "CABCAZCBZBCZBCZA");
                }, tellDelay);
                setTimeout(() => {
                    Bers && ChatLib.command("tell " + Bers + " x: 19, y: 123, z: 93 t: 3, t:INNERBOX. /cu " + "FAUHIFAHFAUIHFBN");
                }, tellDelay*2);
                setTimeout(() => {
                    Archer && ChatLib.command("tell " + Archer + " x: -3, y: 109, z: 77 t: 4, t:INNERBOX. /cu " + "CCCCCJJCJJCFFKK");
                }, tellDelay*3);
                setTimeout(() => {
                    Healer && ChatLib.command("tell " + Healer + " x: -1, y: 119, z: 77 t: device, t:INNERBOX. /cu " + "FFFJFJFJJDIJOOOO");
                }, tellDelay*4);
                ChatLib.chat("&2section " + section + "&r");
            }) ();
            break;
        case 4:
            (function () {
                Tank && ChatLib.command("tell " + Tank + " x: 41, y: 109, z: 29 t: 1, t:INNERBOX. /cu " + "PPPOFOFOFOPF");
                setTimeout(() => {
                    Mage && ChatLib.command("tell " + Mage + " x: 44, y: 121, z: 29 t: 2, t:INNERBOX. /cu " + "LETITGO");
                }, tellDelay);
                setTimeout(() => {
                    Bers && ChatLib.command("tell " + Bers + " x: 67, y: 109, z: 29 t: 3, t:INNERBOX. /cu " + "UHFIAUHFIFAHFIUA");
                }, tellDelay*2);
                setTimeout(() => {
                    Healer && ChatLib.command("tell " + Healer + " x: 63, y: 127, z: 35 t: device, t:INNERBOX. /cu " + "FFAFIJHOAMMMMM");
                }, tellDelay*3);
                setTimeout(() => {
                    Archer && ChatLib.command("tell " + Archer + " x: 72, y: 115, z: 48 t: 4, t:INNERBOX. /cu " + "FFFFHFHFUBBBBBBB");
                }, tellDelay*4);
                ChatLib.chat("&2section " + section + "&r");
            })();
            break;
        default:
            ChatLib.chat("unknown section: " + section);
    }


}


//GoldorClassTerminals("TANKIBOIII", null, 0, "", undefined, 3);




















export { Vector, pseudoString, printAMessage, playSound, CountdownTitle, getCurrentArea, sendPingWaypoint, WorldInstance, GetEntitiesWithinAABB, MageCDR, EntityNBTData, updateTimer, GoldorClassTerminals };