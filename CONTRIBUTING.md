# Git Workflow

Definitions for clarity
- Upstream: The main remote repo which you forked.
- Origin: your remote repo (fork of upstream)
- Local: your local clone of fork
- added line for demo


## Only once
- fork the upstream repo
  * use github GUI
- clone fork to local
  * create/navigate to directory for project
  * `git clone <url to your forked repo>`
- add remote for upstream repo
  * `git remote add upstream <url to upstream repo>`


## Development flow
- MAKE SURE YOU ARE ON MASTER
  * `git checkout master`
- update your local master from upstream
  * `git pull upstream master`
- create branch:
  * `git checkout -b <new branch name>`
- do work
- to update your branch with most recent codebase while in the middle of making changes 
  * `git checkout master`
  * `git pull upstream master`
  * `git checkout <branch name>`
  * `git merge origin/master`
- finish work
- merge your work back into master 
  * `git checkout master`
  * `git merge --squah <branch name>`
  * `git commit`
- push master to origin
  * `git push origin master`
- pull request to upstream
  * use github GUI 

## Clean-up/Maintenance (optional, if you want to delete branch)
- make sure you are on master
  * `git checkout master`
- delete branch locally
  * `git branch -d <branch name> `
- push branch deletion to origin
  * `git push --delete origin <branch name>`

## Synch origin with upstream
- make sure you are on master
  * `git checkout master`
- `git pull upstream master`
- `git push origin master`

## Emergency Clean-up & re-synch origin master
### you will lose all changes that have not been merged upstream
- `git fetch upstream`
- `git reset --hard upstream/master`
- `git push origin master --force`
---
keep in mind that various things can interfere with these tasks running smoothly, merge conflicts, having uncommited changes,
having committed changes, etc.  

 ### Useful commands:

`git checkout master`, `git checkout <branchname>`
- make that branch your working directory, git commands will be interpreted with respect to the branch that you currently have checked out.

`git status`
- displays useful information such as which branch you are on, unstaged changes, staged changes, etc...

`git remote -v`
- display remotes you have set up with their urls

`git branch -v`
- displays your branches (also handily puts a * next to the branch you currently have checked out)

`git commit -am "<message>"`
- stage all changed files and commit with message (be careful with this, make sure that the all the files listed in `git status` are files that you want to commit)

## Good to Know

- git pull is a combination of git fetch and git merge
- git pull without specifying "upstream master" will pull from origin master, you likely do not want this to happen.

