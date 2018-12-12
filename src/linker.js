const electron = window.require('electron');
const { remote } = electron;
const { PythonShell } = remote.require('python-shell');
const path = remote.require('path');

var detector = null;

export const startDetect = (options, messageCallback, finishCallback) => {
    console.log(remote.app.getAppPath());
    let opts = {
        file_path: options.file.path,
        detect_type: options.type,
        roi: options.roiType === 'all' ? null : options.roi,
        model: options.nnModel === 'default' ? null : 'path',
        weights: options.weights === 'default' ? null : 'path',
        filter: options.filterType === 'all' ? null : options.filter.split(';'),
        threshold: options.thresholdType === 'default' ? 'default' : options.lastValidThreshold,
        gpu: options.gpuType === 'default' ? 'default' : options.lastValidGpu,
    }
    var pyOptions = {
        scriptPath: path.join(remote.app.getAppPath(), './engine'),
        pythonPath: 'C:/tools/Anaconda3/envs/yolo-venv/python',
        pythonOptions: ['-u'],
        args: [ JSON.stringify(opts) ]
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