## Getting Started

### Preliminary GitHub Setup

1.      first create an account on github.com if you don't already have one
1.      login to github
1.      visit https://github.com/ml5174/sacpcp and fork the main source repo
1.      visit https://github.com/ml5174/savi-lib fork the library source repo


### Development Environment Setup

1.      install LTS build of node from https://nodejs.org/en/download/  
1.      Clone from your sacpcp fork:<br>
        git clone https://github.com/githubusername/sacpcp.git<br>
        where githubusername is your username on github<br>
        and the path given to clone is for your sacpcp fork
1.      cd sacpcp
1.      cd src
1.      Clone from your savi-lib repo into a subfolder of src:<br>
        git clone https://github.com/githubusername/savi-lib.git lib<br>
        where githubusername is your username on github<br>
        and the path give to clone is for your lib fork 
1.      cd lib
1.      Set the upstream master for lib:
        git remote add upstream https://github.com/ml5174/savi-lib.git
1.      git checkout master
1.      git pull upstream master
1.      cd ../..
1.      Set the upstream master for the main source:
        git remote add upstream https://github.com/ml5174/sacpcp.git
1.      git checkout master
1.      git pull upstream master
1.      Once you cloned the repo to your desktop and have node installed you need to cd to the project and type:
        npm install
1.      Now install cordova and ionic. if on macOS, you may need to prefix this command with sudo:
        npm install -g cordova ionic


### Launching the application
*	If all went well, you should be able to launch the application to your default browser:<br>
        ionic serve

*	If on macOS, then try adding ios platform:<br>
        ionic platform add ios
	* If you get errors with bower, then try:<br>
        sudo npm install -g bower
*	You may also try adding android platform:<br>
        ionic platform add android
        
##### If having issues, then check your software installation versions with ionic info and npm --version output:

ionic info <br>

Your system information: <br>

Cordova CLI: 6.5.0 <br>
Ionic Framework Version: 2.0.0-rc.5-201701112208 <br>
Ionic CLI Version: 2.2.1 <br>
Ionic App Lib Version: 2.2.0 <br>
Ionic App Scripts Version: 1.0.0 <br>
ios-deploy version: 1.9.1 <br>
ios-sim version: 5.0.13 <br>
OS: macOS Sierra <br>
Node Version: v6.9.4 <br>
Xcode version: Xcode 8.2.1 Build version 8C1002 <br>
<br>
npm --version <br>
3.10.10
