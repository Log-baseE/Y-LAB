function browseFile() {
    document.getElementById('chooseFile').click();
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

function enableCustomWeight() {
    var custom = document.getElementById('custom-weight');
    var range = document.getElementById('range-weight');
    var num = document.getElementById('number-weight');
    var unit = document.getElementById('num-unit');

    if (custom.checked) {
        range.removeAttribute('disabled');
        num.removeAttribute('disabled');
        unit.style.color = 'var(--light)';
    }
}

function disableCustomWeight() {
    var def = document.getElementById('default-weight');
    var range = document.getElementById('range-weight');
    var num = document.getElementById('number-weight');
    var unit = document.getElementById('num-unit');

    if (def.checked) {
        range.disabled=true;
        num.disabled=true;
        unit.style.color = 'var(--transparent-white-20)';
    }
}

function checkNumWeight() {
    var num = document.getElementById('number-weight');
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
