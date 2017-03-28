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
1.      Fork the https://github.com/ml5174/savi-lib.git repo in github, and<br>
        copy the newly created repo link similar to<br>
        https://github.com/githubusername/savi-lib.git where githubusername<br>
        will be your username.
1.      npm run setup savi-lib-link where savi-lib-link is the copied link<br>
        from the previous step


### Launching the application
*	If all went well, you should be able to launch the application to your default browser:<br>
        ionic serve

*	If on macOS, then try adding ios platform:<br>
        ionic platform add ios
	* If you get errors with bower, then try:<br>
        sudo npm install -g bower
*	You may also try adding android platform:<br>
        ionic platform add android
        
### If having issues, then check your software installation versions with ionic info and npm --version output:

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

### See CONTRIBUTING.md for detailed git operations where developers follow a preferred workflow with pull requests to upstream master coming from their github forks
