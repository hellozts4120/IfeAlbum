// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}

function request(url) {
    return new Promise(function(resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        addEvent(xhr, "load", function() {
            resolve(JSON.parse(this.response));
        })
    })
}

function getPhotos(page, source) {
    page = page || 0;
    source = source || '500px';
    return request('http://test.facelending.com:3000/?source=' + source + '&page=' + page);
}