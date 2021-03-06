---
title: Install Auspice
---

## Prerequisites
Auspice is a JavaScript program, and requires [Node.js](https://nodejs.org/) to be installed on your system.
We've had success running a range of different node versions between 10.8 and 13.

We highly recommend using [Conda](https://conda.io/docs/) to manage environments, i.e. use Conda to create an environment with Node.js installed where you can use Auspice.
It's possible to use other methods, but this documentation presupposes that you have Conda installed.

To run package scripts, the [`bash` shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) and the [`env`](https://en.wikipedia.org/wiki/Env) command need to be in your `PATH`.
You should already have them on Unix-like systems including Linux and macOS.
If you are working from Windows, you can run the installation under Git Bash, MSYS2, or Cygwin.
You can also use the Windows Subsystem Linux for a fuller Linux environment.

## Create a Conda Environment
```bash
conda create --name auspice nodejs=12
conda activate auspice
```

> This parallels [the Nextstrain installation docs](https://nextstrain.org/docs/getting-started/local-installation#install-augur--auspice-with-conda-recommended).
You're welcome to use those instead!

## Install Auspice from npm


```bash
npm install --global auspice
```
Auspice should now be available as a command-line program -- check by running `auspice --help`.

If you look at the [release notes](releases/changelog.md) you can see the changes that have been made to Auspice (see your version of Auspice via `auspice --version`).
To upgrade, you can run

```bash
npm update --global auspice
```

## Installing from Source


This is useful for debugging, modifying the source code, or using an unpublished feature branch.
We're going to assume that you have used Conda to install Node.js as above.

```bash
# activate the correct conda enviornment
conda activate auspice

# grab the GitHub auspice repo
git clone https://github.com/nextstrain/auspice.git
cd auspice

# install dependencies and make `auspice` available globally
npm install --global .

# build auspice (builds the JS client bundle using webpack)
auspice build

# test it works
auspice --version
auspice --help

# Obtain datasets & narratives to view locally (optional)
npm run get-data
npm run get-narratives
```

Updating Auspice should only require pulling the new version from GitHub -- it shouldn't require any `npm` commands.
You will, however, have to re-build Auspice whenever the client-related code has changed, via `auspice build`.
