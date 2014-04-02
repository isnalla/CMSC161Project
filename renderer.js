/*

 References : http://www.geeks3d.com/20100228/fog-in-glsl-webgl/
 http://threejs.org/examples/webgl_geometry_minecraft.html
 */
document.body.onload = webGLStart;

globalGL = null;
function webGLStart(){
    var canvas; //canvas element
    var vertexShader,fragmentShader;
    var program;
    var gl;
//vertex attributes
    var ext;
    //vertex attributes
    var aPosition; //webGL position vertex attribute
    var aNormal;    //webGL normal vertex attribute
    var aTexCoords;
//uniforms
    var uModel;     //webGL model uniform
    var uNormal;     //webGL normal uniform
    var uView;
    var uProjection;
    var uEnableAmbient,uEnableDiffuse, uEnableSpecular, uEyePosition, uEnableFog; //webGL light property variables
    var enableAmbient, enableDiffuse, enableSpecular, enableFog;
    var uSampler0;
    var uLightDirection, uLightAmbient, uLightDiffuse, uLightSpecular ;    //webGL material property variables
    var uMaterialAmbient, uMaterialDiffuse, uMaterialSpecular, uShininess ;
    var viewMatrix, projectionMatrix;
    var Materials = {};  //object containing constants for different materials

    var IMAGE_SOURCES_ARRAY;    //array containing name and file path for image sources
    var imagesArray;            //array containing image elements
    var freeCamera,fpCamera,currentCamera,currentLighting,defaultLighting,mouse;
    var freeze;
    initializeWebGLVariables(); //initialize variables declared above

    //Box(w,l,d,[material],wm,lm,dm)  material = material properties and texture
    //Box(w,l,d,[material1, material2, material3],wm,lm,dm)  [] = [front/back, top/bottom, right/left]
    //Box(w,l,d,[material1, material2, material3, material4, material5, material6],wm,lm,dm)    [] = [front, back, top, bottom, right, left]
    //wm, lm, and dm are texture modifiers to scale the size of the texture to the object

    var lwallBox = new Box(30.75,2.0,0.25,[Materials.TILE_WHITE],1,1,1);
    var lwallBox2 = new Box(13.5,2.0,0.25,[Materials.TILE_WHITE],1,1,1);
    var lwallBox3 = new Box(16.25,2.0,0.25,[Materials.TILE_WHITE],1,1,1);
    var swallBox = new Box(28,2.0,0.25,[Materials.TILE_WHITE],1,1,1);
    var _vcorridor = new Box(20,2.02,0.001,[Materials.TILE_BLUE],1,1,1);
    var _hcorridor = new Box(2.625,30.5,0.001,[Materials.TILE_BLUE],1,1,1);
    var _2x10floor = new Box(2,10,0.001,[Materials.TILE_BLUE],1,1,1);
    var _2x12floor = new Box(2,12.375,0.001,[Materials.TILE_BLUE],1,1,1);
    var _2x30floor = new Box(1.875,30.5,0.001,[Materials.TILE_BLUE],1,1,1);
    var _5x9floor = new Box(5,9,0.001,[Materials.RED_STONE],1,1,1);
    var _5x6floor = new Box(5,6,0.001,[Materials.BLACK_WHITE],1,1,1);
    var _5x5floor = new Box(5.25,5,0.002,[Materials.DARK_YELLOW],1,1,1);
    var _lkfloor = new Box(5,9,0.001,[Materials.BLACK_WHITE],1,1,1);
    var _wcrfloor = new Box(3,6,0.002,[Materials.WOMEN],1,1,1);
    var _mcrfloor = new Box(3,6,0.002,[Materials.MEN],1,1,1);

    var _1mBox = new Box(0.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _2mBox = new Box(1.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _3mBox = new Box(2.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _4m2Box = new Box(4.25,2.0,0.25,[Materials.VINYL],1,1,1);

    var _4mBox = new Box(3.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _5mBox = new Box(4.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _6mBox = new Box(6.25,2.0,0.25,[Materials.VINYL],1,1,1);
    var _8mBox = new Box(8.25,2.0,0.25,[Materials.VINYL],1,1,1);
    var _9mBox = new Box(9.25,2.0,0.25,[Materials.VINYL],1,1,1);
    var _10mBox = new Box(10.0,2.0,0.25,[Materials.VINYL],1,1,1);
    var _13mBox = new Box(12.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _17mBox = new Box(16.75,2.0,0.25,[Materials.VINYL],1,1,1);
    var _20mBox = new Box(19.75,2.0,0.25,[Materials.VINYL],1,1,1);

    var ttop = new Box(1,1,0.05,[Materials.WOOD],1,1,1);			//table
    var tlegs = new Box(0.05,0.05,0.75,[Materials.WOOD],1,1,1);
    var srow = new Box(0.5,1.95,0.05,[Materials.WOOD],1,1,1);	//shelf
    var scolumn = new Box(0.5,0.05,2.05,[Materials.WOOD],1,1,1);
    var cflat = new Box(0.5,0.5,0.05,[Materials.WOOD],1,1,1);	//chair
    var ctlegs = new Box(0.05,0.05,0.5,[Materials.WOOD],1,1,1);
    var cblegs = new Box(0.05,0.05,0.375,[Materials.WOOD],1,1,1);
    var cback = new Box(0.05,0.25,0.4,[Materials.WOOD],1,1,1);
    var smain = new Box(2,0.5,0.5,[Materials.SOFA_SEAT],1,1,1);		//sofa
    var sback = new Box(2,0.25,1,[Materials.SOFA_SEAT],1,1,1);
    var sarm = new Box(0.25,0.75,0.75,[Materials.SOFA_SEAT],1,1,1);
    var smain2 = new Box(0.5,2,0.5,[Materials.SOFA_SEAT2],1,1,1);		//sofa2
    var sback2 = new Box(0.25,2,1,[Materials.SOFA_SEAT2],1,1,1);
    var sarm2 = new Box(0.75,0.25,0.75,[Materials.SOFA_SEAT2],1,1,1);
    var dtop = new Box(2,0.05,1,[Materials.WOOD],1,1,1);         //table
    var dbox = new Box(0.75,0.5,1,[Materials.WOOD],1,1,1);         //table
    var dstand = new Box(0.05,0.45,1,[Materials.WOOD],1,1,1);         //table

    var woodendoor = new Box(1,2,0.05,[Materials.DOOR, Materials.WOOD, Materials.WOOD],1,0.5,1);
    var step = new Box(1.75,0.25,1,[Materials.RED_STONE],1,1,1);
    var emergency_step = new Box(0.8,0.2,1.5,[Materials.BLACK_WHITE],1,1,1);


    animate();

    function animate(){
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);
        //gl.disable(gl.DEPTH_TEST);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0,0,canvas.width,canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        setLighting();
        setCamera();
        drawScene();

        requestAnimFrame(animate);
    }

    function drawTable(x,y,z){
        drawObject(ttop,[x,y-0.25,z],90,0);
        drawObject(tlegs,[x+0.75,y-1,z+0.75],90,0);
        drawObject(tlegs,[x+0.75,y-1,z-0.75],90,0);
        drawObject(tlegs,[x-0.75,y-1,z+0.75],90,0);
        drawObject(tlegs,[x-0.75,y-1,z-0.75],90,0);
    }

    function drawShelf(x,y,z,a,b){
        drawObject(srow,[x,y,z],a,b);
        drawObject(srow,[x,y-1,z],a,b);
        drawObject(srow,[x,y-2,z],a,b);
        drawObject(scolumn,[x,y-2,z+2],a,b);
        drawObject(scolumn,[x,y-2,z-2],a,b);
    }

    function drawChair(x,y,z,a,b){
        drawObject(cflat,[x,y,z],a,b);
        drawObject(cblegs,[x+0.45,y-0.425,z+0.45],a,b);
        drawObject(cblegs,[x-0.45,y-0.425,z+0.45],a,b);
        drawObject(cblegs,[x+0.45,y-0.425,z-0.45],a,b);
        drawObject(cblegs,[x-0.45,y-0.425,z-0.45],a,b);
        drawObject(ctlegs,[x+0.45,y+0.55,z+0.45],a,b);
        drawObject(ctlegs,[x-0.45,y+0.55,z+0.45],a,b);
        drawObject(cback,[x,y+0.8,z+0.45],a+90,b+90);
    }

    function drawSofa(x,y,z,a,b,c){
        drawObject(smain,[x,y,z],a,b);
        drawObject(sback,[x,y+0.5,z-0.75],a,b);
        drawObject(sarm,[x+2.25,y+0.25,z],a,b);
        drawObject(sarm,[x-2.25,y+0.25,z],a,b);
    }

    function drawSofa2(x,y,z,a,b,c){
        drawObject(smain2,[x,y,z],a,b);
        drawObject(sback2,[x+0.75,y+0.5,z],a,b);
        drawObject(sarm2,[x,y+0.25,z+2.25],a,b);
        drawObject(sarm2,[x,y+0.25,z-2.25],a,b);
    }

    function drawDesk(x,y,z,a,b,c){
        drawObject(dtop,[x,y,z],a,b);
        drawObject(dbox,[x-1.25,y-0.6,z],a,b);
        drawObject(dbox,[x+1.25,y-0.6,z],a,b);
        drawObject(dtop,[x,y-1,z-1],90,b);
        drawObject(dstand,[x-1.95,y-1.55,z],a,b);
        drawObject(dstand,[x+1.95,y-1.55,z],a,b);

    }

    function drawScene(){
        //drawObject(floorBox,[0,-1,0],90,0);         //object, position(x,y,z), rotationX, rotationY
        //floors
        drawObject(_vcorridor,[1,0,6],90,0);    //vertical corridors
        drawObject(_vcorridor,[1,-0.005,-6],90,0);
        drawObject(_vcorridor,[1,0,-28.25],90,0);
        drawObject(_vcorridor,[1,0,28.25],90,0);
        drawObject(_hcorridor,[23.625,0,0],90,0);   //horizontal corridors
        drawObject(_5x9floor,[-4.25,0,17],90,0);    //5x9 floors
        drawObject(_5x9floor,[5.75,0,17],90,0);
        drawObject(_5x9floor,[15.75,0,17],90,0);
        drawObject(_5x9floor,[5.75,0,-17],90,0);
        drawObject(_5x9floor,[-4.25,0,-17],90,0);
        drawObject(_5x9floor,[-14.25,0,-17],90,0);
        drawObject(_5x6floor,[15.75,0,-20],90,0);   //board room floor
        drawObject(_lkfloor,[-14.25,0,17],90,0);    //lounge & kitchen floor
        drawObject(_5x5floor,[16,0,-9],90,0);       //patio
        drawObject(_wcrfloor,[-22,0.005,22],90,0);      //women's cr floor
        drawObject(_mcrfloor,[-22,0.005,-22],90,0);     //men's cr floor
        drawObject(_2x10floor,[-25,0,-20.25],90,0); //floors around front stairs
        drawObject(_2x12floor,[-25,0,18.375],90,0);
        drawObject(_2x30floor,[-21.125,0,0],90,0);
        drawObject(_2x30floor,[-28.875,0,0],90,0);
        //outer walls	
        drawObject(lwallBox2,[26.0,2,17.25],0,90);
        drawObject(lwallBox3,[26.0,2,-14.5],0,90);		//top is divided into two for the door
        drawObject(swallBox,[-2.25,2,30.5],0,0);
        drawObject(lwallBox,[-30.5,2,0],0,90);
        drawObject(swallBox,[-2.25,2,-30.5],0,0);
        //right rooms border walls
        drawObject(_1mBox,[20,2,8],0,0);
        drawObject(_8mBox,[-19,2,22],0,90);
        drawObject(_9mBox,[21,2,17],0,90);
        drawObject(_17mBox,[-2,2,8],0,0);
        drawObject(_20mBox,[1,2,26],0,0);
        //top right 5m x 9m lab lower wall
        drawObject(_3mBox,[11,2,11],0,90);
        drawObject(_4mBox,[11,2,22],0,90);
        //middle right 5m x 9m lab lower wall
        drawObject(_3mBox,[1,2,11],0,90);
        drawObject(_4mBox,[1,2,22],0,90);
        //lower right 5m x 9m lab lower wall
        drawObject(_3mBox,[-9,2,23],0,90);
        drawObject(_4mBox,[-9,2,12],0,90);
        //kitchen corner - left wall
        drawObject(_3mBox,[-11.5,2,20],0,0);
        //walls on void
        drawObject(_4m2Box,[21,2,0],0,90);
        drawObject(_10mBox,[-19,2,0],0,90);
        drawObject(_20mBox,[1,2,4],0,0);
        drawObject(_20mBox,[1,2,-4],0,0);
        //left rooms border walls
        drawObject(_6mBox,[21,2,-20],0,90);
        drawObject(_8mBox,[-19,2,-22],0,90);
        drawObject(_13mBox,[-6,2,-8],0,0);
        drawObject(_20mBox,[1,2,-26],0,0);
        //board room right walls
        drawObject(_1mBox,[20,2,-14],0,0);
        drawObject(_2mBox,[13,2,-14],0,0);
        //top left 5m x 9m lab upper wall
        drawObject(_3mBox,[11,2,-23],0,90);
        drawObject(_4mBox,[11,2,-12],0,90);
        //middle left 5m x 9m lab upper wall
        drawObject(_3mBox,[1,2,-11],0,90);
        drawObject(_4mBox,[1,2,-22],0,90);
        //lower left 5m x 9m lab upper wall
        drawObject(_3mBox,[-9,2,-11],0,90);
        drawObject(_4mBox,[-9,2,-22],0,90);
        //women's comfort room
        drawObject(_1mBox,[-24,2,16],0,0);
        drawObject(_3mBox,[-22,2,28],0,0);
        drawObject(_6mBox,[-25,2,22],0,90);
        //men's comfort room
        drawObject(_1mBox,[-24,2,-16],0,0);
        drawObject(_3mBox,[-22,2,-28],0,0);
        drawObject(_6mBox,[-25,2,-22],0,90);
        //stairs(entrance)
        drawObject(_2mBox,[-25,2,-10],0,0);
        drawObject(_8mBox,[-27,2,-2],0,90);
        drawObject(_8mBox,[-23,2,-2],0,90);
        //stairs(exit)
        drawObject(_2mBox,[28,2,4],0,0);
        drawObject(_2mBox,[28,2,-6],0,0);
        drawObject(_5mBox,[29.5,2,-1],0,90);
        //doors(right) entrance to emergency
        drawObject(woodendoor,[-18,2,9.4],0,45);
        drawObject(woodendoor,[-18,2,14.5],0,-45);
        drawObject(woodendoor,[-8,2,15.1],0,45);
        drawObject(woodendoor,[-8,2,20.4],0,-45);
        drawObject(woodendoor,[2,2,13.1],0,45);
        drawObject(woodendoor,[2,2,18.9],0,-45);
        drawObject(woodendoor,[12,2,13.1],0,45);
        drawObject(woodendoor,[12,2,18.9],0,-45);
        drawObject(woodendoor,[14,2,9],0,45);
        drawObject(woodendoor,[20,2,9],0,-45);
        //doors(left) entrance to emergency
        drawObject(woodendoor,[-18,2,-9.3],0,-45);
        drawObject(woodendoor,[-18,2,-14.4],0,45);
        drawObject(woodendoor,[-8,2,-13.1],0,-45);
        drawObject(woodendoor,[-8,2,-18.9],0,45);
        drawObject(woodendoor,[2,2,-13.1],0,-45);
        drawObject(woodendoor,[2,2,-18.9],0,45);
        drawObject(woodendoor,[12,2,-15.1],0,-45);
        drawObject(woodendoor,[12,2,-20.9],0,45);
        drawObject(woodendoor,[14,2,-15],0,-45);
        drawObject(woodendoor,[20,2,-15],0,45);
        //doors(others)
        drawObject(woodendoor,[-20.25,2,-16.1],0,0);//men's cr
        drawObject(woodendoor,[-24,2,-17],0,-45);
        drawObject(woodendoor,[-20.25,2,16.1],0,0);	//women's cr
        drawObject(woodendoor,[-24,2,17],0,45);
        drawObject(woodendoor,[-15,2,20.75],0,45);	//kitchen
        drawObject(woodendoor,[-17.75,2,20],0,0);
        drawObject(woodendoor,[9.75,2,-8.2],0,0);	//left near void
        drawObject(woodendoor,[6.1,2,-9],0,-45);
        drawObject(woodendoor,[26,2,2.75],0,90);	//emergency exit

        //stairs
        for(kkk = 0; kkk<9; kkk++)
            drawObject(step,[-25,-0.25-kkk*0.5,5-kkk],0,0);
        for(kkk = 0; kkk<9; kkk++)
            drawObject(emergency_step,[27,(0-kkk*0.4)-0.2,3.25-kkk-0.5],0,0);
        for(kkk = 0; kkk<9; kkk++)
            drawObject(emergency_step,[28.6,(-3.5-kkk*0.4)-0.2,-4.65+kkk-0.5],0,0);
        //board room facilities
        var x = 19.75, i=0, j=1.5;
        for(i=0;i<4;i++){
            drawTable(x-(i*2),1.75,-24.75);
            drawChair(x-(i*2),0.75,-23,90,0);
        }
        drawShelf(20.25,4,-20,90,0);
        //lounge facilities
        drawSofa(-13.5,0.5,9.25,90,0);
        drawSofa2(-10.25,0.5,12.5,90,0);
        for(i=0;i<2;i++){
            drawTable(-13-(i*2),1.75,12.5+j,90,0);
            if(i==0)
                continue;
            drawTable(-13,1.75,12.5-(i*2)+j,90,0);
        }
        drawTable(-15,1.75,10.5+j,90,0);

        drawDesk(50, 50, 60);
    }

    /* --- Lighting Settings --- */
    function setLighting(){
        //light direction
        var ld = currentLighting.lightDirection;
        var ls = currentLighting.lightSpecular;
        var ldf = currentLighting.lightDiffuse;     //light diffuse
        var amb = currentLighting.lightAmbient;
        gl.uniform1i(uEnableAmbient,enableAmbient);
        gl.uniform1i(uEnableDiffuse,enableDiffuse);
        gl.uniform1i(uEnableSpecular,enableSpecular);
        gl.uniform1i(uEnableFog,enableFog);

        gl.uniform3f(uLightDirection,ld.x,ld.y,ld.z);
        gl.uniform3f(uLightSpecular,ls.r,ls.g,ls.b);  //COLOR OF SPECULAR LIGHT
        gl.uniform3f(uLightDiffuse,ldf.r,ldf.g,ldf.b);
        gl.uniform3f(uLightAmbient,amb.r,amb.g,amb.b); //NATURAL LIGHT COLOR
        //eye  position for specular calculation
        var eyepos = currentCamera.eye;
        gl.uniform3f(uEyePosition,eyepos.x,eyepos.y,eyepos.z);
    }
    /* ------------------------- */

    /* --- Camera Settings --- */
    function setCamera(){
        //eye = point where the eye is
//        var eye = [30,1.0,5];      //worms eye view
        var eye = currentCamera.eye;  //eagles eye view
        var center = currentCamera.center;   //Point where the eye will look at
        var up = currentCamera.up;       //Camera up vector

        if(!freeze){
            currentCamera.theta = currentCamera.theta + mouse.dx;
            currentCamera.phi = currentCamera.phi + mouse.dy;
            if(currentCamera.theta > 360 || currentCamera.theta < -360) currentCamera.theta = 0;
            if(currentCamera.phi < 0) currentCamera.phi = 0;
            if(currentCamera.phi > 180) currentCamera.phi = 180;
            center.x = eye.x - 100*cosDegree(currentCamera.theta);
            center.y = eye.y - 100*cosDegree( currentCamera.phi );
            center.z = eye.z - 100*sinDegree(currentCamera.theta);
            if(!hasCollision()){
                var tunedSpeed = 0.1*currentCamera.moveSpeed;
                if(currentCamera.moveForward){
                    eye.x = eye.x - tunedSpeed*cosDegree(currentCamera.theta);
                    if(currentCamera.upMovable)
                        eye.y = eye.y - tunedSpeed*cosDegree( currentCamera.phi );
                    eye.z = eye.z - tunedSpeed*sinDegree(currentCamera.theta);
                }
                if(currentCamera.moveBackward){
                    eye.x = eye.x - tunedSpeed*cosDegree(currentCamera.theta - 180);
                    if(currentCamera.upMovable)
                        eye.y = eye.y - tunedSpeed*cosDegree(currentCamera.phi - 180);
                    eye.z = eye.z - tunedSpeed*sinDegree(currentCamera.theta - 180);
                }
                if(currentCamera.moveLeft){
                    eye.x = eye.x - tunedSpeed*cosDegree(currentCamera.theta - 90);
                    eye.z = eye.z - tunedSpeed*sinDegree(currentCamera.theta - 90);
                }
                if(currentCamera.moveRight){
                    eye.x = eye.x - tunedSpeed*cosDegree(currentCamera.theta + 90);
                    eye.z = eye.z - tunedSpeed*sinDegree(currentCamera.theta + 90);
                }
            }
        }

        mat4.lookAt(viewMatrix,
            [eye.x,eye.y,eye.z],
            [center.x,center.y,center.z],
            [up.x,up.y,up.z]
        );
        gl.uniformMatrix4fv(uView,false,viewMatrix);

        //print hud view matrix
        document.getElementById("view-eye").innerHTML = "("+eye.x+","+eye.y+","+eye.z+")";
        document.getElementById("view-center").innerHTML = "("+center.x+","+center.y+","+center.z+")";
        document.getElementById("view-up").innerHTML = "("+up.x+","+up.y+","+up.z+")";

        var perspectiveDegrees = currentCamera.perspectiveDegrees;
        var aspect = canvas.width/canvas.height;
        var near = currentCamera.near;
        var far = currentCamera.far;
        mat4.perspective(projectionMatrix,glMatrix.toRadian(perspectiveDegrees),aspect,near,far);
        gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

        //print hud projection matrix
        document.getElementById("projection-degrees").innerHTML = perspectiveDegrees+'&deg;';
        document.getElementById("projection-aspect").innerHTML = aspect;
        document.getElementById("projection-near").innerHTML = near;
        document.getElementById("projection-far").innerHTML = far;


    }
    /* ----------------------- */

    /*** Binds the object to draw to the webGL Array Buffer ***/
    /*
     * Note: Draw method only applies for box type objects
     *
     */

    function drawObject(model,position,rotationX,rotationY){
        if(imagesArray['seamless-marble-tile'].ready ){

            var modelMatrix = mat4.create();//reset model matrix
            mat4.translate(modelMatrix,modelMatrix,position);
            if(rotationX != null){
                mat4.rotateX(modelMatrix,modelMatrix, glMatrix.toRadian(rotationX));
            }
            if(rotationY != null){
                mat4.rotateY(modelMatrix,modelMatrix, glMatrix.toRadian(rotationY));
            }
            gl.uniformMatrix4fv(uModel,false,modelMatrix);
            var normalMatrix = mat4.create();
            mat4.invert(normalMatrix,modelMatrix);
            mat4.transpose(normalMatrix,normalMatrix);
            gl.uniformMatrix4fv(uNormal,false,normalMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, model.verticesBuffer);
            gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);

            gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
            gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,0,0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

            gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordsBuffer);
            gl.vertexAttribPointer(aTexCoords,2,gl.FLOAT,false,0,0);

            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.FRONT);
            draw(model);

            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            draw(model);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    function draw(model){
        //Draw Scene
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

        setMaterial((model.material)[0]);  //set Material to be used for rendering (The material is not the object being rendered)
        gl.drawElements(gl.TRIANGLES, model.indices.length/6, gl.UNSIGNED_BYTE, 0); //render front

        setMaterial((model.material)[1]);  //set Material to be used for rendering (The material is not the object being rendered)
        gl.drawElements(gl.TRIANGLES, model.indices.length/6, gl.UNSIGNED_BYTE, 6); //render back

        setMaterial((model.material)[2]);  //set Material to be used for rendering (The material is not the object being rendered)
        gl.drawElements(gl.TRIANGLES, model.indices.length/6, gl.UNSIGNED_BYTE, 12); //render top

        setMaterial((model.material)[3]);  //set Material to be used for rendering (The material is not the object being rendered)
        gl.drawElements(gl.TRIANGLES, model.indices.length/6, gl.UNSIGNED_BYTE, 18); //render bottom

        setMaterial((model.material)[4]);  //set Material to be used for rendering (The material is not the object being rendered)
        gl.drawElements(gl.TRIANGLES, model.indices.length/6, gl.UNSIGNED_BYTE, 24); //render right

        setMaterial((model.material)[5]);  //set Material to be used for rendering (The material is not the object being rendered)
        gl.drawElements(gl.TRIANGLES, model.indices.length/6, gl.UNSIGNED_BYTE, 30); //render left

    }

    /*** Sets the material properties to be used drawing/rendering an object ***/
    function setMaterial(material){
        material();
    }


    function handleTextureLoaded(image, texture, index){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        gl.activeTexture(gl.TEXTURE0 + index);  //Assigns texture from TEXTURE0 to TEXURE(n-1)  ; n = number of textures
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_ANISOTROPY_EXT, 4);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_ANISOTROPY_EXTX_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        //gl.compressedTexImage2D(gl.TEXTURE_2D, 0, ext.COMPRESSED_RGBA_S3TC_DXT5_EXT, 512, 512, 0, textureData); 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA  , gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    function initializeWebGLVariables(){
        canvas = document.getElementById("c");
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        //LISTENERS FOR CAMERA VIEWING
        canvas.onmouseenter = function(event){
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        MOUSE_SENSITIVITY = 3;

        enableAmbient = true;
        enableDiffuse = true;
        enableSpecular = true;
        enableFog = false;

        mouse = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            sensitivity : 3
        };
        initListeners(mouse);

        var cameraSettings = {
            eye : {
                x:10,
                y:10,
                z:10,
                direction : null
            },
            center : {
                x: 0,
                y: 0,
                z: 0
            },
            theta: 45, //in degrees
            phi: 45,
            up : {
                x: 0,
                y: 1,
                z: 0
            },
            near: 1,
            far: 500,
            perspectiveDegrees : 30,
            eyepos : {x:0,y:0,z:0},
            upMovable : true,
            moveSpeed: 3
        };
        freeCamera = new Camera(cameraSettings);
        cameraSettings.eye = {x:0,y:3,z:0};
        cameraSettings.upMovable = false;
        cameraSettings.moveSpeed = 1;
        fpCamera = new Camera(cameraSettings);
        currentCamera = freeCamera;


        var lightSettings = {
            lightDirection : {x: -1.0,y: -1.0,z: -1.0},     //light direction
            lightSpecular : {r: 1.0,g: 1.0,b: 1.0},     //light specular color
            lightDiffuse : {r: 1.0, g: 1.0, b: 1.0},        //light diffuse
            lightAmbient : { r: 0.5, g: 0.5, b: 0.5}        //ambient light color
        };
        defaultLighting = new Lighting(lightSettings);
        currentLighting = defaultLighting;

        initInputs(currentLighting);


        globalGL = initializeWebGL(canvas);
        gl = globalGL;
        ext = (
            gl.getExtension('EXT_texture_filter_anisotropic') ||
                gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
            );
        vertexShader = initializeShader(gl,"vshader");
        fragmentShader = initializeShader(gl, "fshader");
        program = initializeProgram(gl,vertexShader,fragmentShader);
        gl.useProgram(program);

        aPosition = gl.getAttribLocation(program,"aPosition"); // vertexMatrix attr
        aNormal = gl.getAttribLocation(program,"aNormal");      // normalMatrix attr

        uModel = gl.getUniformLocation(program,"uModel");       // modelMatrix attr
        uNormal = gl.getUniformLocation(program,"uNormal");
        uView = gl.getUniformLocation(program,"uView");         // viewMatrix attr
        uProjection = gl.getUniformLocation(program,"uProjection"); // projectionMatrix attr
        aTexCoords = gl.getAttribLocation(program,"aTexCoords");    //texture Mapping Buffer attr
        uSampler0 = gl.getUniformLocation(program, 'uSampler0');      //texture Sampler attr (picker)
        gl.enableVertexAttribArray(aPosition);
        gl.enableVertexAttribArray(aNormal);
        gl.enableVertexAttribArray(aTexCoords);

        /********** Initialize Light, Eye, And Material Property Variables ******************/
        uLightDirection= gl.getUniformLocation(program,"uLightDirection");
        uEyePosition= gl.getUniformLocation(program,"uEyePosition");
        uMaterialDiffuse = gl.getUniformLocation(program,"uMaterialDiffuse");
        uLightDiffuse = gl.getUniformLocation(program,"uLightDiffuse");
        uMaterialAmbient = gl.getUniformLocation(program,"uMaterialAmbient"); //COLOR REFLECTED FROM AMBIENT LIGHT
        uLightAmbient = gl.getUniformLocation(program,"uLightAmbient"); //NATURAL LIGHT COLOR
        uMaterialSpecular = gl.getUniformLocation(program,"uMaterialSpecular"); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
        uLightSpecular = gl.getUniformLocation(program,"uLightSpecular"); // LIGHT COLOR
        uShininess = gl.getUniformLocation(program,"uShininess");
        uEnableAmbient = gl.getUniformLocation(program,"uEnableAmbient");
        uEnableDiffuse = gl.getUniformLocation(program,"uEnableDiffuse");
        uEnableSpecular = gl.getUniformLocation(program,"uEnableSpecular");
        uEnableFog = gl.getUniformLocation(program,"uEnableFog");
        /********** INIT MATRIX VARIABLES ******************/
        viewMatrix = mat4.create();
        projectionMatrix = mat4.create();

        Materials = {};

        Materials.SILVER_MARBLE = function (){
            gl.uniform1i(uSampler0, 0);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.SEAMLESS_MARBLE = function (){
            gl.uniform1i(uSampler0, 1);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.RED_STONE = function (){
            gl.uniform1i(uSampler0, 2);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.VINYL = function (){
            gl.uniform1i(uSampler0, 3);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.DOOR = function (){
            gl.uniform1i(uSampler0, 4);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.MEN = function (){
            gl.uniform1i(uSampler0, 5);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.WOMEN = function (){
            gl.uniform1i(uSampler0, 6);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.BLACK_WHITE = function (){
            gl.uniform1i(uSampler0, 7);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.DARK_YELLOW = function (){
            gl.uniform1i(uSampler0, 8);
            gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
            gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        //Brass - texture yet just material properties
        Materials.BRASS = function (){  //taken from slidess
            gl.uniform1i(uSampler0, 0);  //change this
            gl.uniform3f(uMaterialDiffuse,0.78, 0.57, 0.11);
            gl.uniform3f(uMaterialSpecular,0.99, 0.91, 0.81); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.33,0.22,0.03); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,27.8);
        };

        //Brass - texture yet just material properties
        Materials.SOFA_SEAT = function (){  //taken from slidess
            gl.uniform1i(uSampler0, 9);  //change this
            gl.uniform3f(uMaterialDiffuse,0.15, 0.15, 0.58);
            gl.uniform3f(uMaterialSpecular,0.87, 0.87, 0.9); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.11,0.11,0.11); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.SOFA_SEAT2 = function (){  //taken from slidess
            gl.uniform1i(uSampler0,10);  //change this
            gl.uniform3f(uMaterialDiffuse,0.44, 0.15, 0.15);
            gl.uniform3f(uMaterialSpecular,0.9, 0.87, 0.87); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.11,0.11,0.11); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.WOOD = function (){  //taken from slidess
            gl.uniform1i(uSampler0,11);  //change this
            gl.uniform3f(uMaterialDiffuse,0.7, 0.5, 0.15);
            gl.uniform3f(uMaterialSpecular,0.9, 0.85, 0.70); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.11,0.11,0.11); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.TILE_BLUE = function (){  //taken from slidess
            gl.uniform1i(uSampler0, 12);  //change this
            gl.uniform3f(uMaterialDiffuse,0.15, 0.15, 0.38);
            gl.uniform3f(uMaterialSpecular,0.8, 0.85, 0.89); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.11,0.11,0.11); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        Materials.TILE_WHITE = function (){  //taken from slidess
            gl.uniform1i(uSampler0, 13);  //change this
            gl.uniform3f(uMaterialDiffuse,0.15, 0.15, 0.23);
            gl.uniform3f(uMaterialSpecular,0.87, 0.87, 0.9); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
            gl.uniform3f(uMaterialAmbient,0.11,0.11,0.11); //COLOR REFLECTED FROM AMBIENT LIGHT
            gl.uniform1f(uShininess,1.0);
        };

        IMAGE_SOURCES_ARRAY = [
            {name:'silver-marble-tile',src:'textures/silver-marble-tile.png'},
            {name:'seamless-marble-tile',src:'textures/seamless-marble-tile.png'},
            {name:'red-stone-tile',src:'textures/red-stone-tile.png'},
            {name:'vinyl-tile',src:'textures/wall-rough-lblue.png'},
            {name:'door',src:'textures/door2.png'},
            {name:'men',src:'textures/mcr.png'},
            {name:'women',src:'textures/wcr.png'},
            {name:'black_white',src:'textures/marble-black-white.png'},
            {name:'dark_yellow',src:'textures/dark-yellow.png'},
            {name:'sofa-seat',src:'textures/sofa-seat.png'},
            {name:'sofa-seat2',src:'textures/sofa-seat2.png'},
            {name:'wood',src:'textures/wood.png'},
            {name:'tile-blue',src:'textures/tile-blue.png'},
            {name:'tile-white',src:'textures/tile-white.png'}

        ];

        imagesArray = [];
        //Load all textures to imagesAray
        for(var ii = 0; ii < IMAGE_SOURCES_ARRAY.length; ii++){
            var image = new Image();
            image.ready = false;
            image.index = ii;
            image.onload = function(){
                handleTextureLoaded(this, gl.createTexture(), this.index); //(this = image , new texture, index in IMAGE_SOURCE_ARRAY)
                this.ready = true;
            };
            image.src = IMAGE_SOURCES_ARRAY[ii].src;
            imagesArray[IMAGE_SOURCES_ARRAY[ii].name] = image;
        }
    }

    function toggleLight(){
        if(enableAmbient && enableDiffuse && enableSpecular){
            enableAmbient = false;
            enableDiffuse = false;
            enableSpecular = false;
        }else if(!enableAmbient){
            enableAmbient = true;
        }else if(!enableDiffuse){
            enableDiffuse = true;
        }else if(!enableSpecular){
            enableSpecular = true;
        }
    }
    function initListeners(mouse){
        canvas.onmouseenter = function(event){
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        canvas.onkeyup = function(event){
            event = event || window.event;
            var keycode = event.charCode || event.keyCode;
            switch( keycode ) {
                case 87: /*W*/ currentCamera.moveForward = false; break;
                case 65: /*A*/ currentCamera.moveLeft = false; break;
                case 83: /*S*/ currentCamera.moveBackward = false; break;
                case 68: /*D*/ currentCamera.moveRight = false; break;
            }
        };
        canvas.onkeydown = function(event){
            event = event || window.event;
            var keycode = event.charCode || event.keyCode;
            switch ( keycode ) {
                case 87: /*W*/ currentCamera.moveForward = true; break;
                case 65: /*A*/ currentCamera.moveLeft = true; break;
                case 83: /*S*/ currentCamera.moveBackward = true; break;
                case 68: /*D*/ currentCamera.moveRight = true; break;
                case 76: /*L - light switch*/ toggleLight(); break;
                case 70: /*F - freeze*/ freeze = !freeze; break;
                case 71: /*G - fog*/ enableFog = !enableFog; break;
                case 86: /*V - change camera*/ if(currentCamera == fpCamera) currentCamera = freeCamera;
                else currentCamera = fpCamera;
                    break;
            }

        };

        canvas.onclick = function(event){
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        canvas.onmousemove = function(event){
            var canvasCenter = {
                x: canvas.width/2,
                y: canvas.height/2
            };
            mouse.dx = (event.clientX - canvasCenter.x)*mouse.sensitivity/1000;
            mouse.dy = (canvasCenter.y - event.clientY)*mouse.sensitivity/1000;

        };


        document.getElementById('ld-x').onkeyup = function(){
            currentLighting.lightDirection.x = parseFloat(this.value);
        };
        document.getElementById('ld-y').onkeyup = function(){
            currentLighting.lightDirection.y = parseFloat(this.value);
        };
        document.getElementById('ld-z').onkeyup = function(){
            currentLighting.lightDirection.z = parseFloat(this.value);
        };

        document.getElementById('la-r').onkeyup = function(){
            currentLighting.lightAmbient.r = parseFloat(this.value);
            console.log(currentLighting);

        };
        document.getElementById('la-g').onkeyup = function(){
            currentLighting.lightAmbient.g = parseFloat(this.value);

        };
        document.getElementById('la-b').onkeyup = function(){
            currentLighting.lightAmbient.b = parseFloat(this.value);

        };

        document.getElementById('ldf-r').onkeyup = function(){
            currentLighting.lightDiffuse.r = parseFloat(this.value);

        };
        document.getElementById('ldf-g').onkeyup = function(){
            currentLighting.lightDiffuse.g = parseFloat(this.value);

        };
        document.getElementById('ldf-b').onkeyup = function(){
            currentLighting.lightDiffuse.b = parseFloat(this.value);

        };

        document.getElementById('ls-r').onkeyup = function(){
            currentLighting.lightSpecular.r = parseFloat(this.value);

        };
        document.getElementById('ls-g').onkeyup = function(){
            currentLighting.lightSpecular.g = parseFloat(this.value);

        };
        document.getElementById('ls-b').onkeyup = function(){
            currentLighting.lightSpecular.b = parseFloat(this.value);
        };

    }


    function initInputs(){
        //light direction
        document.getElementById('ld-x').value = currentLighting.lightDirection.x;
        document.getElementById('ld-y').value = currentLighting.lightDirection.y;
        document.getElementById('ld-z').value = currentLighting.lightDirection.z;

        document.getElementById('la-r').value = currentLighting.lightAmbient.r;
        document.getElementById('la-g').value = currentLighting.lightAmbient.g;
        document.getElementById('la-b').value = currentLighting.lightAmbient.b;

        document.getElementById('ldf-r').value = currentLighting.lightDiffuse.r;
        document.getElementById('ldf-g').value = currentLighting.lightDiffuse.g;
        document.getElementById('ldf-b').value = currentLighting.lightDiffuse.b;

        document.getElementById('ls-r').value = currentLighting.lightSpecular.r;
        document.getElementById('ls-g').value = currentLighting.lightSpecular.g;
        document.getElementById('ls-b').value = currentLighting.lightSpecular.b;

    }

    canvas.focus();
}
/**
 *************************** END MAIN *****************************************
 */


function hasCollision(){
    return false;
}

function cosDegree(degree){
    return Math.cos(glMatrix.toRadian(degree));
}
function sinDegree(degree){
    return Math.sin(glMatrix.toRadian(degree));
}

function Lighting(lightSettings){
    this.lightDirection = lightSettings.lightDirection;
    this.lightSpecular = lightSettings.lightSpecular ; //light specular color
    this.lightDiffuse = lightSettings.lightDiffuse;      //light diffuse
    this.lightAmbient = lightSettings.lightAmbient;   //ambient light color
}
/* Camera settings, not yet implemented */
function Camera(cameraSettings){
    this.eye = cameraSettings.eye;
    this.center = cameraSettings.center;
    this.theta = cameraSettings.theta;
    this.phi = cameraSettings.phi;
    this.up = cameraSettings.up;
    this.near = cameraSettings.near;
    this.far = cameraSettings.far;
    this.perspectiveDegrees = cameraSettings.perspectiveDegrees;
    this.eyepos = cameraSettings.eyepos;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveSpeed = cameraSettings.moveSpeed;
    this.upMovable = cameraSettings.upMovable;
}

/* Box Class */
/**
 * @param w width
 * @param l length
 * @param d depth
 * @param material wat
 * @param wm texture modifier to scale the size of the texture to the width of the object
 * @param lm texture modifier to scale the size of the texture to the length of the object
 * @param dm texture modifier to scale the size of the texture to the depth of the object
 */
function Box(w,l,d,material,wm,lm,dm){
    this.width = w;
    this.length = l;
    this.height = d;
    this.vertices = [   // Coordinates
        // Front face
        -w, -l,  d,
        w, -l,  d,
        w,  l,  d,
        -w,  l,  d,

        // Back face
        -w, -l, -d,
        -w,  l, -d,
        w,  l, -d,
        w, -l, -d,

        // Top face
        -w,  l, -d,
        -w,  l,  d,
        w,  l,  d,
        w,  l, -d,

        // Bottom face
        -w, -l, -d,
        w, -l, -d,
        w, -l,  d,
        -w, -l,  d,

        // Right face
        w, -l, -d,
        w,  l, -d,
        w,  l,  d,
        w, -l,  d,

        // Left face
        -w, -l, -d,
        -w, -l,  d,
        -w,  l,  d,
        -w,  l, -d
    ];
    this.normals = [   // Coorlinates
        -1,-1,1,//front
        1,-1,1,
        1,1,1,
        -1,1,1,

        -1,-1,-1,//Back
        -1,1,-1,
        1,1,-1,
        1,-1,-1,

        -1,1,-1,//top
        -1,1,1,
        1,1,1,
        1,1,-1,

        -1,-1,-1,//bottom
        1,-1,-1,
        1,-1,1,
        -1,-1,1,

        1,-1,-1,//right
        1,1,-1,
        1,1,1,
        1,-1,1,

        -1,-1,-1,//left
        -1,-1,1,
        -1,1,1,
        -1,1,-1
    ];
    this.texCoords = [   // Coorlinates
        // Front
        0.0,    0.0,
        wm*w,   0.0,
        wm*w,   lm*l,
        0.0,    lm*l,
        // Back
        wm*w,   0.0,
        wm*w,   lm*l,
        0.0,    lm*l,
        0.0,    0.0,

        // Top
        0.0,    dm*d,
        0.0,    0.0,
        wm*w,   0.0,
        wm*w,   dm*d,
        // Bottom
        0.0,    0.0,
        wm*w,   0.0,
        wm*w,   dm*d,
        0.0,    dm*d,
        // Right
        dm*d,   0.0,
        dm*d,   lm*l,
        0.0,    lm*l,
        0.0,    0.0,
        // Left
        0.0,    0.0,
        dm*d,   0.0,
        dm*d,   lm*l,
        0.0,    lm*l
    ];

    jj = material.length;
    this.material = [];
    if(material.length == 1)
        for(iii = 0; iii < 6; iii++)
            this.material[iii] = material[0];
    else
        for(iii = 0; iii < 2; iii++){
            this.material[0 + iii] = material[0 + (material.length - 3)];
            this.material[2 + iii] = material[1 + (material.length - 3)];
            this.material[4 + iii] = material[2 + (material.length - 3)];
        }

    this.initBuffers();

}
Box.prototype.initBuffers = function(){
    var gl = globalGL;

    this.verticesBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.texCoordsBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
};

Box.prototype.indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
];
