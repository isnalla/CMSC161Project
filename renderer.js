document.body.onload = main;

globalGL = null;
function main(){
    var canvas; //canvas element
    var vertexShader,fragmentShader;
    var program;
    var gl;
    //vertex attributes
    var aPosition; //webGL position vertex attribute
    var aNormal;    //webGL normal vertex attribute
    var aTexCoords;
    //uniforms
    var uModel;     //webGL model uniform
    var uNormal;     //webGL normal uniform
    var uView;
    var uProjection;
    var uSampler;
    var uEnableAmbient,uEnableDiffuse, uEnableSpecular, uEyePosition; //webGL light property variables
    var uLightDirection, uLightAmbient, uLightDiffuse, uLightSpecular ;    //webGL material property variables
    var uMaterialAmbient, uMaterialDiffuse, uMaterialSpecular, uShininess ;
    var viewMatrix, projectionMatrix;
    var Materials = {};  //object containing constants for different materials

    var IMAGE_SOURCES_ARRAY;    //array containing name and file path for image sources
    var imagesArray;            //array containing image elements
    var freeCamera,fpCamera,currentCamera,mouse;

    initializeWebGLVariables(); //initialize variables declared above

    //Box(w,l,d,material)  material = material properties and texture
    var lwallBox = new Box(30.75,3.0,0.25,Materials.SILVER_MARBLE);
    var swallBox = new Box(28,3.0,0.25,Materials.SILVER_MARBLE);
    var _vcorridor = new Box(20,2.25,0.0001,Materials.SILVER_MARBLE);
    var _hcorridor = new Box(2.625,30.5,0.0001,Materials.SILVER_MARBLE);
    var _2x10floor = new Box(2,10,0.0001,Materials.SILVER_MARBLE);
    var _2x12floor = new Box(2,12.375,0.0001,Materials.SILVER_MARBLE);
    var _2x30floor = new Box(1.875,30.5,0.0001,Materials.SILVER_MARBLE);
    var _5x9floor = new Box(5,9,0.001,Materials.RED_STONE);
    var _5x6floor = new Box(5,6,0.001,Materials.BLACK_WHITE);
    var _5x5floor = new Box(5.25,5,0.002,Materials.DARK_YELLOW);
    var _lkfloor = new Box(5,9,0.001,Materials.BLACK_WHITE);
    var _wcrfloor = new Box(3,6,0.002,Materials.WOMEN);
    var _mcrfloor = new Box(3,6,0.002,Materials.MEN);

    var _1mBox = new Box(0.75,3.0,0.25,Materials.VINYL);
    var _2mBox = new Box(1.75,3.0,0.25,Materials.VINYL);
    var _3mBox = new Box(2.75,3.0,0.25,Materials.VINYL);
    var _4m2Box = new Box(4.25,3.0,0.25,Materials.VINYL);

    var _4mBox = new Box(3.75,3.0,0.25,Materials.VINYL);
    var _5mBox = new Box(4.75,3.0,0.25,Materials.VINYL);
    var _6mBox = new Box(6.25,3.0,0.25,Materials.VINYL);
    var _8mBox = new Box(8.25,3.0,0.25,Materials.VINYL);
    var _9mBox = new Box(9.25,3.0,0.25,Materials.VINYL);
    var _10mBox = new Box(10.0,3.0,0.25,Materials.VINYL);
    var _13mBox = new Box(13.0,3.0,0.25,Materials.VINYL);
    var _17mBox = new Box(16.75,3.0,0.25,Materials.VINYL);
    var _20mBox = new Box(19.75,3.0,0.25,Materials.VINYL);


    animate();

    function animate(){
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        setLighting();
        setCamera();
        drawScene();

        requestAnimFrame(animate);
    }
    function drawScene(){
//drawObject(floorBox,[0,-1,0],90,0);         //object, position(x,y,z), rotationX, rotationY
        //floors
        drawObject(_vcorridor,[1,0,6],90,0);    //vertical corridors
        drawObject(_vcorridor,[1,0,-6],90,0);
        drawObject(_vcorridor,[1,0,-28],90,0);
        drawObject(_vcorridor,[1,0,28.5],90,0);
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
        drawObject(_wcrfloor,[-22,0,22],90,0);      //women's cr floor
        drawObject(_mcrfloor,[-22,0,-22],90,0);     //men's cr floor
        drawObject(_2x10floor,[-25,0,-20.25],90,0); //floors around front stairs
        drawObject(_2x12floor,[-25,0,18.375],90,0);
        drawObject(_2x30floor,[-21.125,0,0],90,0);
        drawObject(_2x30floor,[-28.875,0,0],90,0);
        //outer walls
        drawObject(swallBox,[-2.25,0,30.5],0,0);
        drawObject(lwallBox,[-30.5,0,0],0,90);
        drawObject(lwallBox,[26.0,0,0],0,90);
        drawObject(swallBox,[-2.25,0,-30.5],0,0);
        //right rooms border walls
        drawObject(_1mBox,[20,0,8],0,0);
        drawObject(_8mBox,[-19,0,22],0,90);
        drawObject(_9mBox,[21,0,17],0,90);
        drawObject(_17mBox,[-2,0,8],0,0);
        drawObject(_20mBox,[1,0,26],0,0);
        //top right 5m x 9m lab lower wall
        drawObject(_3mBox,[11,0,11],0,90);
        drawObject(_4mBox,[11,0,22],0,90);
        //middle right 5m x 9m lab lower wall
        drawObject(_3mBox,[1,0,11],0,90);
        drawObject(_4mBox,[1,0,22],0,90);
        //lower right 5m x 9m lab lower wall
        drawObject(_3mBox,[-9,0,23],0,90);
        drawObject(_4mBox,[-9,0,12],0,90);
        //kitchen corner - left wall
        drawObject(_3mBox,[-11.5,0,20],0,0);
        //walls on void
        drawObject(_4m2Box,[21,0,0],0,90);
        drawObject(_10mBox,[-19,0,0],0,90);
        drawObject(_20mBox,[1,0,4],0,0);
        drawObject(_20mBox,[1,0,-4],0,0);
        //left rooms border walls
        drawObject(_6mBox,[21,0,-20],0,90);
        drawObject(_8mBox,[-19,0,-22],0,90);
        drawObject(_13mBox,[-6,0,-8],0,0);
        drawObject(_20mBox,[1,0,-26],0,0);
        //board room right walls
        drawObject(_1mBox,[20,0,-14],0,0);
        drawObject(_2mBox,[13,0,-14],0,0);
        //top left 5m x 9m lab upper wall
        drawObject(_3mBox,[11,0,-23],0,90);
        drawObject(_4mBox,[11,0,-12],0,90);
        //middle left 5m x 9m lab upper wall
        drawObject(_3mBox,[1,0,-11],0,90);
        drawObject(_4mBox,[1,0,-22],0,90);
        //lower left 5m x 9m lab upper wall
        drawObject(_3mBox,[-9,0,-11],0,90);
        drawObject(_4mBox,[-9,0,-22],0,90);
        //women's comfort room
        drawObject(_1mBox,[-24,0,16],0,0);
        drawObject(_3mBox,[-22,0,28],0,0);
        drawObject(_6mBox,[-25,0,22],0,90);
        //men's comfort room
        drawObject(_1mBox,[-24,0,-16],0,0);
        drawObject(_3mBox,[-22,0,-28],0,0);
        drawObject(_6mBox,[-25,0,-22],0,90);
        //stairs(entrance)
        drawObject(_2mBox,[-25,0,-10],0,0);
        drawObject(_8mBox,[-27,0,-2],0,90);
        drawObject(_8mBox,[-23,0,-2],0,90);
        //stairs(exit)
        drawObject(_2mBox,[28,0,4],0,0);
        drawObject(_2mBox,[28,0,-6],0,0);
        drawObject(_5mBox,[29.5,0,-1],0,90);

    }

    /* --- Lighting Settings --- */
    function setLighting(){
        var enableAmbient = true;
        var enableDiffuse = true;
        var enableSpecular = true;
        //light direction
        var ld = {x: -1.0,y: -1.0,z: -1.0};     //light direction
        var ls = {r: 1.0,g: 1.0,b: 1.0};        //light specular color
        var ldf = {r: 1.0, g: 1.0, b: 1.0};        //light diffuse
        var amb = { r: 1.0, g: 1.0, b: 1.0};        //ambient light color

        gl.uniform1i(uEnableAmbient,enableAmbient);
        gl.uniform1i(uEnableDiffuse,enableDiffuse);
        gl.uniform1i(uEnableSpecular,enableSpecular);
        gl.uniform3f(uLightSpecular,ls.r,ls.g,ls.b);  //COLOR OF SPECULAR LIGHT
        gl.uniform3f(uLightDirection,ld.x,ld.y,ld.z);
        gl.uniform3f(uLightDiffuse,ldf.r,ldf.g,ldf.b);
        gl.uniform3f(uLightAmbient,amb.r,amb.g,amb.b); //NATURAL LIGHT COLOR
    }
/* ------------------------- */

    function hasCollision(){
        return false;
    }
    /* --- Camera Settings --- */
    function setCamera(){
        //eye = point where the eye is
//        var eye = [30,1.0,5];      //worms eye view
        var eye = currentCamera.eye;  //eagles eye view
        var center = currentCamera.center;   //Point where the eye will look at
        var up = currentCamera.up;       //Camera up vector

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

        mat4.lookAt(viewMatrix,
            [eye.x,eye.y,eye.z],
            [center.x,center.y,center.z],
            [up.x,up.y,up.z]
        );
        gl.uniformMatrix4fv(uView,false,viewMatrix);

        var perspectiveDegrees = currentCamera.perspectiveDegrees;
        var aspect = canvas.width/canvas.height;
        var near = currentCamera.near;
        var far = currentCamera.far;
        mat4.perspective(projectionMatrix,glMatrix.toRadian(perspectiveDegrees),aspect,near,far);
        gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

        //i dunno wth is this
        var eyepos = currentCamera.eyepos;
        gl.uniform3f(uEyePosition,eyepos.x,eyepos.y,eyepos.z);
    }
    /* ----------------------- */

    /*** Binds the object to draw to the webGL Array Buffer ***/
    function drawObject(model,position,rotationX,rotationY){
        if(imagesArray['seamless-marble-tile'].ready){
            setMaterial(model.material);  //set Material to be used for rendering (The material is not the object being rendered)

            //                  mat4.translate(modelMatrix,modelMatrix,[0,0,0]);
            //                  mat4.rotateX(modelMatrix,modelMatrix, glMatrix.toRadian(180+i));
            //                  mat4.rotateX(modelMatrix,modelMatrix, glMatrix.toRadian(i));
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

            //Draw Scene
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
            gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_BYTE, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    /*** Sets the material properties to be used drawing/rendering an object ***/
    function setMaterial(material){
        material();
    }
    function handleTextureLoaded(image, texture, index){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        gl.activeTexture(gl.TEXTURE0 + index);  //Assigns texture from TEXTURE0 to TEXURE(n-1)  ; n = number of textures
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB  , gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
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

         document.body.onkeyup = function(event){
             event = event || window.event;
             var keycode = event.charCode || event.keyCode;
             switch( keycode ) {
                 case 87: /*W*/ currentCamera.moveForward = false; break;
                 case 65: /*A*/ currentCamera.moveLeft = false; break;
                 case 83: /*S*/ currentCamera.moveBackward = false; break;
                 case 68: /*D*/ currentCamera.moveRight = false; break;
             }
         };

         document.body.onkeydown = function(event){
             event = event || window.event;
             var keycode = event.charCode || event.keyCode;

             switch ( keycode ) {
                 case 87: /*W*/ currentCamera.moveForward = true; break;

                 case 65: /*A*/ currentCamera.moveLeft = true; break;

                 case 83: /*S*/ currentCamera.moveBackward = true; break;

                 case 68: /*D*/ currentCamera.moveRight = true; break;
                 /*V*/
                 case 86: if(currentCamera == fpCamera) currentCamera = freeCamera;
                            else currentCamera = fpCamera;
                     break;
             }

         };

         canvas.onclick = function(event){
             mouse.x = event.clientX;
             mouse.y = event.clientY;
         };
         canvas.onmousemove = function(event){
             var screenCenter = {
                 x: screen.width/2,
                 y: screen.height/2
             };

             mouse.dx = (event.clientX - screenCenter.x)*mouse.sensitivity/1000;
             mouse.dy = (screenCenter.y - event.clientY)*mouse.sensitivity/1000;


         };
         MOUSE_SENSITIVITY = 3;
         mouse = {
             x: 0,
             y: 0,
             dx: 0,
             dy: 0,
             sensitivity : 3
         };

         var cameraSettings = {
             eye : {
                 x:0,
                 y:25,
                 z:90,
                 direction : null
             },
             center : {
                 x: 0,
                 y: 0,
                 z: 0
             },
             theta: 90, //in degrees
             phi: 90,
             up : {
                 x: 0,
                 y: 1,
                 z: 0
             },
             near: 1,
             far: 500,
             perspectiveDegrees : 30,
             eyepos : {x:50,y:50,z:50},
             upMovable : true,
             moveSpeed: 3
         };
         freeCamera = new Camera(cameraSettings);
         cameraSettings.eye = {x:0,y:1,z:0};
         cameraSettings.upMovable = false;
         cameraSettings.moveSpeed = 1;
         fpCamera = new Camera(cameraSettings);
         currentCamera = freeCamera;
         globalGL = initializeWebGL(canvas);
         gl = globalGL;
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
         uSampler = gl.getUniformLocation(program, 'uSampler');      //texture Sampler attr (picker)
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

         /********** INIT MATRIX VARIABLES ******************/
         viewMatrix = mat4.create();
         projectionMatrix = mat4.create();
         Materials = {};

         Materials.SILVER_MARBLE = function (){
             gl.uniform1i(uSampler, 0);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.SEAMLESS_MARBLE = function (){
             gl.uniform1i(uSampler, 1);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };


         Materials.RED_STONE = function (){
             gl.uniform1i(uSampler, 2);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.VINYL = function (){
             gl.uniform1i(uSampler, 3);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.DOOR = function (){
             gl.uniform1i(uSampler, 4);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.MEN = function (){
             gl.uniform1i(uSampler, 5);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.WOMEN = function (){
             gl.uniform1i(uSampler, 6);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.BLACK_WHITE = function (){
             gl.uniform1i(uSampler, 7);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.DARK_YELLOW = function (){
             gl.uniform1i(uSampler, 8);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         //Brass - texture yet just material properties
         Materials.BRASS = function (){  //taken from slidess
             gl.uniform1i(uSampler, 0);  //change this
             gl.uniform3f(uMaterialDiffuse,0.78, 0.57, 0.11);
             gl.uniform3f(uMaterialSpecular,0.99, 0.91, 0.81); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.33,0.22,0.03); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,27.8);
         };

         IMAGE_SOURCES_ARRAY = [
             {name:'silver-marble-tile',src:'textures/silver-marble-tile.png'},
             {name:'seamless-marble-tile',src:'textures/seamless-marble-tile.png'},
             {name:'red-stone-tile',src:'textures/red-stone-tile.png'},
             {name:'vinyl-tile',src:'textures/vinyl-tile.png'},
             {name:'door',src:'textures/door.png'},
             {name:'men',src:'textures/mcr.png'},
             {name:'women',src:'textures/wcr.png'},
             {name:'black_white',src:'textures/marble-black-white.png'},
             {name:'dark_yellow',src:'textures/dark-yellow.png'}
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
}
/**
  *************************** END MAIN *****************************************
 */
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
 */
function Box(w,l,d,material){
    this.position = [0,0,0];
    this.rotationX = 0;
    this.rotationY = 0;
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
    this.texCoords = [   // Coorlinates
        // Front
        0.0,  0.0,
        w,    0.0,
        w,    l,
        0.0,  l,
        // Back
        w,    0.0,
        w,    l,
        0.0,  l,
        0.0,  0.0,

        // Top
        0.0,  d,
        0.0,  0.0,
        w,    0.0,
        w,    d,
        // Bottom
        0.0,  0.0,
        w,    0.0,
        w,    d,
        0.0,  d,
        // Right
        d,    0.0,
        d,    l,
        0.0,  l,
        0.0,  0.0,
        // Left
        0.0,  0.0,
        d,    0.0,
        d,    l,
        0.0,  l
    ];
    this.material = material;
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

function cosDegree(degree){
    return Math.cos(glMatrix.toRadian(degree));
}
function sinDegree(degree){
    return Math.sin(glMatrix.toRadian(degree));
}