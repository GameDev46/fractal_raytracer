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

	Give clear and visible credit if using! (much appreciated 😄)

 	PLEASE DO NOT REMOVE THESE CREDITS!
*/

precision mediump float;
varying vec2 a_pos;

uniform vec3 cameraPos;
uniform vec3 cameraRot;

uniform float cameraAspect;

uniform float fractalScale;
uniform float fractalFloat;
uniform float fractalRotate;
uniform float fractalFold;

uniform float uTime;
uniform float renderedFrames;

uniform float worldType;

uniform sampler2D previousFrame;

uniform float isMoving;

const int NUMBER_OF_STEPS = 400;

// KEEP LOW!!!
const int PIXEL_AVERAGE_COUNT = 1;
const int MAX_BOUNCES_WHEN_MOVING = 1;
const int MAX_BOUNCES = 5;

const float MINIMUM_HIT_DISTANCE = 0.001;
const float MAXIMUM_OBJECT_DISTANCE = 200.0;

vec3 SUN_DIRECTION = vec3(0.5);

const int LIGHT_COUNT = 1;

struct Light {
  vec3 position;
	vec3 colour;
  float intensity;
};

uniform Light lights[LIGHT_COUNT];

struct GameObject {
	vec3 position;
	vec3 colour;
	vec3 size;
	float distance;
	float smoothness;
	float metallicness;
};

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Cloud generation create by https://www.shadertoy.com/view/wslyWs

float generateNoise(in vec2 uv) {

  vec2 i = floor(uv);
  vec2 f = fract(uv);
  f = f * f * (3.0 - 2.0 * f);
    
  float lb = random(i + vec2(0.0, 0.0));
  float rb = random(i + vec2(1.0, 0.0));
  float lt = random(i + vec2(0.0, 1.0));
  float rt = random(i + vec2(1.0, 1.0));
    
  return mix(mix(lb, rb, f.x), mix(lt, rt, f.x), f.y);
}

float fbm(in vec2 uv)
{
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 8; i++)
    {
        value += generateNoise(uv) * amplitude;
        
        amplitude *= 0.5;
        
        uv *= 2.0;
    }
    
    return value;
}


float sphereSDF(vec3 p, vec3 position, vec3 size) {
  return length(p - position) - size.x;
}

float cubeSDF(vec3 p, vec3 pos, vec3 r) {
	return max(max(abs(p.x - pos.x) - r.x, abs(p.y - pos.y) - r.y), abs(p.z - pos.z + r.z) - r.z);
}

float cylinderSDF(vec3 p, vec3 pos, vec3 r) {
 	return length(p.xz - pos.xz) - r.x;
}

float torusSDF(vec3 p, vec3 pos, vec3 t) {
	vec2 q = vec2(length(p.xz - pos.xz) - t.x, p.y - pos.y);
	return length(q) - t.y;
}

float planeSDF(vec3 p, vec3 pos, vec3 normal) {
	return dot(p, normal) - pos.y;
}

float tetrahedronSDF(vec3 p, float r) {
	return (max( abs(p.x + p.y) - p.z, abs(p.x - p.y) + p.z ) - r) / sqrt(3.0);
}


float bias(float x, float bias) {
	float k = pow(1.0 - bias, 3.0);

	return (x * k) / (x * k - x + 1.0);
}

float sineNoise(vec2 p) {
	return sin(p.x) + sin(p.y);
}

float eSineNoise(vec2 p) {
	return (pow(2.71828, sin(p.x)) + pow(2.71828, sin(p.y))) * 0.2;
}

mat2 rot(float a) {

	float sa = sin(a);
	float ca = cos(a);

	return mat2( ca, -sa, sa, ca );
}

float sineFBM(vec2 p) {

	float res = 0.0;
	float amp = 0.5;
	float freq = 1.95;

	for (int i = 0; i < 8; i++) {

		res += amp * sineNoise(p);
		amp *= 0.5;
		p = p * freq * rot((fractalRotate * 3.14159265) / 4.0) - res * 0.4;

	}

	return res;

}

float eSineFBM(vec2 p) {

	float res = 0.0;
	float amp = 0.5;
	float freq = 1.95;

	for (int i = 0; i < 5; i++) {

		res += amp * eSineNoise(p);
		amp *= 0.5;
		p = p * freq * rot((fractalRotate * 3.14159265) / 4.0) - res * 0.4;

	}

	return res;

}

float oceanSDF(vec3 p, float time, inout GameObject water) {

   vec2 pos = vec2(p.x + (time * 0.25), p.z + (time * 0.25));

   pos *= 0.1;

	float height = eSineFBM(pos * 0.5) * 0.5;
	height += eSineFBM(pos + vec2(time * 0.05)) * 0.5;

	height *= eSineFBM(pos + vec2(time * 0.05)) * 0.2 * fractalScale;

	float smallerDetails = eSineFBM((pos * 10.0) + vec2(time * 0.01)) * 0.05;
	smallerDetails += eSineFBM((pos * 20.0) + vec2(time * 0.004)) * 0.025;

	height += smallerDetails;

	water.colour = mix(vec3(1.8, 1.8, 2.0), vec3(3.6, 3.6, 4.0), height * 2.0);

	float foamLevel = eSineFBM((pos * 3.0) + vec2(time * 0.01));
	float foamNoise = eSineFBM((pos * 3.5) + vec2(time * 0.05)) * eSineFBM((pos * 2.5) + vec2(time * 0.023));

	if (foamLevel > foamNoise - 0.03 && foamLevel < foamNoise) {
		water.colour = mix( water.colour, vec3(1.0), (foamNoise - foamLevel) / 0.03 );
		water.metallicness = 0.0;
		water.smoothness = 0.0;
	}

	return planeSDF(p, vec3(-5.0), vec3(0, 1, 0)) - height * 5.0;
}

void boxFold(inout vec3 z, float dz) {
	if (dz > 0.0) {
  	float boxSize = dz;
  	z = clamp(z, -boxSize, boxSize) * 2.0 - z;
	}
}

void sphereFold(inout vec3 z, float dz) {
		if (dz > 0.0) {
	    float minRadius2 = 0.0;
	    float fixedRadius2 = dz;
	
	
	    float r2 = dot(z,z);
	    if (r2<fixedRadius2) { 
	      // this is the actual sphere inversion
	      float temp =(fixedRadius2/r2);
	      z *= temp;
	    }
		}
  }

vec2 foldRotate(vec2 p, float s) {
    float t = 3.14159265 * 2.0 / s;
    float a = -atan(p.x, p.y) + 3.14159265 / 2.0 + t / 2.0;
    a = mod(a, t) - t / 2.0;
    a = abs(a);
    return length(p) * vec2(cos(a), sin(a));
}

void sierpinskiFold(inout vec3 z) {
	z.xy -= min(z.x + z.y, 0.0);
	z.xz -= min(z.x + z.z, 0.0);
	z.yz -= min(z.y + z.z, 0.0);
}

vec3 fold(vec3 point, vec3 pointOnPlane, vec3 planeNormal) {
  float distToPlane = dot(point - pointOnPlane, planeNormal);
  distToPlane = min(distToPlane, 0.0);
  return point - 2.0 * distToPlane * planeNormal;
}


GameObject getSceneSDF(vec3 p) {

	GameObject water = GameObject(vec3(0.0, -1.0, 0.0), vec3(3.6, 3.6, 4.0), vec3(2.0, 2.0, 2.0), 0.0, 0.8, 1.0);
	water.distance = oceanSDF(p, uTime, water);

	return water;

}


vec3 generateSkyColour(vec3 rayDir, vec3 startPos) {
	vec3 upperCol = vec3(0.3,0.5,0.85);
	vec3 lowerCol = vec3(0.41, 0.38, 0.36);
	vec3 middleCol = vec3(1.0, 1.0, 1.0);

	float skyPower = 0.2;

	if (rayDir.y > 0.0) {		

		upperCol = mix(upperCol * skyPower, vec3(0.0, 0.13, 0.19) * skyPower, min(1.0, rayDir.y * 2.0));

		vec3 skyColour = mix(middleCol * skyPower, upperCol, min(1.0, rayDir.y * 80.0));

		// Calculate sky plane - credit to https://www.shadertoy.com/view/wslyWs

		const float SC = 1e5;
		
    float dist = (SC - startPos.y) / rayDir.y; 
    vec2 p = (startPos + dist * rayDir).xz;
    p *= 1.2 / SC;

		vec2 normSkyPos = vec2(p.x, p.y) * 0.8;

		float smoothNoise = fbm(vec2(normSkyPos.x  + uTime * 0.02, normSkyPos.y + uTime * 0.02));

		vec3 cloudySky = mix( skyColour, vec3(1.0) * skyPower, smoothstep(0.4, 0.8, smoothNoise) );

		float dotProSun = dot( rayDir, SUN_DIRECTION );

		vec3 sun = vec3(0.0);

		if (dotProSun > 0.0) {
			sun = vec3(1.0, 0.7, 0.4) * pow( dotProSun, 12.0 );
			sun += vec3(1.0, 0.8, 0.6) * pow( dotProSun, 16.0 );
			sun += vec3(1.0, 0.8, 0.6) * pow( dotProSun, 20.0 );
		}

		return cloudySky + sun;
	}

	if (rayDir.y < 0.0) {		
		lowerCol = mix(lowerCol * skyPower, vec3(0.03, 0.015, 0.0) * skyPower, min(1.0, rayDir.y * -2.0));

		return mix(middleCol * skyPower, lowerCol, min(1.0, rayDir.y * -80.0));
	}

	return middleCol * skyPower;
}

vec3 calculate_normal(vec3 p) {
  const vec3 small_step = vec3(0.001, 0.0, 0.0);

  float gradient_x = getSceneSDF(p + small_step.xyy).distance - getSceneSDF(p - small_step.xyy).distance;
  float gradient_y = getSceneSDF(p + small_step.yxy).distance - getSceneSDF(p - small_step.yxy).distance;
  float gradient_z = getSceneSDF(p + small_step.yyx).distance - getSceneSDF(p - small_step.yyx).distance;

  vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

  return normalize(normal);
}

vec3 genAmbientOcclusion(vec3 ro, vec3 rd)
{
    vec3 totao = vec3(0.0);
    float sca = 1.0;

    for (int aoi = 0; aoi < 5; aoi++)
    {
        float hr = 0.01 + 0.02 * float(aoi * aoi);
        vec3 aopos = ro + rd * hr;
        float dd = getSceneSDF(aopos).distance;
        float ao = clamp(-(dd - hr), 0.0, 1.0);
        totao += ao * sca * vec3(1.0, 1.0, 1.0);
        sca *= 0.75;
    }

    return totao;
}

vec3 reflectRay(vec3 rayPosition, vec3 rayDirection, bool isSmooth, inout float seed) {
	vec3 norm = calculate_normal(rayPosition);

	if (!isSmooth) {
		vec3 pointDir = vec3(0.0);

		pointDir.x = random( rayPosition.xy + seed ) * 2.0 - 1.0;
		pointDir.y = random( rayPosition.yz + seed ) * 2.0 - 1.0;
		pointDir.z = random( rayPosition.zx + seed ) * 2.0 - 1.0;

		pointDir = normalize(pointDir);

		// Stops the random direction from pointing into the object
		pointDir *= sign( dot(norm, pointDir) );
		pointDir += rayPosition;

		return normalize(pointDir - rayPosition);
	}

	return rayDirection - ( 2.0 * norm * dot(rayDirection, norm) );
}

vec3 march(vec3 startPos, vec3 rayDirection, inout float seed) {

	vec3 rayDir = rayDirection;
	vec3 rayPosition = startPos;
	vec3 rayColour = vec3(1.0);

	float reflectSky = 0.0;

	int bounces = 0;

	float kd = 1.0;
	float i = 0.0;
	
	for (int step = 0; step < NUMBER_OF_STEPS; step++) {
		GameObject dist = getSceneSDF(rayPosition);
			
		if (dist.distance > MAXIMUM_OBJECT_DISTANCE) {
			// Hit light

			if (bounces < 1) {
				rayColour = generateSkyColour(rayDir, startPos);
				kd = 1.0;
			}
			else {
				rayColour *= mix( vec3(1.0), generateSkyColour(rayDir, startPos), reflectSky );

				// Check whether the ray is pointing at the sun
				rayColour *= max(0.3, dot( SUN_DIRECTION, rayDir )) * 2.0;
			}

			vec3 shadedColour = rayColour * kd;
			
			return shadedColour;
		}
			
		if (dist.distance < MINIMUM_HIT_DISTANCE) {
			// Hit object
			kd = 0.5;

			if (bounces < 1) {
				reflectSky = dist.metallicness;
			}	

			// Bounce
			bounces += 1;

			vec3 hitNormal = calculate_normal(rayPosition);
			vec3 diffuseReflection = normalize(hitNormal + reflectRay(rayPosition, rayDir, false, seed));
			vec3 specularReflection = reflectRay(rayPosition, rayDir, true, seed);

			seed += 399.4553;

			rayDir = mix(diffuseReflection, specularReflection, dist.smoothness);

			rayPosition += hitNormal * 0.01;

			rayColour *= dist.colour;

			int bounceCount = MAX_BOUNCES;
			if (isMoving > 0.0) bounceCount = MAX_BOUNCES_WHEN_MOVING;

			if (bounces > bounceCount) {
				return vec3(0.0, 0.0, 0.0);
			}

		}
		else {
			kd = max(0.3, min(kd, 16.0 * dist.distance / i));
		}
			
		rayPosition += rayDir * dist.distance;
			
		i += dist.distance;
	}

	return generateSkyColour(rayDir, startPos);
}

vec3 rayDirection(float fieldOfView, vec2 fragCoord, vec3 rayStartPos) {

		float nearClipPlane = 0.1;

		float pi = 3.14159265;

		float planeHeight = nearClipPlane * tan(radians(fieldOfView / 2.0)) * 2.0;
		float planeWidth = planeHeight * cameraAspect;

		vec3 camForward = normalize(vec3( sin(cameraRot.y) * cos(cameraRot.x), sin(cameraRot.x), cos(cameraRot.y) * cos(cameraRot.x) ));
		vec3 camRight = normalize(vec3( sin(cameraRot.y + pi * 0.5), 0.0, cos(cameraRot.y + pi * 0.5) ));
		vec3 camUp = normalize(vec3( -sin(cameraRot.y) * sin(cameraRot.x), cos(cameraRot.x), -cos(cameraRot.y) * sin(cameraRot.x) ));

		vec3 bottomLeftLocal = vec3(-planeWidth * 0.5, -planeHeight * 0.5, 0.0);

		vec3 pointPosition = bottomLeftLocal + vec3(planeWidth * (fragCoord.x * 0.5 + 0.5), planeHeight * (fragCoord.y * 0.5 + 0.5), 0.0);
		pointPosition.x += sin(cameraRot.z) * -fragCoord.y;
		pointPosition.y += sin(cameraRot.z) * fragCoord.x;

		vec3 globalPlanePosition = cameraPos + (pointPosition.x * camRight) + (pointPosition.y * camUp) + (nearClipPlane * camForward);

		vec3 lookDir = normalize(globalPlanePosition - cameraPos);

    return lookDir;
}

vec3 lightPixel() {

	vec3 rayPosition = cameraPos;
	vec3 dir = rayDirection(50.0, a_pos, rayPosition);

	float seed = renderedFrames * 0.034349;

	// March ray to scene
	vec3 finalColour = vec3(0.0);
	float iterations = 0.0;

	for (int i = 0; i < PIXEL_AVERAGE_COUNT; i++) {
		finalColour += march( rayPosition, dir, seed );
		iterations += 1.0;
	}

	finalColour = finalColour / iterations;

	for (int l = 0; l < LIGHT_COUNT; l++) {
		finalColour *= lights[l].intensity * lights[l].colour;
	}

	return finalColour;
}

void main() {

	vec4 accumaltedAverage = vec4(1.0);

	if (isMoving > 0.0) {
		accumaltedAverage = vec4( lightPixel(), 1.0 );
	}
	else {
		vec4 oldRender = texture2D( previousFrame, a_pos * 0.5 + 0.5 );
		vec4 newRender = vec4( lightPixel(), 1.0 );
	
		float weight = 1.0 / (renderedFrames + 1.0);
		accumaltedAverage = oldRender * (1.0 - weight) + newRender * weight;
	}

  gl_FragColor = accumaltedAverage;
}
