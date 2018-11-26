# Y-LAB

## Overview
**YOLO Labelling** or **Y-LAB** is a simple GUI for [YOLO](https://pjreddie.com/darknet/yolo/) to aid learning for new users and introduce them to Object Detection. This project will use [Electron.JS](https://electronjs.org/) as the interface.

### YOLO
#### Setting Up Python3 and pip
1. Download the latest version of the Python installer from the [Python download page](https://www.python.org/downloads/)
2. Run the installer (make sure to check the box Add Python 3.x to PATH)
3. The version of the installed Python can be checked by running `python --version`
4. Make sure `pip` is updated by running `python -m pip install -U pip`

#### Setting Up OpenCV for Python
1. Install `numpy` by following one of the methods [here](https://scipy.org/install.html) depending on your operating system
1. Run `python -m pip install opencv-python`

#### Setting Up Tensorflow
1. Run `python -m pip install tensorflow`
   - Alternatively, run `python -m pip install tensorflow-gpu` to install the GPU package which requires a [CUDA®-enabled GPU card](https://www.tensorflow.org/install/gpu)

#### Setting Up Darkflow
1. Clone the Darkflow repo by running `git clone https://github.com/thtrieu/darkflow.git`
2. Run `cd darkflow`
3. Install Cython by running `pip install cython`
4. Install Darkflow globally by running `pip install .`

### Electron.JS
#### Setting Up Electron
1. Install [Node.JS](https://nodejs.org/en/)
2. Open the Node.js CMD and run `npm install -g electron` to install Electron
3. Clone the repo by running `git clone https://github.com/log-basee/y-lab.git`
   - [Download the repo](https://github.com/log-basee/y-lab/archive/master.zip) if you can't clone it and extract the file
4. Run `cd y-lab` (or `cd y-lab/master` if you downloaded the repo)
5. Install the dependencies by running `npm install`
6. Run the app with `npm start` or `electron .`


## Tasks to do
- [ ] UI Design & Prototyping
- [ ] Initial Survey<br>
Implementation:
  - [ ] Implementation of Electron.JS UI
  - [ ] Electron - Python API
  - [ ] YOLO
- [ ] Testing & Evaluation
- [ ] Bug Fix
- [ ] Documentation & Manual


## Members
1. [Laurentius Dominick Logan](https://github.com/Log-baseE)
2. [Barjuan Davis Penthalion](https://github.com/cokpsz)
3. [Christopher Yefta](https://github.com/ChrisYef)
4. [Madeleine Jose Josodipuro](https://github.com/haysacks)
5. [Nadya Felim Bachtiar](https://github.com/Ao-Re)
