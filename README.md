![Static Badge](https://img.shields.io/badge/Version-1.1.7-green?style=social)

# fractal_raytracer

A 3D fractal renderer that creates high resolution photorealistic images of your own custom fractals, why not even take a flight around them in flight mode...

## How does it work?

The program makes use of a technique called [raymarching](https://en.wikipedia.org/wiki/Ray_marching#:~:text=Ray%20marching%20is%20a%20class,some%20function%20at%20each%20step.) to estimate the distances to the 3D fractals and the basic geometric shapes. To represent a physical object in raymarching you need a sign distance function (SDF) that simply return the shortest distance to that object when give any 3D point in space. You can find each scene's SDF in its corresponding shader file (e.g. [shader0.glsl](/shaders/shader0.glsl) contains the SDF of the menger sponge on line 195 - sorry for the terrible naming system), which is called in the getSceneSDF() (line 239) function (which is named the same in every shader file)

## Website

You can run the program in realtime [here, on its website](https://gamedev46.github.io/fractal_raytracer/) as it is programmed using HTML, CSS, JS and GLSL which is implemented using the WebGL shader library
