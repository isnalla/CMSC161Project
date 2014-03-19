function initializeWebGL(canvas) {
			var contextNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
			var gl = null;
			for (var i = 0; i < contextNames.length; ++i) {
			try {
			gl = canvas.getContext(contextNames[i]);
			} 
			catch(e) {}
			if (gl) {
				break;
			}
			}
			if(!gl) {
				console.log("WebGL not available");
				return null;
			}
			else {
				console.log("WebGL context successfully initialized");
				return gl;
			}
}	
function initializeShader(gl,id) {
			var script = document.getElementById(id);
			var src = script.textContent;
			
			
			var shader;
			
			if(script.type == "x-shader/x-vertex")
				shader = gl.createShader(gl.VERTEX_SHADER);
			else if(script.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			}
			else {
				console.log("script.type may not be existent or unrecognized type");
				return null;
			}
			
			gl.shaderSource(shader,src);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
			}
			
			return shader;
}		
function initializeProgram(gl,vertexShader,fragmentShader) {
			var program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.log("Shaders cannot be initialized");
				return null;
			}
			
			return program;
}
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();