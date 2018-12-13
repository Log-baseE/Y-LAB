<h1 align="center">
    Y-Lab
</h1>
<p align="center">
<sup>
<b>YOLO Lab - an intoductory application to the YOLO library</b>
</sup>
</p>

<br>

## Key Features

Y-Lab is an application to introduce you the capabilities of YOLO library. The interface will show how the library works or at least, how car objects are detected from images.

<br>

## Getting Started

### Installation

#### Setting Up Anaconda

1. Download the Anaconda installer for Python 3.x from the [Anaconda download page](https://www.anaconda.com/download/).
2. In Windows run the installer by double-clicking the downloaded file. In Linux install by typing:
```sh
# in terminal window, where [Anaconda-latest-Linux-x86_64.sh] is the name of downloaded file
bash [Anaconda-latest-Linux-x86_64.sh]
```

#### Setting Up a Conda Environment

1. Create a new Conda environment by typing:
```sh
# in the Anaconda Prompt, where [env_name] is the name of the specified environment
conda create -n [env_name] python=3.5
```
2. Activate the virtual environment by typing:
```sh
# in Windows
activate [env_name]

# in Linux
# in Anaconda Prompt, where [env_name] is the name of the specified environment
source activate [env_name] 
```

#### Setting Up the Libraries for Python

1. Install __numpy__ by typing:
```sh
pip install numpy
```
2. Install __pandas__ by typing:
```sh
pip install pandas
```
3. Install __cython__ by typing:
```sh
pip install cython
```
4. Install __OpenCV__ for Python by typing:
```sh
pip install opencv\-python
```

#### Setting Up Tensorflow

1. Type:
```sh
python \-m pip install tensorflow
```
Alternatively to install the GPU package which requires a [CUDA®-enabled GPU card](https://www.tensorflow.org/install/gpu), run:
```sh
python \-m pip install tensorflow\-gpu
```

#### Setting Up Git

1. In Windows, install Git by downloading [git](https://git-scm.com/download/win), and double-clicking on the downloaded file. In Linux, install Git by typing:
```sh
# in the terminal window
apt-get install git
```

#### Setting Up Darkflow

1. Clone the Darkflow repo by typing:
```sh
git clone https://github.com/thtrieu/darkflow.git
```
2. Type:
```sh
cd darkflow
```
3. Install Darkflow globally by typing:
```sh
pip install .
```

#### Setting Up Electron

1. Download [Node.js](https://nodejs.org/en/) and install it
2. Open the Node.js command prompt and install Electron by typing:
```sh
npm install -g electron
```

#### Setting Up the Repository

1. Clone the repo by typing:
```sh
git clone https://github.com/log-basee/y-lab.git
```
[Download the repo](https://github.com/log-basee/y-lab/archive/master.zip) if you can't clone it and extract the file
2. Enter the folder directory by typing:
```sh
# if you downloaded the repo
cd y-lab/master 

# or
cd y-lab
```
3. Install the dependencies by typing:
```sh
npm install
```
4. Run the app by typing:
```sh
npm start 

# or 
electron
```

<br>

### User Access Consideration

Due to the fact that the application is running offline, there is only one user access without any significant restrictions.

<br>

### Accessing the System

To access the system, the user only needs to open the application without any login procedures needed because the application is running offline in the user’s desktop without affecting the application itself.

<br>

### System Organization & Navigation

When opening the application, the user will be directed to the index screen. At the index screen, apart from setting other configurations, the user will also be given the choice to select either the video detection mode or vehicle counting mode, which works as follows:

- __Video Detection__<br>
The video detection mode detects objects in the input video and highlights them with bounding boxes. The objects to be detected can be further specified by the user.

- __Vehicle Counting__<br>
The vehicle counting mode, apart from detecting objects (specifically cars and trucks),  calculates the number of vehicles (limited to cars and trucks) which passes the counting line located in the middle of the region of interest.

After finishing the configuration, the user will be directed to the progress screen to show progress of the video processing. When the process finished, user will be directed to the result screen and the application will show the result of the process. On this screen, the user is given the option to restart the process with a new video.

<br>

### Exiting the System

To exit the system, the user only needs to close the application and provides a confirmation for the system. If the application is in the middle of processing video, the application will show a warning and ask for user’s confirmation to stop all process. On the other hand, if the application has any unsaved output or settings, the application will give the option to save before exiting the application or just immediately close the application.

<br>

## Using the System

### User interface

#### Index Screen

![Index Screen](/screenshots/image2.png)

1. __File path:__ this will show the file path of the video you chose. You can choose a video by clicking the ‘Browse’ button
2. __Object detection type:__ you can either choose the default object detection, or traffic detection.
3. __File details:__ if you have chosen a video file, its details will appear here.
4. __Region of interest (ROI):__ specify which part of the video you want to process. Regions outside the ROI will be ignored
5. __Neural network model:__ specify the neural network model you are going to use. If you don’t know what you’re doing, the default one will suffice.
6. __Weights:__ specify the weights of the neural network to be used. If you don’t know what you’re doing, the default one will suffice.
7. __Threshold:__ objects are detected with a certain confidence ranging from 0 to 1. If the confidence is below the threshold, it will be ignored, and vice versa. You can choose the default one, or customize it yourself.
8. __GPU use:__ to speed up the object detection process, your GPU will be used. You can specify how much GPU should be used for the program. **_WARNING:_** setting it to the max may cause other programs to crash.
9. __Object filter:__ you can filter out which objects should be detected from the video. 

#### Index Screen \(file chosen\)

![Index Screen (file chosen)](/screenshots/image6.png)

1. __‘Looks good!’:__ Once everything is done, you can press this button for the video to be processed.
2. __‘Save options’:__ You can save the configuration you made to an external .json file.
3. __Video controls:__ you can preview the video you have chosen and control with the usual video controls.

#### Processing Screen

![Processing Screen](/screenshots/image5.png)

1. __‘Continue’__: if the process is done, press this to move on to view the results.
2. __‘Cancel’__: cancel the process at any time.

#### Result Screen

![Result Screen](/screenshots/image4.png)

1. __Result:__ shows the results processed from the video.
2. __Video details:__ shows the details of the result video.
3. __‘Try again’:__ restarts the app from the beginning, so you can experiment with other settings.
4. __‘Save video’:__ saves the result video to an external .mp4 file
5. __Video controls:__ controls the result video preview.

<br>

### Functionalities

#### Detect objects from video

This function enables users to detect objects from video.

![Index Screen](/screenshots/image2.png)
__Step 1:__ Click on ‘browse’ button (1) to choose a video
<br>
__Step 1a (optional):__ If desired, customize the settings (4-9) for the object detection engine.

![Index Screen (file chosen)](/screenshots/image6.png)
__Step 2:__ Press ‘looks good’ (1) to start the object detection process. Press ‘go!’ on the confirmation dialog.
<br>
__Step 3:__ A process screen like below should appear. Wait until the progress bar is full.

![Processing Screen](/screenshots/image5.png)
__Step 4:__ Once it’s done, press the ‘continue’ button (1).

![Result Screen](/screenshots/image4.png)
__Step 5:__ A result screen like the image above should appear. If you wish to restart the process, press ‘try again’ (3) and repeat from step 1.


<br>

## Troubleshooting & Support

### Error Messages

The errors the user might encounter in this application are:

1. __node-gyp build error__
	* Description: This can occur for Windows users.
	* Fix: run the following command:
```sh
npm install --global windows-build-tools
```

2. __tensorflow: CUDA library not found__
	* Description: This occurs when CUDA is not installed properly
	* Fix: make sure CUDA v9.0 is installed in your system, and is available in the PATH variable. You can refer [here](https://www.tensorflow.org/install/gpu) for the complete instructions.

3. __OpenCV: missing dll, unsupported video codec__
	* Description: this might happen when rendering the result video.
	* Fix: download the .dll file from [here](https://github.com/cisco/openh264/releases), and put it in your PATH variable

<br>

### Support

Should any errors/bugs, questions, or support is needed, please open an issue at [http://github.com/Log-baseE/Y-LAB/issues](http://github.com/Log-baseE/Y-LAB/issues).

1. Click the \"New Issue\" button
2. Provide the name of the issue in the Title field
3. Provide a detailed information regarding the issue in the  which may include but not limited to:
	* Snippets of the issue
	* Description regarding the event preceding the issue
4. Add labels regarding the issue
5. Submit the issue and wait for the development team to reach back

<br>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

<br>

## Authors

* **[Laurentius Dominick Logan](https://github.com/Log-baseE)**
* **[Barjuan Davis Penthalion](https://github.com/cokpsz)**
* **[Christopher Yefta](https://github.com/ChrisYef)**
* **[Madeleine Jose Josodipuro](https://github.com/haysacks)**
* **[Nadya Felim Bachtiar](https://github.com/Ao-Re)**