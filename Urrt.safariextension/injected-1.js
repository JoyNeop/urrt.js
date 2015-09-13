safari.self.addEventListener('message', function (evt) {
    if (evt.name == 'urrtrun') {
        var myScriptTag = document.createElement('script');
        myScriptTag.src = safari.extension.baseURI + 'urrt.js';
        document.body.appendChild(myScriptTag);
    }
}, false);
