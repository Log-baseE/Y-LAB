function browseFile() {
    document.getElementById('chooseFile').click();
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

function enableCustomWeight() {
    var custom = document.getElementById('custom-weight');
    var range = document.getElementById('range-weight');
    var num = document.getElementById('number-weight');

    if (custom.checked) {
        range.removeAttribute('disabled');
        num.removeAttribute('disabled');
    }
}

function disableCustomWeight() {
    var def = document.getElementById('default-weight');
    var range = document.getElementById('range-weight');
    var num = document.getElementById('number-weight');

    if (def.checked) {
        range.disabled=true;
        num.disabled=true;
    }
}
