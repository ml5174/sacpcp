## Getting Started

Fork my repo in github here: 
https://github.com/ml5174/sacpcp

Also for the lib repot in github here:
https://github.com/ml5174/savi-lib

1.      You need to install [node] (https://nodejs.org/en/download/)
2.      Clone from your sacpcp repo 
        git clone https://github.com/<repo>/sacpcp.git 
        where <repo> is your repo on github
3.      cd sacpcp
4.      cd src
5.      Clone from your savi-lib repo
        git clone https://github.com/<repo>/savi-lib.git lib
6.      cd lib
7.      Set the upstream master for lib
        git remote add upstream https://github.com/ml5174/savi-lib.git
8.      git checkout master
9.      git pull upstream master
10.     cd ../..
11.     Set the upstream master for the main source
        git remote add upstream https://github.com/ml5174/sacpcp.git
12.     git checkout master
13.     git pull upstream master
14.     Once you cloned the repo to your desktop and have node installed you need to cd to the project and type: 
        npm install
15.     Now install cordova and ionic. if on macOS, you may need to prefix this command with sudo 
        npm install -g cordova ionic
16.     Launch the application to your default browser
        ionic serve
17.     If on macOS, then try adding ios platform
        ionic platform add ios
18.     if you get errors with bower, then try 
        sudo npm install -g bower
19.     You may also try adding android platform
        ionic platform add android

After checking out the code, please see CONTRIBUTING.md for more information about git commands and working with github

For TypeScript sensitive/aware editors, see http://www.typescriptlang.org
We recommend Visual Studio Code

Other important links:
http://ionicframework.com/docs/v2/resources/editors_and_ides/
http://ionicframework.com/docs/
https://angular.io
http://sass-lang.com
