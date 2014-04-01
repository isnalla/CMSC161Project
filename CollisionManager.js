var QUADRANTS = [
    new Bounds(0,999,-999,999,0,999),   //quadrant 1
    new Bounds(-999,0,-999,999,999,0),  //quadrant 2
    new Bounds(-999,0,-999,999,-999,0),   //quadrant 3
    new Bounds(0,999,-999,999,0,-999)    //quadrant 4
];
function Bounds(minX,maxX,minY,maxY,minZ,maxZ){
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.minZ = minZ;
    this.maxZ = maxZ;
}

function collides(item1,item2){//returns true if item1(point or bounds) collides with item 2
    var bounds1,bounds2, point1,point2;
    if(item1["point"] && item2["bounds"]){
        point1  = item1["point"];
        bounds2 = item2["bounds"];
        return  point1.x > bounds2.minX &&
                point1.x < bounds2.maxX &&
                point1.y > bounds2.minY &&
                point1.y < bounds2.maxY &&
                point1.z > bounds2.minZ &&
                point1.z < bounds2.maxZ;
    }
    else if(item1["bounds"] && item2["bounds"]){
        bounds1 = item1["bounds"];
        bounds2 = item2["bounds"];
        console.log(bounds1,bounds2);
        return ( bounds1.minX < bounds2.minX && bounds1.minX > bounds2.maxX ) ||
            ( bounds1.maxX < bounds2.minX && bounds1.maxX > bounds2.maxX ) ||
            ( bounds1.minY < bounds2.minY && bounds1.minY > bounds2.maxY ) ||
            ( bounds1.maxY < bounds2.minY && bounds1.maxY > bounds2.maxY ) ||
            ( bounds1.minZ < bounds2.minZ && bounds1.minZ > bounds2.maxZ ) ||
            ( bounds1.maxZ < bounds2.minZ && bounds1.maxZ > bounds2.maxZ );

    }
    else if(item1["point"] && item2["point"]){
        return item1["point"] == item2["point"];
    }else if(item1["bounds"] && item2["point"]){
        return collides(item2,item1); //reverse position of arguments;
    }else return null;
}