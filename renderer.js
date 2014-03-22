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
    var Materials;  //object containing constants for different materials

    var IMAGE_SOURCES_ARRAY;    //array containing name and file path for image sources
    var imagesArray;            //array containing image elements

    initializeWebGLVariables(); //initialize variables declared above

    var wallBox,floorBox,heartBox,greenBox;
                      //Box(w,l,d,material)  material = material properties and texture
    wallBox = new Box(30.0,3.0,0.5,Materials.SILVER_MARBLE);
    floorBox = new Box(30.0,30.0,0.001,Materials.SEAMLESS_MARBLE);
    heartBox = new Box(1.0,1.0,1.0,Materials.RED_STONE);
    greenBox = new Box(1.0,1.0,1.0,Materials.VINYL);

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
        drawObject(floorBox,[0,-1,0],90,0);
        drawObject(wallBox,[0,0,30],0,0); //object, position(x,y,z), rotationX, rotationY
        drawObject(wallBox,[-30,0,0],0,90);
        drawObject(wallBox,[30,0,0],0,90);
        drawObject(wallBox,[0,0,-30],0,0);

        drawObject(heartBox,[-5,0,0]);
        drawObject(greenBox,[5,0,0]);

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

    /* Camera settings, not yet implemented */
    function Camera(cameraSettings){
        this.eye = cameraSettings.eye;
        this.center = cameraSettings.center;
        this.up = cameraSettings.up;
        this.near = cameraSettings.near;
        this.far = cameraSettings.far;
        this.perspectiveDegrees = cameraSettings.perspectiveDegrees;
        this.eyepos = cameraSettings.eyepos;
    }
    /* --- Camera Settings --- */
    function setCamera(){
        //eye = point where the eye is
        var eye = [30,1.0,5];      //worms eye view
//        var eye = [85,85,85]  //eagles eye view

        var center = [5,0,0];   //Point where the eye will look at
        var up = [0,1,0];       //Camera up vector
        mat4.lookAt(viewMatrix,eye,center,up);
        gl.uniformMatrix4fv(uView,false,viewMatrix);

        var perspectiveDegrees = 30;
        var aspect = canvas.width/canvas.height;
        var near = 1;
        var far = 250;
        mat4.perspective(projectionMatrix,glMatrix.toRadian(perspectiveDegrees),aspect,near,far);
        gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

        //i dunno wth is this
        var eyepos = { x: 85, y: 85,  z: 85};
        gl.uniform3f(uEyePosition,eyepos.x,eyepos.y,eyepos.z);
    }
    /* ----------------------- */


    var i = 0;
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
         globalGL = initializeWebGL(canvas)
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

         Materials.VINYL = function (){
             gl.uniform1i(uSampler, 2);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.DOOR = function (){
             gl.uniform1i(uSampler, 3);
             gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
             gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
             gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
             gl.uniform1f(uShininess,1.0);
         };

         Materials.RED_STONE = function (){
             gl.uniform1i(uSampler, 4);
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
             {name:'door',src:'textures/door.png'}
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

/* Box Class */
/**
 * @param w width
 * @param l length
 * @param d depth
 * @param material wat
 */
function Box(w,l,d,material){
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
        w,    0.0,
        w,    l,
        0.0,  l,
        0.0,  0.0,
        // Left
        0.0,  0.0,
        w,    0.0,
        w,    l,
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


