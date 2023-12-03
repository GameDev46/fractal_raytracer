![Static Badge](https://img.shields.io/badge/Version-1.1.7-green?style=for-the-badge&labelColor=1f1f22)
![Static Badge](https://img.shields.io/badge/-HTML5-1f1f22?style=for-the-badge&logo=HTML5)
![Static Badge](https://img.shields.io/badge/-CSS-1f1f22?style=for-the-badge&logo=CSS3&logoColor=6060ef)
![Static Badge](https://img.shields.io/badge/-JavaScript-1f1f22?style=for-the-badge&logo=JavaScript)

![Static Badge](https://img.shields.io/github/contributors/badges/gamedev46)
![Static Badge](https://img.shields.io/opencollective/backers/shields)
![Static Badge](https://img.shields.io/opencollective/sponsors/shields)
![Static Badge](https://img.shields.io/github/commit-activity/m/badges/shields)
![Static Badge](https://img.shields.io/circleci/project/github/badges/daily-tests?label=service%20tests)
![Static Badge](https://img.shields.io/circleci/project/github/badges/shields/master)
![Static Badge](https://img.shields.io/coveralls/github/badges/shields)
![Static Badge](https://img.shields.io/twitter/follow/shields_io?style=social&logo=X)

<p align="center">
    <a href="https://github.com/badges/shields/graphs/contributors" alt="Contributors">
        <img src="https://img.shields.io/github/contributors/badges/shields" /></a>
    <a href="#backers" alt="Backers on Open Collective">
        <img src="https://img.shields.io/opencollective/backers/shields" /></a>
    <a href="#sponsors" alt="Sponsors on Open Collective">
        <img src="https://img.shields.io/opencollective/sponsors/shields" /></a>
    <a href="https://github.com/badges/shields/pulse" alt="Activity">
        <img src="https://img.shields.io/github/commit-activity/m/badges/shields" /></a>
    <a href="https://circleci.com/gh/badges/shields/tree/master">
        <img src="https://img.shields.io/circleci/project/github/badges/shields/master" alt="build status"></a>
    <a href="https://circleci.com/gh/badges/daily-tests">
        <img src="https://img.shields.io/circleci/project/github/badges/daily-tests?label=service%20tests"
            alt="service-test status"></a>
    <a href="https://coveralls.io/github/badges/shields">
        <img src="https://img.shields.io/coveralls/github/badges/shields"
            alt="coverage"></a>
    <a href="https://discord.gg/HjJCwm5">
        <img src="https://img.shields.io/discord/308323056592486420?logo=discord"
            alt="chat on Discord"></a>
    <a href="https://twitter.com/intent/follow?screen_name=shields_io">
        <img src="https://img.shields.io/twitter/follow/shields_io?style=social&logo=X"
            alt="follow on Twitter"></a>
</p>

<p align="left">
<a href="https://twitter.com/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="gamedev46" height="30" width="40" /></a>
<a href="https://instagram.com/oliver_pearce47" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="oliver_pearce47" height="30" width="40" /></a>
<a href="https://www.youtube.com/c/gamedev46" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg" alt="gamedev46" height="30" width="40" /></a>
</p>

# fractal_raytracer

A 3D fractal renderer that creates high resolution photorealistic images of your own custom fractals, why not even take a flight around them in flight mode...

## How does it work?

The program makes use of a technique called [raymarching](https://en.wikipedia.org/wiki/Ray_marching#:~:text=Ray%20marching%20is%20a%20class,some%20function%20at%20each%20step.) to estimate the distances to the 3D fractals and the basic geometric shapes. To represent a physical object in raymarching you need a sign distance function (SDF) that simply return the shortest distance to that object when give any 3D point in space. You can find each scene's SDF in its corresponding shader file (e.g. [shader0.glsl](/shaders/shader0.glsl) contains the SDF of the menger sponge on line 195 - sorry for the terrible naming system), which is called in the getSceneSDF() (line 239) function (which is named the same in every shader file)

## Website

You can run the program in realtime [here, on its website](https://gamedev46.github.io/fractal_raytracer/) as it is programmed using HTML, CSS, JS and GLSL which is implemented using the WebGL shader library
