const electron = window.require('electron');
const {
  remote
} = electron;
const {
  PythonShell
} = remote.require('python-shell');
const path = remote.require('path');

var detector = null;

export const startDetect = (options, messageCallback, finishCallback) => {
  console.log(remote.app.getAppPath());
  let opts = {
    filePath: options.file.path,
    traffic: options.type === 'traffic',
    algorithm: options.algorithm,
  }
  if (options.roiType !== 'all') {
    opts.roi = {
      topLeft: {
        x: parseInt(options.roi.topLeft.x),
        y: parseInt(options.roi.topLeft.y)
      },
      topRight: {
        x: parseInt(options.roi.topRight.x),
        y: parseInt(options.roi.topRight.y)
      },
      bottomLeft: {
        x: parseInt(options.roi.bottomLeft.x),
        y: parseInt(options.roi.bottomLeft.y)
      },
      bottomRight: {
        x: parseInt(options.roi.bottomRight.x),
        y: parseInt(options.roi.bottomRight.y)
      },
    };
  } else {
    opts.roi = {
      topLeft: {
        x: 0,
        y: 0
      },
      topRight: {
        x: parseInt(options.meta.res.width),
        y: 0
      },
      bottomLeft: {
        x: 0,
        y: parseInt(options.meta.res.height)
      },
      bottomRight: {
        x: parseInt(options.meta.res.width),
        y: parseInt(options.meta.res.height)
      },
    };
  }
  if (options.nnModel !== 'default') {
    opts.model = 'path';
  }
  if (options.weights !== 'default') {
    opts.weights = 'path';
  }
  if (options.filterType !== 'all') {
    opts.filter = options.filter.split(';');
  }
  if (options.thresholdType !== 'default') {
    opts.confidenceThreshold = options.lastValidThreshold;
  }
  if (options.gpuType !== 'default') {
    opts.gpu = options.lastValidGpu / 100;
  }
  if (options.pixelTresholdType !== 'default') {
    opts.pixelThreshold = parseInt(options.pixelThreshold);
  }
  if (options.timeThresholdType !== 'default') {
    opts.timeThreshold = parseInt(options.timeThreshold);
  }
  if (options.algorithm === "andrew") {
    opts.lanes = options.lanes;
  }
  var pyOptions = {
    scriptPath: path.join(remote.app.getAppPath(), './engine'),
    pythonPath: remote.process.env.PYTHON_PATH,
    pythonOptions: ['-u'],
    args: ['-j', JSON.stringify(opts), '-v']
  };

  detector = new PythonShell('./main.py', pyOptions);

  detector.on('message', function (message) {
    messageCallback(message);
  });

  detector.end(finishCallback);
}

export const cancelDetect = () => {
  if (detector) detector.childProcess.kill('SIGINT');
}