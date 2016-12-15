Fork my repo in github here: 
https://github.com/ml5174/sacpcp

from your personal copy clone it to your desktop.

1.)	You need to install node
a.	https://nodejs.org/en/download/
2.)	Once you cloned the repo to your desktop and have node installed you need to cd to the project and type: npm install
a.	This added the node_modules directory
3.)	Then you type: npm install -g cordova ionic
a.	This installs ionic command line utils
4.)	Then you can type: ionic serve
a.	This will pull up your default browser with the app running.
5.)	I recommend Visual Studio Code to edit.
a.	https://code.visualstudio.com/download

https://branch.io/resources/app-launch-checklist/

imports: [ 
    HttpModule, 
    IonicModule.forRoot(MyApp, { 
      scrollAssist: false, 
      autoFocusAssist: false 
    }, deepLinkConfig),
