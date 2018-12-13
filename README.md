# Y-Lab

YOLO Lab - an intoductory application to the YOLO library

## Key Features

Y-Lab is an application to introduce you the capabilities of YOLO library. The interface will show how the library works or at least, how car objects are detected from images.

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

1. Install **numpy** by typing:

    ```sh
    pip install numpy
    ```

2. Install **pandas** by typing:

    ```sh
    pip install pandas
    ```

3. Install **cython** by typing:

    ```sh
    pip install cython
    ```

4. Install **OpenCV** for Python by typing:
    ```sh
    pip install opencv-python
    ```

#### Setting Up Tensorflow

1. Type:

    ```sh
    python -m pip install tensorflow
    ```

    Alternatively to install the GPU package which requires a [CUDA®-enabled GPU card](https://www.tensorflow.org/install/gpu), run:

    ```sh
    python -m pip install tensorflow-gpu
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

### User Access Consideration

Due to the fact that the application is running offline, there is only one user access without any significant restrictions.

### Accessing the System

To access the system, the user only needs to open the application without any login procedures needed because the application is running offline in the user’s desktop without affecting the application itself.

### System Organization & Navigation

When opening the application, the user will be directed to the index screen. At the index screen, apart from setting other configurations, the user will also be given the choice to select either the video detection mode or vehicle counting mode, which works as follows:

- **Video Detection**

  The video detection mode detects objects in the input video and highlights them with bounding boxes. The objects to be detected can be further specified by the user.

- **Vehicle Counting**

  The vehicle counting mode, apart from detecting objects (specifically cars and trucks), calculates the number of vehicles (limited to cars and trucks) which passes the counting line located in the middle of the region of interest.

  After finishing the configuration, the user will be directed to the progress screen to show progress of the video processing. When the process finished, user will be directed to the result screen and the application will show the result of the process. On this screen, the user is given the option to restart the process with a new video.

### Exiting the System

To exit the system, the user only needs to close the application and provides a confirmation for the system. If the application is in the middle of processing video, the application will show a warning and ask for user’s confirmation to stop all process. On the other hand, if the application has any unsaved output or settings, the application will give the option to save before exiting the application or just immediately close the application.

## Using the System

### User interface

#### Index Screen

![Index Screen](/screenshots/image2.png)

1. **File path:** this will show the file path of the video you chose. You can choose a video by clicking the ‘Browse’ button
2. **Object detection type:** you can either choose the default object detection, or traffic detection.
3. **File details:** if you have chosen a video file, its details will appear here.
4. **Region of interest (ROI):** specify which part of the video you want to process. Regions outside the ROI will be ignored
5. **Neural network model:** specify the neural network model you are going to use. If you don’t know what you’re doing, the default one will suffice.
6. **Weights:** specify the weights of the neural network to be used. If you don’t know what you’re doing, the default one will suffice.
7. **Threshold:** objects are detected with a certain confidence ranging from 0 to 1. If the confidence is below the threshold, it will be ignored, and vice versa. You can choose the default one, or customize it yourself.
8. **GPU use:** to speed up the object detection process, your GPU will be used. You can specify how much GPU should be used for the program. **_WARNING:_** setting it to the max may cause other programs to crash.
9. **Object filter:** you can filter out which objects should be detected from the video.

#### Index Screen (file chosen)

![Index Screen (file chosen)](/screenshots/image6.png)

1. **‘Looks good!’:** Once everything is done, you can press this button for the video to be processed.
2. **‘Save options’:** You can save the configuration you made to an external .json file.
3. **Video controls:** you can preview the video you have chosen and control with the usual video controls.

#### Processing Screen

![Processing Screen](/screenshots/image5.png)

1. **‘Continue’**: if the process is done, press this to move on to view the results.
2. **‘Cancel’**: cancel the process at any time.

#### Result Screen

![Result Screen](/screenshots/image4.png)

1. **Result:** shows the results processed from the video.
2. **Video details:** shows the details of the result video.
3. **‘Try again’:** restarts the app from the beginning, so you can experiment with other settings.
4. **‘Save video’:** saves the result video to an external .mp4 file
5. **Video controls:** controls the result video preview.

### Functionalities

#### Detect objects from video

This function enables users to detect objects from video.

![Index Screen](/screenshots/image2.png)

**Step 1:** Click on ‘browse’ button (1) to choose a video

**Step 1a (optional):** If desired, customize the settings (4-9) for the object detection engine.

![Index Screen (file chosen)](/screenshots/image6.png)

**Step 2:** Press ‘looks good’ (1) to start the object detection process. Press ‘go!’ on the confirmation dialog.

**Step 3:** A process screen like below should appear. Wait until the progress bar is full.

![Processing Screen](/screenshots/image5.png)

**Step 4:** Once it’s done, press the ‘continue’ button (1).

![Result Screen](/screenshots/image4.png)

**Step 5:** A result screen like the image above should appear. If you wish to restart the process, press ‘try again’ (3) and repeat from step 1.

## Troubleshooting & Support

### Common errors during video processing

#### `Error: ModuleNotFoundError: No module named '<module-name>'`

This means that the specified module is not installed in the python environment. Try running `pip install <module-name>` to resolve this issue. Make sure you are in the same virtual environment as the one you picked during setup

#### `ImportError: DLL load failed: The specified module could not be found.`

This means the required NVIDIA `.dll`s for `tensorflow` are not available in the `PATH` environment variable. Make sure that the required `PATH`s are readily available. You can refer to the [tensorflow Installation page](https://www.tensorflow.org/Install/gpu) for more information.

#### Other errors

Others occurring during video processing are likely due to a python error. Please [open a new issue](https://github.com/Log-baseE/y-lab/issues/new) and paste the full error message.

### Support

Should any errors/bugs, questions, or support is needed, please open an issue at [http://github.com/Log-baseE/Y-LAB/issues](http://github.com/Log-baseE/Y-LAB/issues).

1. Click the ***New Issue*** button
2. Provide the name of the issue in the Title field
3. Provide a detailed information regarding the issue in the which may include but not limited to:
    - Snippets of the issue
    - Description regarding the event preceding the issue
4. Add labels regarding the issue
5. Submit the issue and wait for the development team to reach back

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Authors

- **[Laurentius Dominick Logan](https://github.com/Log-baseE)**
- **[Barjuan Davis Penthalion](https://github.com/cokpsz)**
- **[Christopher Yefta](https://github.com/ChrisYef)**
- **[Madeleine Jose Josodipuro](https://github.com/haysacks)**
- **[Nadya Felim Bachtiar](https://github.com/Ao-Re)**
