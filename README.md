## Getting Started

Fork my repo in github here: 
https://github.com/ml5174/sacpcp

from your personal copy clone it to your desktop.

1.	You need to install [node] (https://nodejs.org/en/download/)
2.	Once you cloned the repo to your desktop and have node installed you need to cd to the project and type: `npm install`
3.	Then you type: `npm install -g cordova ionic` to install ionic command line utilities
4.	Then you can type: `ionic serve` to run the app, this will automatically pull up your default browser
5.	I recommend [Visual Studio Code] (https://code.visualstudio.com/download) to edit.

## How to properly synch your repository with the main repository

- Add the main repository as your upstream repository 'git remote add upstream https://github.com/ml5174/sacpcp.git'
- This only needs to be done once

1. get changes from upstream `git fetch upstream`
2. make sure you are on your master branch `git checkout master`
3. merge upstream changes and reorder commits properly `git rebase upstream/master`
4. push changes to your fork `git push`

- If you have pending commits, you may have to handle merge conflicts between steps 2 and 4


https://branch.io/resources/app-launch-checklist/

imports: [ 
    HttpModule, 
    IonicModule.forRoot(MyApp, { 
      scrollAssist: false, 
      autoFocusAssist: false 
    }, deepLinkConfig),
