const electron = window.require('electron');
const { remote } = electron;
const { PythonShell } = remote.require('python-shell');
const path = remote.require('path');

var detector = null;

export const startDetect = (options, messageCallback, finishCallback) => {
    console.log(remote.app.getAppPath());
    var pyOptions = {
        scriptPath: path.join(remote.app.getAppPath(), './engine'),
        pythonPath: 'C:/tools/Anaconda3/envs/yolo-venv/python',
        pythonOptions: ['-u'],
        args: [ options.file.path ]
    };

    detector = new PythonShell('./main.py', pyOptions);

    detector.on('message', function (message) {
        messageCallback(message);
    });

    detector.end(finishCallback);
}

export const cancelDetect = () => {
    if(detector) detector.childProcess.kill('SIGINT');
}