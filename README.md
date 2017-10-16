## Getting Started

### Preliminary GitHub Setup

1.      first create an account on github.com if you don't already have one
1.      login to github
1.      visit https://github.com/ml5174/sacpcp and fork the main source repo
1.      visit https://github.com/ml5174/savi-lib fork the library source repo


### Development Environment Setup
####  Development Environment Setup - Preliminary
1.      install LTS build of node from https://nodejs.org/en/download/  
1.      Clone from your sacpcp fork:
        git clone https://github.com/githubusername/sacpcp.git
        where githubusername is your username on github
        and the path given to clone is for your sacpcp fork
1.      cd sacpcp
1.      cd src
1.      Clone from your savi-lib repo into a subfolder of src:
        git clone https://github.com/githubusername/savi-lib.git lib
        where githubusername is your username on github
        and the path give to clone is for your lib fork
        NOTE: your lib subfolder of src needs to be named lib
        If you failed to give the lib argument as target name, then rename the lib folder to lib
####  Development Environment Setup - Secondary
1.      At this point you could run Thaddeus's npm command:
        npm run setup https://github.com/githubusername/sacpcp.git
        where githubusername is your username on github
        See npm_setup.md for more information
1.      -OR- do the detailed steps that follow:
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
1.      Now install cordova and ionic. if on macOS, you may need to prefix this command with sudo and add --unsafe-perm=true as install option:<br>
        npm install -g cordova@latest
        npm install -g ionic@latest
        npm install -g @ionic/cli-utils@latest
        npm install @ionic/app-scripts@latest


### Launching the application
*	If all went well, you should be able to launch the application to your default browser:<br>
        ionic serve

*	If on macOS, then try adding ios platform:<br>
        ionic cordova platform add ios
*	You may also try adding android platform:<br>
        ionic cordova platform add android
        
### If having issues, then check your software installation versions with ionic info and npm --version output:
<br>
<b>cli packages: </b>(/usr/local/lib/node_modules)<br>
<br>
    @ionic/cli-plugin-proxy : 1.4.12<br>
    @ionic/cli-utils        : 1.13.0<br>
    ionic (Ionic CLI)       : 3.13.0<br>
<br>
<b>global packages:</b><br>
<br>
    cordova (Cordova CLI) : 7.1.0 <br>
<br>
<b>local packages:</b><br>
<br>
    @ionic/app-scripts : 3.0.0<br>
    Cordova Platforms  : android 6.3.0 ios 4.5.2<br>
    Ionic Framework    : ionic-angular 3.7.1<br>
<br>
<b>System:</b><br>
<br>
    Android SDK Tools : 25.2.3<br>
    ios-deploy        : 1.9.2<br>
    ios-sim           : 6.1.2<br>
    Node              : v8.6.0<br>
    npm               : 5.3.0 <br>
    OS                : macOS Sierra<br>
    Xcode             : Xcode 9.0 Build version 9A235 <br>
<br>
<b>Misc:</b><br>
<br>
    backend : legacy<br>
<br>
### See CONTRIBUTING.md for detailed git operations where developers follow a preferred workflow with pull requests to upstream master coming from their github forks and managing branches, including master, on both their fork from which the pull requests originate as well as their local working copy
