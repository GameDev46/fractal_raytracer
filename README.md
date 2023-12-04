<a href="https://github.com/GameDev46" title="Go to GitHub repo">
    <img src="https://img.shields.io/static/v1?label=GameDev46&message=Profile&color=Green&logo=github&style=for-the-badge&labelColor=1f1f22" alt="GameDev46 - fractal_raytracer">
    <img src="https://img.shields.io/badge/Version-1.1.7-green?style=for-the-badge&labelColor=1f1f22&color=Green" alt="GameDev46 - fractal_raytracer">
</a>


![Static Badge](https://img.shields.io/badge/-HTML5-1f1f22?style=for-the-badge&logo=HTML5)
![Static Badge](https://img.shields.io/badge/-CSS-1f1f22?style=for-the-badge&logo=CSS3&logoColor=6060ef)
![Static Badge](https://img.shields.io/badge/-JavaScript-1f1f22?style=for-the-badge&logo=JavaScript)
    
<a href="https://github.com/GameDev46/fractal_raytracer/stargazers">
    <img src="https://img.shields.io/github/stars/GameDev46/fractal_raytracer?style=for-the-badge&labelColor=1f1f22" alt="stars - fractal_raytracer">
</a>
<a href="https://github.com/GameDev46/fractal_raytracer/forks">
    <img src="https://img.shields.io/github/forks/GameDev46/fractal_raytracer?style=for-the-badge&labelColor=1f1f22" alt="forks - fractal_raytracer">
</a>
<a href="https://github.com/GameDev46/fractal_raytracer/issues">
    <img src="https://img.shields.io/github/issues/GameDev46/fractal_raytracer?style=for-the-badge&labelColor=1f1f22&color=blue"/>
 </a>

<br>
<br>

<a href="https://github.com/GameDev46/fractal_raytracer/releases/">
    <img src="https://img.shields.io/github/tag/GameDev46/fractal_raytracer?include_prereleases=&sort=semver&color=Green&style=for-the-badge&labelColor=1f1f22" alt="GitHub tag">
</a>

<a href="https://github.com/GameDev46/fractal_raytracer/issues">
    <img src="https://img.shields.io/github/issues/GameDev46/fractal_raytracer?style=for-the-badge&labelColor=1f1f22" alt="issues - fractal_raytracer">
</a>

<br>
<br>

<div align="left">
<a href="https://gamedev46.github.io/fractal_raytracer/">
    <img src="https://img.shields.io/badge/View_site-GH_Pages-2ea44f?style=for-the-badge&labelColor=1f1f22" alt="View site - GH Pages">
</a>
</div>

<br>

<p align="left">
<a href="https://twitter.com/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="gamedev46" height="30" width="40" /></a>
<a href="https://instagram.com/oliver_pearce47" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="oliver_pearce47" height="30" width="40" /></a>
<a href="https://www.youtube.com/c/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg" alt="gamedev46" height="30" width="40" /></a>
</p>

# fractal_raytracer

A 3D fractal renderer that creates high resolution photorealistic images of your own custom fractals, why not even take a flight around them in flight mode...

## How does it work?

The program makes use of a technique called [raymarching](https://en.wikipedia.org/wiki/Ray_marching#:~:text=Ray%20marching%20is%20a%20class,some%20function%20at%20each%20step.) to estimate the distances to the 3D fractals and the basic geometric shapes. To represent a physical object in raymarching you need a sign distance function (SDF) that simply return the shortest distance to that object when give any 3D point in space. You can find each scene's SDF in its corresponding shader file (e.g. [shader0.glsl](/shaders/shader0.glsl) contains the SDF of the menger sponge on line 195 - sorry for the terrible naming system), which is called in the getSceneSDF() (line 239) function (which is named the same in every shader file)

# Screenshots

<p>
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/9238d230-cc2e-47b4-9e6a-24853324f63c" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/1889d98e-16dd-4b11-a95d-49acf06b7ee9" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/00235a4c-afb0-4ddb-b4da-a2a0e209a3bf" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/03fc2b4e-fbad-4c53-9595-e7e6364bb3ed" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/b58a9650-b98f-4b5c-ac72-5f84c752fcbc" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/a12692f5-dee1-417d-802a-ecca860a6485" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/77f43222-ca7f-446c-8608-ed40ee36f2b8" width="400">
    <img src="https://github.com/GameDev46/fractal_raytracer/assets/76485006/c1cbaa1a-095b-4243-be21-78dd52487fa8" width="400">
</p>

## Website

You can run the program in realtime [here, on its website](https://gamedev46.github.io/fractal_raytracer/) as it is programmed using HTML, CSS, JS and GLSL which is implemented using the WebGL shader library
