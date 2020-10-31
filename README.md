[![NPM version](https://img.shields.io/npm/v/auspice.svg?style=flat)](https://www.npmjs.com/package/auspice)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)


# About Auspice
**Auspice** is an open-source interactive web app for visualizing phylogenomic data. Auspice may be used to explore datasets locally or run as a server to share online your results. Auspice is developed by the NextStrain team: https://nextstrain.org/. We thank them for making this code available to the entire community.

This version of Auspice is optimized for NGA AWS Cloud and Cloud Foundry for our own visualization needs.


## Getting Started ... Installation
The code run under either Ubuntu/Debian or RHEL. If you have Windows 10, see below how to get started ...

You need to install NODEjs and NPM to have it ran on your local machine or on the Cloud such as AWS EC2, Pivotal Cloud Foundry, etc. NODEjs/NPM is not easy to install as it is meant to aggravate you (possibly to the point of madness). You can use v11, 12, or 14 of the install here below shown for v14.

You need SUDO privileges to do this.

### Installing NODEjs/NPM, v.14 on RHEL Linux
Get NPM/NODEjs from here for RHEL:
```
~$ sudo yum update
~$ sudo yum install gcc gcc-c++ make
~$ curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
~$ sudo yum install -y nodejs
~$ node -v
v14.7.0              #Good job!
~$ nodejs -v         #same thing
~$ npm -v
6.14.7
~$ whereis node npm
node: /usr/bin/node /usr/share/man/man1/node.1.gz
npm: /usr/bin/npm
```

### Installing NODEjs/NPM, v.14 on Ubuntu/Debian Linux
Get NPM/NODEjs from here for Ubuntu:
```
~$ sudo apt update
~$ sudo apt install build-essential   ##it will install gcc, g++, and make.
~$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
~$ sudo apt install -y nodejs
~$ node -v
v14.14.0              #Good job!
~$ nodejs -v          #same thing
~$ npm -v
6.14.8
```

### Cloning the app from NGA systems
If you are DOD member and have a CAC card:
`~$ git clone git@gitlab.gs.mil:Dartevelle.Sebastien.1503290509/auspice.git`

If not, request an account to me to NGA GIT IO domain:
`~$ git clone git@gitlab.devops.geointservices.io:darteves/auspice.git`

Contact me for other ways to access the app: sebastien.dartevelle@nga.mil

Once cloned, you have two options, the easy one (Local Install) and the nightmarish one (Global Install). On AWS EC2, we only tested the global install. On Cloud Foundry and on our local machines, we tested both. _If you dont have SUDO permission **DO NOT** attempt the Global Install_

### The Infamous Global Install
Take a few valiums (maximum dosage, no limit) + a few glasses of red wine; ensure you are semi-conscious ...
It will install NPM/NODEjs on your machine/instance globally--it is meant to boost your stress level.

```
~$ cd auspice
~$ npm install --global .
~$ auspice build
```
check your install:
```
~$ auspice -h
~$ auspice -v
```
Run auspice (assuming data directory is in its default location, ie., ~/auspice/data):
`~$ auspice view`
If your data directory is in an unusual place, provide the path to it:
`~$ auspice view --datasetDir ~/auspice/path/to/data`

And view auspice in the browser at [localhost:4000](http://localhost:4000)

Bash will inidcate the local view in your browser is on *0.0.0.0:4000* but this is because this auspice version is optimized as a PaaS NODEjs on NGA Cloud Foundry; however on your local browser, the only proper way to vizualize auspice is with ***localhost:4000***.



### The Local Install
Much easier; and, it works on Cloud Foundry
It will install NPM/NODEjs locally in the auspice directory.

```
~$ cd auspice
~$ npm install
```
check your install:
```
~$ auspice -h
~$ auspice -v
```
Run auspice (assuming data directory is in its default location, ie., ~/auspice/data):
`~$ node auspice.js view`
If your data directory is in a unusual place, provide the path to it:
`~$ node auspice.js view --datasetDir ~/auspice/path/to/data`

And view auspice in the browser at [localhost:4000](http://localhost:4000)

Bash will inidcate the local view in your browser is on *0.0.0.0:4000* but this is because this auspice version is optimized as a PaaS NODEjs on NGA Cloud Foundry; however on your local browser, the only proper way to vizualize auspice is with ***localhost:4000***.

## Rebuild the App without reinstalling NPM/NODEjs
If you modified the codes and want to redislpay it right, then you need to do the following; it should not be too difficult unless you did a Global Install (this is during this step you may likely have NPM Errors--see below)

Get to your App directory:
`~$ cd auspice`

IF Global Install:
`~$ auspice build`

IF Local Install:
`~$ node auspice.js build`

## About those dreadful NPM Errors (mostly with the Global Install) ...
You need more valiums and wine ... These errors usually happens when you want to rebuild the auspice app without changing your (Global) NPM Install. It may also happen with your first build of the App.

Here typically what may happen and how to solve it (it can happen on all Linux flavors).

### The EACCES Error--the most common one with Global Install
This Error is very common with the Global Install, you need SUDO permission to fix it:
```
RR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/lib/node_modules
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, access '/usr/lib/node_modules'
npm ERR!  [Error: EACCES: permission denied, access '/usr/lib/node_modules'] {
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'access',
npm ERR!   path: '/usr/lib/node_modules'
npm ERR! }
```

Check what's going on:
```
~$ ls -la1 /usr/lib/
drwxr-xr-x  3 root root   17 Aug  5 10:27 node_modules
```
Fix it in owning this directory:
`~$ sudo chown -R $USER /usr/lib/node_modules`

Then restart your build ... This CHOWN error may repeat itself for other subdirectories, you may have to repeat this several times.

### The Source-Map (or any other missing module) Error
A Nodejs module may be neede and is missing on your system:
`npm ERR! enoent ENOENT: no such file or directory, access '/home/some_users/auspice/node_modules/@types/uglify-js/node_modules/source-map'`

You need to install a missing module, specifically (it happened to me on AWS RHEL):
`~$ npm install source-map`

Then restart your build ...

### The call stack Error
`npm ERR! Maximum call stack size exceeded`

Erase the node_modules subdirectory (ie.,~/auspice/node_modules), force a NPM clear cache, restart your terminal windows:

`~$ npm cache clean --force`
`~$ rm -rf node_modules`

Close your Terminal window and reopen, then restart your build ...

### The Cannot create a Symbolic Link Error
It is actually not that bad, it means you are getting towards the end of your NPM torture; this is common with NPM with a Global install. You need SUDO permission!
```
$cd /usr/bin/
~bin$ sudo ln -s /usr/lib/node_modules/auspice/auspice.js /usr/bin/auspice
```
Check:
`~bin$ ls -la1 /usr/bin/auspice`

Restart your Global build ...

### Everything fails, then you should COMPLETELY remove NPM/NODEjs
See below (more valium and wine needed)

## If you have Windows 10?
No panic, here what you need to do:

### Install Ubuntu for Win10

Ubuntu can be installed from the Microsoft Store:

* Use the Start menu to launch the Microsoft Store application.
* Search for Ubuntu and select the first result, ‘Ubuntu’, published by Canonical Group Limited.
* Click on the Install button.

Ubuntu will be downloaded and installed automatically. Progress will be reported within the Microsoft Store application.

### Set up your Win's Ubuntu
You need to have a few app installed and updated, so do this now:
```
~$ sudo apt update
~$ sudo apt install build-essential
~$ gcc --version
```

Close Ubuntu Windows, then reopen

### Install NPM (Nodes Project Manager) on Win's Ubuntu
Get NPM/NODEjs from here for Ubuntu:
```
~$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
~$ sudo apt install -y nodejs
~$ node -v
v14.14.0              #Good job
~$ nodejs -v          #same thing
~$ npm -v
6.14.8
```

*Now you should be ready to install from GitLab auspice for NGA system (see above)*

## How to remove completly NODE.js and NPM before re-installing
NODE.js and NPM are very difficult tools to use; hard to install and hard to completely remove from your system. From time to time, you may have to remove a previous broken version and re-install anew--aspecially if you did a Global Install. Also, please note, that Auspice and Pivotal Cloud Foundry are compatible with only a few version of NPM and NODE.js.

It is recommended you do this complete removal of NPM/NODEjs from your system if you want to install a newer version of NPM/NODEjs.

So, follow these instructions:


### Removing GLOBAL NODEjs/NPM from RHEL
Be in /home directory: cd ~

```
~$ sudo rm -rf .npm
~$ rm -rf ~/auspice/dist ~/auspice/node_modules
~$ sudo yum remove nodejs npm
(~$ sudo npm uninstall npm -g)         ##not needed
~$ sudo rm -rf /usr/lib/node_modules
~$ sudo rm /usr/bin/auspice            ##This is a symbolic link but better remove it if it exists
~$ sudo rm /usr/bin/sars-cov-2         ##This is a symbolic link but better remove it if it exists
~$ sudo rm -rf /root/.npm              ##yes remove it if it exists, you can!; it was hidden well, real poison that one!
```

Check:
```
~$ ls -la1 /usr/lib/node_modules       ###check any node and npm left
~$ ls -la1 /usr/local/bin              ###check any node and npm left
~$ ls -la1 /usr/local/lib              ###check any node and npm left
~$ ls -la1 /usr/local/include          ###check any node and npm left
~$ ls -la /usr/local/share/man/man1    ###check any node and npm left
~$ ls -la1 /usr/local/lib/dtrace       ###check any node and npm left
~$ sudo ls -la1 /root/                 ###check any node and npm left
```

Check again:
```
~$ whereis node npm
~$ which node npm
```

Now you are ready to reinstall NODEjs/NPM (whether Globally or Locally) fresh (see above the install instructions)

### Removing GLOBAL NODEjs/NPM from Ubuntu/Debian
Be in /home directory: cd ~
```
~$ rm -rf ~/auspice/dist ~/auspice/node_modules
~$ sudo npm uninstall npm -g
~$ sudo apt remove npm nodejs
~$ sudo rm -rf /usr/lib/node_modules /etc/apt/sources.list.d/node*
~$ sudo rm -rf /etc/apt/sources.list.d/node*
~$ sudo rm -rf /usr/share/man/man1/npm.1
~$ sudo rm -rf .npm node_modules         #If still there
```
Check:
```
~$ ls /etc/apt/sources.list.d/
~$ ls /usr/lib/
~$ which node    #then erase any node left you may still have here
~$ which npm
~$ which nodejs
~$ cd ~/
~$ whereis npm
~$ whereis node
~$ whereis nodejs
```


## Install Cloud Foundry on Ubuntu/Debian
If you install the app to Pivotal Cloud Foundry, you may want to do this:
```
~$ wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
~$ echo "deb https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
~$ sudo apt-get update
~$ sudo apt-get install cf-cli
```
Check
```
~$ cf --help
~$ cf install-plugin cfdev
```

If you are confused, just ask; I did all the martyrdom stuff for you, you dont need to go through that again: sebastien.dartevelle@nga.mil

## License and copyright

Copyright 2014-2020 Trevor Bedford and Richard Neher.

Source code to Nextstrain is made available under the terms of the [GNU Affero General Public License](LICENSE.txt) (AGPL). Nextstrain is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.