function browseFile() {
    document.getElementById('chooseFile').click();
}

function getFile() {
    var browse = document.getElementById('chooseFile');
    var txt = "";
    var type = "";
    var size = ""; 
    var res = "";
    var duration = "";
    var source = document.getElementById('video-source');
    var url = window.URL || window.webkitURL;

    if ('files' in browse) {
        if (browse.files.length == 0) {
            txt = "Select a file.";
        } else {
            var file = browse.files[0];
            if ('type' in file) {
                type = file.type;
                var videoNode = document.querySelector('video');
                var canPlay = videoNode.canPlayType(type);
                if (canPlay === '') {
                    text = "Choose a video file."
                } else {
                    if ('name' in file) {
                        txt += file.name;
                    }

                    var fileURL = url.createObjectURL(file);
                    source.removeAttribute('hidden');
                    source.src = fileURL;

                    source.addEventListener('loadedmetadata', function() {
                        type = "File type: " + file.type;
                        size = "<br>File size: " + (file.size/1000000).toFixed(2) + " MB";
                        res = "<br>Resolution: " + source.videoWidth + " x " + source.videoHeight;
                        duration = "<br>Duration: " + Math.round(source.duration) + " secs";
                    
                        document.getElementById('file-type').innerHTML = type;
                        document.getElementById('file-size').innerHTML = size;
                        document.getElementById('file-res').innerHTML = res;
                        document.getElementById('file-duration').innerHTML = duration;
                    });
                }
            }
        }
    } else {
        if (x.value == "") {
            txt += "Select a file.";
        } else {
            txt += "The files property is not supported!";
            txt  += "<br>The path of the selected file: " + x.value; 
        }
    }

    document.getElementById('file-text').innerHTML = txt;
    enableAll();
}

function enableAll() {
    document.getElementById('normal-detection').removeAttribute('disabled');
    document.getElementById('traffic-detection').removeAttribute('disabled');
    document.getElementById('demo-checkbox').removeAttribute('disabled');
    document.getElementById('network-select').removeAttribute('disabled');
    document.getElementById('weight-select').removeAttribute('disabled');
    document.getElementById('default-threshold').removeAttribute('disabled');
    document.getElementById('custom-threshold').removeAttribute('disabled');
    document.getElementById('default-gpu').removeAttribute('disabled');
    document.getElementById('custom-gpu').removeAttribute('disabled');
    document.getElementById('default-filter').removeAttribute('disabled');
    document.getElementById('custom-filter').removeAttribute('disabled');
    document.getElementById('default-roi').removeAttribute('disabled');
    document.getElementById('custom-roi').removeAttribute('disabled');
}

function stepBackVideo() {
    document.getElementById('video-source').currentTime -= 5;
}

function repeatVideo() {
    var video = document.getElementById('video-source');
    var button = document.getElementById('repeat-button-path');

    if (video.loop) {
        video.loop = false;
        button.setAttribute('fill', 'rgba(255, 255, 255, 0.2)');
    } else {
        video.loop = true;
        button.setAttribute('fill', 'white');
    }
}

function playVideo() {
    document.getElementById('video-source').play();
    document.getElementById('play-button-path').setAttribute('fill', 'none');
    document.getElementById('pause-button').style.display = 'inline';
}

function pauseVideo() {
    document.getElementById('video-source').pause();
    document.getElementById('play-button-path').setAttribute('fill', 'white');
    document.getElementById('pause-button').style.display = 'none';
}

function stopVideo() {
    var video = document.getElementById('video-source');

    video.pause();
    document.getElementById('play-button-path').setAttribute('fill', 'white');
    document.getElementById('pause-button').style.display = 'none';
    video.currentTime = 0;
}

function stepForwardVideo() {
    document.getElementById('video-source').currentTime += 5;
}

function checkInMin() {
    var num = document.getElementById('in-min');
    if (!num.value.match('^' + num.getAttribute('pattern') + '$')) {
        //change the following code to error handling
        num.value="";
    }
}

function checkInSec() {
    var num = document.getElementById('in-sec');
    if (!num.value.match('^' + num.getAttribute('pattern') + '$')) {
        //change the following code to error handling
        num.value="";
    }
}

function checkOutMin() {
    var num = document.getElementById('out-min');
    if (!num.value.match('^' + num.getAttribute('pattern') + '$')) {
        //change the following code to error handling
        num.value="";
    }
}

function checkOutSec() {
    var num = document.getElementById('out-sec');
    if (!num.value.match('^' + num.getAttribute('pattern') + '$')) {
        //change the following code to error handling
        num.value="";
    }
}

function enableCustomThreshold() {
    var custom = document.getElementById('custom-threshold');
    var range = document.getElementById('range-threshold');
    var num = document.getElementById('number-threshold');

    if (custom.checked) {
        range.removeAttribute('disabled');
        num.removeAttribute('disabled');
        
    }
}

function disableCustomThreshold() {
    var def = document.getElementById('default-threshold');
    var range = document.getElementById('range-threshold');
    var num = document.getElementById('number-threshold');

    if (def.checked) {
        range.disabled=true;
        num.disabled=true;
    }
}

function checkNumThreshold() {
    var num = document.getElementById('number-threshold');
    if (!num.value.match('^' + num.getAttribute('pattern') + '$')) {
        //change the following code to error handling
        num.value="";
    }
}

function enableCustomGPU() {
    var custom = document.getElementById('custom-gpu');
    var range = document.getElementById('range-gpu');
    var num = document.getElementById('number-gpu');
    var unit = document.getElementById('num-unit');

    if (custom.checked) {
        range.removeAttribute('disabled');
        num.removeAttribute('disabled');
        unit.style.color = 'var(--light)';
    }
}

function disableCustomGPU() {
    var def = document.getElementById('default-gpu');
    var range = document.getElementById('range-gpu');
    var num = document.getElementById('number-gpu');
    var unit = document.getElementById('num-unit');

    if (def.checked) {
        range.disabled=true;
        num.disabled=true;
        unit.style.color = 'var(--transparent-white-20)';
    }
}

function checkNumGPU() {
    var num = document.getElementById('number-gpu');
    if (!num.value.match('^' + num.getAttribute('pattern') + '$')) {
        //change the following code to error handling
        num.value="";
    }
}

function enableCustomROI() {
    var custom = document.getElementById('custom-roi');
    var sep = document.getElementById('label-separator');
    var tlx_ = document.getElementById('tlx');
    var tly_ = document.getElementById('tly');
    var trx_ = document.getElementById('trx');
    var try_ = document.getElementById('try');
    var blx_ = document.getElementById('blx');
    var bly_ = document.getElementById('bly');
    var brx_ = document.getElementById('brx');
    var bry_ = document.getElementById('bry');
    var frame = document.getElementById('edit-frame');

    if (custom.checked) {
        tlx_.removeAttribute('disabled');
        tly_.removeAttribute('disabled');
        trx_.removeAttribute('disabled');
        try_.removeAttribute('disabled');
        blx_.removeAttribute('disabled');
        bly_.removeAttribute('disabled');
        brx_.removeAttribute('disabled');
        bry_.removeAttribute('disabled');
        sep.style.color = 'var(--light)';
        frame.style.borderColor = 'var(--light)';
        frame.style.color = 'var(--light)';
        frame.style.cursor = 'pointer';
    }
}

function disableCustomROI() {
    var def = document.getElementById('default-roi');
    var sep = document.getElementById('label-separator');
    var tlx_ = document.getElementById('tlx');
    var tly_ = document.getElementById('tly');
    var trx_ = document.getElementById('trx');
    var try_ = document.getElementById('try');
    var blx_ = document.getElementById('blx');
    var bly_ = document.getElementById('bly');
    var brx_ = document.getElementById('brx');
    var bry_ = document.getElementById('bry');
    var frame = document.getElementById('edit-frame');

    if (def.checked) {
        tlx_.disabled = true;
        tly_.disabled = true;
        trx_.disabled = true;
        try_.disabled = true;
        blx_.disabled = true;
        bly_.disabled = true;
        brx_.disabled = true;
        bry_.disabled = true;
        sep.style.color = 'var(--transparent-white-20)';
        frame.style.color = 'var(--transparent-white-20)';
        frame.style.borderColor = 'var(--transparent-white-20)';
        frame.style.cursor = 'default';
    }
}
