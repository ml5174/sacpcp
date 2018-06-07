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
1.      Once you cloned the repo to your desktop and  
        have node installed you need to cd to the project and type:
        npm install
1.      Now install cordova and ionic.  
        if on macOS, you may need to prefix this command  
        with sudo and add --unsafe-perm=true as install option:  
        npm install -g cordova@8.0.0
        npm install -g ionic@3.19.1
        npm install -g @ionic/cli-utils@1.19.1
        npm install @ionic/app-scripts@3.1.4


### Launching the application
*	If all went well, you should be able to launch the application to your default browser:  
        ionic serve  
	Also try  
        ionic lab

*	If on macOS, then try adding ios platform:  
        ionic cordova platform add ios
*	You may also try adding android platform:  
        ionic cordova platform add android
        
### If having issues, then check your software installation versions with ionic info and npm --version output:
  
<b>cli packages: </b>(/usr/local/lib/node_modules)  
  
    @ionic/cli-plugin-proxy : 1.5.8  
    @ionic/cli-utils        : 1.19.2  
    ionic (Ionic CLI)       : 3.20.0  
  
<b>global packages:</b>  
   
    cordova (Cordova CLI) : 8.0.0  
  
<b>local packages:</b>  
  
    @ionic/app-scripts : 3.1.8  
    Cordova Platforms  : android 6.4.0 ios 4.5.2  
    Ionic Framework    : ionic-angular 3.9.2  
   
<b>System:</b>  
  
    Android SDK Tools : 26.1.1  
    ios-deploy        : 1.9.2  
    ios-sim           : 6.1.2   
    Node              : v8.6.0   
    npm               : 5.7.1  
    OS                : macOS High Sierra  
    Xcode             : Xcode 9.2 Build version 9C40b  
  
<b>Environment Variables:</b>  
  
    ANDROID_HOME     : /Users/ms8342/Library/Android/sdk  
    HTTP_PROXY       : not set  
    http_proxy       : not set  
    HTTPS_PROXY      : not set  
    https_proxy      : not set  
    IONIC_HTTP_PROXY : not set  
    PROXY            : not set  
    proxy            : not set  
  
<b>Misc:</b>  
  
    backend : legacy  
  

Android SDK Tools is given above because ANDROID_HOME environment variable is set
### See CONTRIBUTING.md for detailed git operations where developers follow a preferred workflow with pull requests to upstream master coming from their github forks and managing branches, including master, on both their fork from which the pull requests originate as well as their local working copy
