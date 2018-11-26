'use strict'

// alert('123');

const {PythonShell} = require("python-shell");
window.$ = window.jQuery = require('jquery')
window.Bootstrap = require('bootstrap')

$('#file').on('change', function(e) {
    $('#fileHelpId').text($('#file')[0].files[0].path);
});

$('#file-form').submit(function (e) {
    e.preventDefault();
    $('#output').empty();
    // startLoop($('#number').val());
    startDetect($('#file')[0].files[0].path);
    // console.log();
    // alert($('#file').files[0]);
});

// function startLoop(it) {
//     $('#submit').attr('disabled', 'disabled');
//     var path = require('path');
//     var options = {
//         scriptPath: path.join(__dirname, './engine'),
//         pythonPath: 'C:/tools/Anaconda3/envs/yolo-venv/python',
//         pythonOptions: ['-u'],
//         args: [it]
//     };

//     var loop = new PythonShell('./main.py', options);

//     loop.on('message', function (message) {
//         $('#output').append(`<li>${message}</li>`);
//     });

//     loop.end(function (err, code, signal) {
//         if (err) throw err;
//         console.log('The exit code was: ' + code);
//         console.log('The exit signal was: ' + signal);
//         console.log('finished');
//         console.log('finished');
//         $('#submit').attr('disabled', false);
//     });
// }

function startDetect(videopath) {
    $('#submit').attr('disabled', 'disabled');
    $('#msg').removeClass('d-none');
    var path = require('path');
    var options = {
        scriptPath: path.join(__dirname, './engine'),
        pythonPath: 'C:/tools/Anaconda3/envs/yolo-venv/python',
        pythonOptions: ['-u'],
        args: [ videopath ]
    };

    var detector = new PythonShell('./main.py', options);

    detector.on('message', function (message) {
        $('#output').append(`<p class="m-0 text-monospace">${message}</p>`);
        $("html, body").animate({ scrollTop: $(document).height() }, 500);
    });

    detector.end(function (err, code, signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
        console.log('finished');
        $('#submit').attr('disabled', false);
        $('#msg').addClass('d-none');
    });
}