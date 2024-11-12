/*

 _____                         ______                 ___   ____ 
|  __ \                        |  _  \               /   | / ___|
| |  \/  __ _  _ __ ___    ___ | | | |  ___ __   __ / /| |/ /___ 
| | __  / _` || '_ ` _ \  / _ \| | | | / _ \\ \ / // /_| || ___ \
| |_\ \| (_| || | | | | ||  __/| |/ / |  __/ \ V / \___  || \_/ |
 \____/ \__,_||_| |_| |_| \___||___/   \___|  \_/      |_/\_____/


*/

/* 
	AUTHOR: GameDev46

	replit: https://replit.com/@GameDev46
	youtube: https://www.youtube.com/@gamedev46
	twitter: https://twitter.com/GameDev46
	github: https://github.com/GameDev46
*/

const canvas = document.querySelector("#shader");

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

let lastPauseTime = 0;

let planeAudio = new Audio('/planePropeller.mp3');
let planeEngineDuration = 1000;

let planeEngine;
let planePitch;
const context = new AudioContext();

function loadSample(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}

function playSample(sample, rate) {
  const source = context.createBufferSource();
  source.buffer = sample;
  source.playbackRate.value = rate;
  source.connect(context.destination);
  source.start(0);
	return source;
}

loadSample('planePropeller.mp3')
	.then(sample => {
		planeEngine = sample;
	});

let isSpectatorMode = false;

let playerMoveSpeed = 0;

let worldID = 0;

let fractalIndex = 0.1335;
let fractalFoldPower = 0.0;
let fractalRotatePower = 1.0;
let fractalSavedScale = 1.0;

let sunBrightness = 1;

document.getElementById("fractalSelector").value = fractalIndex;
document.getElementById("foldPower").value = fractalFoldPower;
document.getElementById("rotatePower").value = fractalRotatePower;
document.getElementById("fractalScale").value = fractalSavedScale;

document.getElementById("crosshair").style.opacity = 0;

// Start game on click

document.getElementById("begin").addEventListener("click", e => {
	
	camera.moveSpeed = 0.1875;
	planeEngineDuration = planeAudio.duration - 0.1;
	isSpectatorMode = false;

	document.getElementById("menuScreen").style.display = "none";
	document.getElementById("crosshair").style.opacity = 1;

	document.getElementById("spectator").style.display = "none";
	document.getElementById("begin").style.display = "none";
	
})

// Spectator Mode

document.getElementById("spectator").addEventListener("click", e => {
	
	camera.moveSpeed = 1.25;
	planeEngineDuration = -1;
	isSpectatorMode = true;

	document.getElementById("menuScreen").style.display = "none";
	document.getElementById("crosshair").style.opacity = 1;

	document.getElementById("spectator").style.display = "none";
	document.getElementById("begin").style.display = "none";
	
})

canvas.onclick = function() {
	canvas.requestPointerLock();
}

function lockChangeAlert() {

	if (document.pointerLockElement === canvas ||
		document.mozPointerLockElement === canvas) {

		document.addEventListener("mousemove", getMouseMovement, false);

	} else {

		document.removeEventListener("mousemove", getMouseMovement, false);

	}
}

function getMouseMovement(e) {

	let movementX = e.movementX || e.mozMovementX || 0;
	let movementY = e.movementY || e.mozMovementY || 0;

	if (isSpectatorMode) {
		camera.yRot += movementX * camera.sensitivity;
		camera.xRot -= movementY * camera.sensitivity;
	}
	
}

function cubeSDF(p, pos, r) {
	return Math.max(Math.max(Math.abs(p.x - pos.x), Math.abs(p.y - pos.y)), Math.abs(p.z - pos.z)) - r.x;
}

let keyboard = {};

document.addEventListener("keyup", e => {
	keyboard[e.key.toString().toUpperCase()] = false;
})

document.addEventListener("keydown", e => {
	keyboard[e.key.toString().toUpperCase()] = true;
})

function playerController(camForward, camRight) {
	
	if (keyboard["W"] == true) {
		camera.x += camForward[0] * camera.moveSpeed * camera.deltaTime;
		camera.y += camForward[1] * camera.moveSpeed * camera.deltaTime;
		camera.z += camForward[2] * camera.moveSpeed * camera.deltaTime;

		playerMoveSpeed += 1;
	}

	if (keyboard["S"] == true) {		
		camera.x -= camForward[0] * camera.moveSpeed * camera.deltaTime;
		camera.y -= camForward[1] * camera.moveSpeed * camera.deltaTime;
		camera.z -= camForward[2] * camera.moveSpeed * camera.deltaTime;

		playerMoveSpeed += 1;
	}

	if (keyboard["A"] == true) {
		camera.x -= camRight[0] * camera.moveSpeed * camera.deltaTime;
		camera.y -= camRight[1] * camera.moveSpeed * camera.deltaTime;
		camera.z -= camRight[2] * camera.moveSpeed * camera.deltaTime;

		playerMoveSpeed += 1;
	}

	if (keyboard["D"] == true) {
		camera.x += camRight[0] * camera.moveSpeed * camera.deltaTime;
		camera.y += camRight[1] * camera.moveSpeed * camera.deltaTime;
		camera.z += camRight[2] * camera.moveSpeed * camera.deltaTime;

		playerMoveSpeed += 1;
	}
	
}

function processInput() {

	let camForward = [Math.sin(camera.yRot) * Math.cos(camera.xRot), Math.sin(camera.xRot), Math.cos(camera.yRot) * Math.cos(camera.xRot)];
	let camRight = [Math.sin(camera.yRot + (Math.PI * 0.5)), 0, Math.cos(camera.yRot + (Math.PI * 0.5))];

	if (isSpectatorMode) {
		playerController(camForward, camRight);
		return;
	}
	camera.x += camForward[0] * camera.moveSpeed * camera.deltaTime;
	camera.y += camForward[1] * camera.moveSpeed * camera.deltaTime;
	camera.z += camForward[2] * camera.moveSpeed * camera.deltaTime;

	if (camera.moveSpeed > 0) {
		playerMoveSpeed += 1;
	}

	if (keyboard["W"] == true) {
		plane.tilt.y += plane.pitchSpeed * camera.deltaTime;
	}

	if (keyboard["S"] == true) {		
		plane.tilt.y -= plane.pitchSpeed * camera.deltaTime;
	}

	if (keyboard["A"] == true) {
		plane.tilt.x -= plane.tiltSpeed * camera.deltaTime;
	}

	if (keyboard["D"] == true) {
		plane.tilt.x += plane.tiltSpeed * camera.deltaTime;
	}

	plane.tilt.x *= 0.97;
	plane.tilt.y *= 0.97;
	plane.tilt.z *= 0.97;

	camera.yRot += plane.tilt.x;
	camera.xRot += plane.tilt.y;
	//camera.zRot += plane.tilt.z;

	plane.yaw -= plane.tilt.x * 26 * camera.deltaTime;
	plane.yaw -= plane.yaw * 5 * camera.deltaTime;
	
	plane.yaw = Math.min(plane.yawRange, Math.max(-plane.yawRange, plane.yaw));

	camera.zRot = plane.yaw;
}

function checkForPause() {
	
	if (keyboard["P"] == true && lastPauseTime < Date.now() - 500) {

		lastPauseTime = Date.now();
		
		if (camera.moveSpeed == 0) {

			camera.moveSpeed = camera.savedMoveSpeed;

			document.getElementById("menuScreen").style.display = "none";
			document.getElementById("crosshair").style.opacity = 1;
			
		}
		else {
			
			camera.savedMoveSpeed = camera.moveSpeed;
			camera.moveSpeed = 0;

			document.getElementById("menuScreen").style.display = "block";
			document.getElementById("crosshair").style.opacity = 0;
			
		}
		
	}
	
}

let camera = {
	x: 0,
	y: 0,
	z: 5,
	xRot: 0,
	yRot: Math.PI,
	zRot: 0,
	sensitivity: 0.007,
	moveSpeed: 0,
	deltaTime: 1
}

let plane = {
	tilt: {
		x: 0,
		y: 0,
		z: 0
	},
	tiltSpeed: 0.02,
	pitchSpeed: 0.02,
	yaw: 0,
	yawRange: 0.1,
	size: 0.1
}

function createSolidTexture(gl, pixelList, can) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	// Upload data to the texture
	const width = can.width; // Width of the texture
	const height = can.height; // Height of the texture
	const level = 0; // Mipmap level
	const border = 0; // Border width
	const format = gl.RGBA; // Format of the source data
	const type = gl.UNSIGNED_BYTE; // Type of the source data
	const pixels = pixelList; // Your Uint8Array data
	
	gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, width, height, border, format, type, pixels);

	gl.bindTexture(gl.TEXTURE_2D, null);

	// Activate texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	return texture;
}

// Change shader for each scene

let stopGraphics = false;

document.getElementById("worldSelector").addEventListener("change", e => {

	let worldDropdown = Number(document.getElementById("worldSelector").value)
	if (worldDropdown != worldID) playerMoveSpeed += 1;
	worldID = worldDropdown;

	stopGraphics = true;

	let waitTime = setTimeout(loadGraphics, 1000);
	
})

function loadGraphics() {
	
	fetch("shaders/shader" + worldID + ".glsl")
	  .then((res) => res.text())
	  .then((fragCode) => {

		stopGraphics = false;
	
		const gl = canvas.getContext("webgl");
		
		const verts = [
		  -1,  1,
		  1,  1,
		  1, -1,
		  -1, -1,
		];
		
		const indices = [0, 1, 3, 1, 2, 3];
		const vbuf = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		const ibuf = gl.createBuffer();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		const vertCode =
		'attribute vec2 v_pos;' +
		'varying vec2 a_pos;' +
		            
		'void main(void) {' +
		    'a_pos = v_pos;' +
		    'gl_Position = vec4(v_pos, 0.0, 1.0);' +
		'}';
		
		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, vertCode);
		gl.compileShader(vertShader);
		
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, fragCode); 
		gl.compileShader(fragShader);
		
		const msg = gl.getShaderInfoLog(fragShader);
		
		if (msg) console.error(msg);
		
		const prog = gl.createProgram();
		
		gl.attachShader(prog, vertShader);
		gl.attachShader(prog, fragShader);
		gl.linkProgram(prog);
		gl.useProgram(prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
					
		const coord = gl.getAttribLocation(prog, "v_pos");
		gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0); 
		gl.enableVertexAttribArray(coord);
		
		gl.clearColor(0, 0, 0, 1);
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.enable(gl.DEPTH_TEST);
	
	  const cameraPos = gl.getUniformLocation(prog, "cameraPos");	
		const cameraRot = gl.getUniformLocation(prog, "cameraRot");
	
		const cameraAspect = gl.getUniformLocation(prog, "cameraAspect");
		gl.uniform1f(cameraAspect, window.innerWidth / window.innerHeight);

		const fractalSize = gl.getUniformLocation(prog, "fractalScale");
		const fractalFloat = gl.getUniformLocation(prog, "fractalFloat");
		const fractalFold = gl.getUniformLocation(prog, "fractalFold");
		const fractalRotate = gl.getUniformLocation(prog, "fractalRotate");
	
		const timer = gl.getUniformLocation(prog, "uTime");
	
		const lastFrameText = gl.getUniformLocation(prog, "previousFrame");
		const frameCounter = gl.getUniformLocation(prog, "renderedFrames");
	
		const shaderMoving = gl.getUniformLocation(prog, "isMoving");
	
		// Get light locations
	
		let lightLocations = [
		  "position",
		  "colour",
		  "intensity"
		];
		 
		let program = {
		  uniform: {
		    lights: []
		  }
		};
		 
		for (let ll = 0; ll < 3; ll++) {
		  let locations = {};
			
		  for (let jj = 0; jj < lightLocations.length; ++jj) {
				
		    let name = lightLocations[jj];
		    locations[name] = gl.getUniformLocation(prog, "lights[" + ll + "]." + name);
				
		  }
			
		  program.uniform.lights[ll] = locations;
		}
	
		gl.uniform3f(program.uniform.lights[0].position, 0, 100, 200);
		gl.uniform3f(program.uniform.lights[0].colour, 1, 1, 1);
		gl.uniform1f(program.uniform.lights[0].intensity, 5);
	
		let lastDate = Date.now();
		let timeCounter = planeEngineDuration + 1;
	
		let savedCamera = {
			xRot: camera.xRot,
			yRot: camera.yRot
		}
	
		let frames = 0;
		let pixels;
	
	  const frame = (t) => {
	
			frames += 1;
			
			let playerLookSpeed = Math.abs(camera.xRot - savedCamera.xRot) + Math.abs(camera.yRot - savedCamera.yRot);
			
			savedCamera =  {
				xRot: camera.xRot,
				yRot: camera.yRot
			}
	
			playerMoveSpeed = 0;
			if (camera.moveSpeed > 0) processInput();
	
			// Check to see if player pauses the game
			checkForPause();
			

			let tickSpeed = Number(document.getElementById("tickSpeed").value)
			gl.uniform1f(timer, (t / 1000) * tickSpeed);
			
			gl.uniform3f(cameraPos, camera.x, camera.y, camera.z);
			gl.uniform3f(cameraRot, camera.xRot, camera.yRot, camera.zRot);
	
			if (pixels != null) {
				createSolidTexture(gl, pixels, canvas)
				gl.uniform1i(lastFrameText, 0);
			}
	
			gl.uniform1f(frameCounter, frames);
	
			if (camera.moveSpeed == 0) {

				let fractalScale = Number(document.getElementById("fractalScale").value)
				if (fractalSavedScale != fractalScale) playerMoveSpeed += 1;			
				fractalSavedScale = fractalScale;
	
				let fractalSlider = Number(document.getElementById("fractalSelector").value)
				if (fractalIndex != fractalSlider) playerMoveSpeed += 1;			
				fractalIndex = fractalSlider;
	
				let foldSlider = Number(document.getElementById("foldPower").value)
				if (fractalFoldPower != foldSlider) playerMoveSpeed += 1;	
				fractalFoldPower = foldSlider;
	
				let rotateSlider = Number(document.getElementById("rotatePower").value)
				if (fractalRotatePower != rotateSlider) playerMoveSpeed += 1;	
				fractalRotatePower = rotateSlider;

				gl.uniform1f(fractalSize, fractalSavedScale);
				gl.uniform1f(fractalFloat, fractalIndex);
				gl.uniform1f(fractalFold, fractalFoldPower);
				gl.uniform1f(fractalRotate, fractalRotatePower);

				let sunSlider = Number(document.getElementById("sunBrightness").value)

				if (sunBrightness != sunSlider) playerMoveSpeed += 1;	
				sunBrightness = sunSlider;
				gl.uniform1f(program.uniform.lights[0].intensity, 5 * sunBrightness);
				
			}
			else {
				// Change sound based on direction
	
				if (!isSpectatorMode) {
					
					let pitch = 1 + Math.max(0, Math.abs(plane.yaw * 10) + Math.abs(plane.tilt.y * 90));
		
					timeCounter += camera.deltaTime * pitch;
		
					if (timeCounter >= planeEngineDuration) {
						planePitch = playSample(planeEngine, pitch);
		
						timeCounter = 0;
					}
					else {
						planePitch.playbackRate.value = pitch;
					}
	
				}
				
			}

			if (worldID == 6 || worldID == 1) playerMoveSpeed += 1;
	
			if (playerMoveSpeed + playerLookSpeed > 0) frames = 0;
	
			gl.uniform1f(shaderMoving, playerMoveSpeed + playerLookSpeed);
						
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	
			// ---------------
	
			// store pixels in typed array
	    pixels = new Uint8Array(4 * canvas.width * canvas.height);
	
	    // API:
	    // readPixels(int x, int y, long width, long height, enum format, enum type, object pixels)
	    // x,y: location of pixels to read pixels
	    // width/height: how bif of area to read pixels
	    // format: RGBA
	    // type: UNSIGNED_BYTE
	    // object: object in which to store the read pixels
	
			gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	
			// -------------
	
			camera.deltaTime = (Date.now() - lastDate) / 1000;
			lastDate = Date.now();

			if (!stopGraphics) {
	    	requestAnimationFrame(frame);
			}
			
	  };
	
	  frame();
	
	})
	.catch(console.error);

}

// Allow user to choose a resolution and then load webgl

const resolutions = [ [320, 180], [640, 360], [960, 540], [1280, 720], [1600, 900], [1920, 1080], [2560, 1440], [window.innerWidth, window.innerHeight] ];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.getElementById("menuScreen").style.display = "none";

for (let i = 0; i < resolutions.length; i++) {

	document.getElementById("resolution_" + i).addEventListener("click", e => {

		canvas.width = resolutions[i][0];
		canvas.height = resolutions[i][1];

		document.getElementById("resolutionSelect").style.display = "none";
		document.getElementById("menuScreen").style.display = "flex";

		loadGraphics();
		
	})
	
}
