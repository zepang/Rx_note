function blobToUint8Array(b) {
    var uri = URL.createObjectURL(b),
        xhr = new XMLHttpRequest(),
        i,
        ui8;

    xhr.open('GET', uri, false);
    xhr.send();

    URL.revokeObjectURL(uri);

    ui8 = new Uint8Array(xhr.response.length);

    for (i = 0; i < xhr.response.length; ++i) {
        ui8[i] = xhr.response.charCodeAt(i);
    }

    return ui8;
}

var b = new Blob(['abc'], {type: 'application/octet-stream'});
blobToUint8Array(b); // [97, 98, 99]