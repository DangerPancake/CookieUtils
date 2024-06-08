import RenderLib from "../RenderLib/index.js";




// this function draws the waypoint according to its type unless the type is not defined, default set to BOX (THIS FUNCTION RETURNS THE TEXT FOR THE TESSELATOR)
// i just noticed i kinda cant do this part without having the vector class in here i will continue once it is here
function drawWaypoint(Waypoint, width = 1, height = 1, red = 0, green = 0, blue = 0, alpha = 1, phase = true, type = "Box", text = "") {
    let Type = type; // making sure the type is set to "BOX" by default
    if (type == undefined) {
        Type = "BOX";
    }
    /*
    if (Type == "BOX") {
        RenderLib.drawEspBox(Waypoint.getX(), Waypoint.getY(), Waypoint.getZ(), width, height, red, green, blue, alpha, phase);
    } else if (Type == "INNERBOX") {
        RenderLib.drawInnerEspBox(Waypoint.getX(), Waypoint.getY(), Waypoint.getZ(), width, height, red, green, blue, alpha, phase);
    } else if (Type == "BARITONEBOX") {
        RenderLib.drawBaritoneEspBox(Waypoint.getX(), Waypoint.getY(), Waypoint.getZ(), width, height, red, green, blue, alpha, phase);
    }
    */





    return text;
}




// used to delete Waypoints after a set amount of time
function deleteWaypoint(waypoint, ms = 1000) {
    setTimeout(() => {
        pingList.splice(waypoint);
    }, settings.waypoint);
}



// move the vector class here too later on to make index.js look cleaner (i dont wanna break anything for now) (update: i just tried but i would have to add the namespace
// in front of every vector if i understand this correctly? this would mean everytime you do new vector() you would have to new functions.vector() right?