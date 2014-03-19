/********************START*************************
 *
 *          Initialize WEBGL Variables
 *
 * ******************START************************/

var canvas = document.getElementById("c");
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
var gl = initializeWebGL(canvas);
var vertexShader = initializeShader(gl,"vshader");
var fragmentShader = initializeShader(gl, "fshader");
var program = initializeProgram(gl,vertexShader,fragmentShader);
gl.useProgram(program);

var aPosition = gl.getAttribLocation(program,"aPosition"); // vertexMatrix attr
var aNormal = gl.getAttribLocation(program,"aNormal");      // normalMatrix attr

var uModel = gl.getUniformLocation(program,"uModel");       // modelMatrix attr
var uNormal = gl.getUniformLocation(program,"uNormal");
var uView = gl.getUniformLocation(program,"uView");         // viewMatrix attr
var uProjection = gl.getUniformLocation(program,"uProjection"); // projectionMatrix attr
var aTexCoords = gl.getAttribLocation(program,"aTexCoords");    //texture Mapping Buffer attr
var uSampler = gl.getUniformLocation(program, 'uSampler');      //texture Sampler attr (picker)

    /********** Initialize Light, Eye, And Material Property Variables ******************/
var uLightDirection= gl.getUniformLocation(program,"uLightDirection");
var uEyePosition= gl.getUniformLocation(program,"uEyePosition");
var uMaterialDiffuse = gl.getUniformLocation(program,"uMaterialDiffuse");
var uLightDiffuse = gl.getUniformLocation(program,"uLightDiffuse");
var uMaterialAmbient = gl.getUniformLocation(program,"uMaterialAmbient"); //COLOR REFLECTED FROM AMBIENT LIGHT
var uLightAmbient = gl.getUniformLocation(program,"uLightAmbient"); //NATURAL LIGHT COLOR
var uMaterialSpecular = gl.getUniformLocation(program,"uMaterialSpecular"); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
var uLightSpecular = gl.getUniformLocation(program,"uLightSpecular"); // LIGHT COLOR
var uShininess = gl.getUniformLocation(program,"uShininess");
var uEnableAmbient = gl.getUniformLocation(program,"uEnableAmbient");
var uEnableDiffuse = gl.getUniformLocation(program,"uEnableDiffuse");
var uEnableSpecular = gl.getUniformLocation(program,"uEnableSpecular");

    /********** INIT MATRIX VARIABLES ******************/
var viewMatrix = mat4.create();
var projectionMatrix = mat4.create();

    /********** Initialize Texture Images ******************/
var IMAGE_SOURCES_ARRAY = [
    {name:'wall',src:'textures/moon.png'},
    {name:'heart',src:'textures/heart512.png'},
    {name:'green',src:'textures/green.png'}
];
var imagesArray = [];
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
//Handle texture on image load
function handleTextureLoaded(image, texture, index){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0 + index);  //Assigns texture from TEXTURE0 to TEXURE(n-1)  ; n = number of textures
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB  , gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
}
/*********************END**************************
 *
 *         Initialize WEBGL Variables
 *
 * *******************END*************************/

document.body.onload = main;

var dy = 1;
var wallBox,heartBox,greenBox;
var grid;
function main(){
    wallBox = new Box(1.0,1.0,1.0,Materials.CEMENT);
    heartBox = new Box(1.0,1.0,1.0,Materials.HEART);
    greenBox = new Box(1.0,1.0,1.0,Materials.GREEN);
    grid = new Grid();

    animate();
}

/** END INIT TEXTURE IMAGES **/

/*  Box Model Class
 *  Box(length,width,height)
 *
 *  Accepts values 0.0 - 1.0 (1.0 = from -1.0 to 1.0)
 */

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

/* --- Lighting Settings --- */
function setLighting(){
    var enableAmbient = true;
    var enableDiffuse = true;
    var enableSpecular = true;
    //light direction
    var ld = {
        x: -1.0,
        y: -2.5,
        z: -5.0
    };
    //light specular color
    var ls = {
        r: 1.0,
        g: 1.0,
        b: 1.0
    };
    //light diffuse
    var ldf = {
        r: 1.0,
        g: 1.0,
        b: 1.0
    };
    //ambient light color
    var amb = {
        r: 0.2,
        g: 0.2,
        b: 0.2
    };
    gl.uniform1i(uEnableAmbient,enableAmbient);
    gl.uniform1i(uEnableDiffuse,enableDiffuse);
    gl.uniform1i(uEnableSpecular,enableSpecular);
    gl.uniform3f(uLightSpecular,ls.r,ls.g,ls.b);  //COLOR OF SPECULAR LIGHT
    gl.uniform3f(uLightDirection,ld.x,ld.y,ld.z);
    gl.uniform3f(uLightDiffuse,ldf.r,ldf.g,ldf.b);
    gl.uniform3f(uLightAmbient,amb.r,amb.g,amb.b); //NATURAL LIGHT COLOR
}
/* ------------------------- */

/* --- Camera Settings --- */
function setCamera(){
    var eye = [0,20,20];      //Point where the eye is
    var center = [0,0,0];   //Point where the eye will look at
    var up = [0,1,0];       //Camera up vector
    mat4.lookAt(viewMatrix,eye,center,up);
    gl.uniformMatrix4fv(uView,false,viewMatrix);

    var perspectiveDegrees = 30;
    var aspect = canvas.width/canvas.height;
    var near = 1;
    var far = 100;
    mat4.perspective(projectionMatrix,glMatrix.toRadian(perspectiveDegrees),aspect,near,far);
    gl.uniformMatrix4fv(uProjection,false,projectionMatrix);

    var eyepos = {
        x: 5,
        y: 5,
        z: 9
    };
    gl.uniform3f(uEyePosition,eyepos.x,eyepos.y,eyepos.z);
}
/* ----------------------- */

function drawScene(){
    drawObject(wallBox,[0,0,0]); //object, position(x,y,z)
    drawObject(heartBox,[-5,0,0])
}

/*** Binds the object to draw to the webGL Array Buffer ***/
function drawObject(model,position){
    if(imagesArray['wall'].ready){
        setMaterial(model.material);  //set Material to be used for rendering (The material is not the object being rendered)

        //                  mat4.translate(modelMatrix,modelMatrix,[0,0,0]);
        //                  mat4.rotateX(modelMatrix,modelMatrix, glMatrix.toRadian(180+i));
        //                  mat4.rotateX(modelMatrix,modelMatrix, glMatrix.toRadian(i));
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix,modelMatrix,position);
        mat4.rotateY(modelMatrix,modelMatrix, glMatrix.toRadian(dy));
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
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

/********************START*************************
 *
 *              Box Class Definition
 *
 * ******************START************************/
function Box(l,w,h,material){
    this.vertices = [   // Coordinates
        // Front face
        -l, -h,  w,
        l, -h,  w,
        l,  h,  w,
        -l,  h,  w,

        // Back face
        -l, -h, -w,
        -l,  h, -w,
        l,  h, -w,
        l, -h, -w,

        // Top face
        -l,  h, -w,
        -l,  h,  w,
        l,  h,  w,
        l,  h, -w,

        // Bottom face
        -l, -h, -w,
        l, -h, -w,
        l, -h,  w,
        -l, -h,  w,

        // Right face
        l, -h, -w,
        l,  h, -w,
        l,  h,  w,
        l, -h,  w,

        // Left face
        -l, -h, -w,
        -l, -h,  w,
        -l,  h,  w,
        -l,  h, -w
    ];
    this.normals = [   // Coordinates
        // Front face
        -l, -h,  w,
        l, -h,  w,
        l,  h,  w,
        -l,  h,  w,

        // Back face
        -l, -h, -w,
        -l,  h, -w,
        l,  h, -w,
        l, -h, -w,

        // Top face
        -l,  h, -w,
        -l,  h,  w,
        l,  h,  w,
        l,  h, -w,

        // Bottom face
        -l, -h, -w,
        l, -h, -w,
        l, -h,  w,
        -l, -h,  w,

        // Right face
        l, -h, -w,
        l,  h, -w,
        l,  h,  w,
        l, -h,  w,

        // Left face
        -l, -h, -w,
        -l, -h,  w,
        -l,  h,  w,
        -l,  h, -w
    ];
    this.texCoords = [   // Coordinates
        // Front
        0.0,  0.0,
        l,    0.0,
        l,    h,
        0.0,  h,
        // Back
        l,    0.0,
        l,    h,
        0.0,  h,
        0.0,  0.0,

        // Top
        0.0,  w,
        0.0,  0.0,
        l,    0.0,
        l,    w,
        // Bottom
        0.0,  0.0,
        l,    0.0,
        l,    w,
        0.0,  w,
        // Right
        w,    0.0,
        w,    h,
        0.0,  h,
        0.0,  0.0,
        // Left
        0.0,  0.0,
        w,    0.0,
        w,    h,
        0.0,  h
    ];
    this.material = material;
    this.initBuffers();
}
Box.prototype.initBuffers = function(){
    this.verticesBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.texCoordsBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aNormal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

    gl.vertexAttribPointer(aTexCoords,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(aTexCoords);
};
Box.prototype.indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
];
/********************END*************************
 *
 *              Box Class Definition
 *
 * ******************END************************/
function Grid(){
    this.vertices = [
        0.0,5.0,0.0,
        0.0,-5.0,0,0,
        0.0,0.0,0.0

    ];
    this.color = {
        r: 1.0,
        g: 1.0,
        b: 1.0
    };

    this.initBuffers();
}
Grid.prototype.initBuffers = function(){
    this.verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertices),gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(aPosition);

};
 /********************START************************
 *
 *              Material CONSTANTS
 *
 * ******************START************************/
var Materials = {};
Materials.CEMENT = function (){
     gl.uniform1i(uSampler, 0);
     gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
     gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
     gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
     gl.uniform1f(uShininess,1.0);
 };
Materials.HEART = function (){
    gl.uniform1i(uSampler, 1);
    gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
    gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
    gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
    gl.uniform1f(uShininess,1.0);
};
Materials.GREEN = function (){
    gl.uniform1i(uSampler, 2);
    gl.uniform3f(uMaterialDiffuse,0.0,0.0,0.0);
    gl.uniform3f(uMaterialSpecular,0.3,0.3,0.3); //COLOR MATERIAL REFLECTS (MATERIAL COLOR)
    gl.uniform3f(uMaterialAmbient,0.2,0.2,0.2); //COLOR REFLECTED FROM AMBIENT LIGHT
    gl.uniform1f(uShininess,1.0);
};
