ifeAlbum.setLayout(3);
ifeAlbum.setImage(["../src/img/1.png", "../src/img/2.png", "../src/img/3.png", "../src/img/4.png", "../src/img/5.png", "../src/img/6.png", "../src/img/7.png"]);


window.onload = function () {

    ifeAlbum.enableFullscreen();
    ifeAlbum.removeImage(["../src/img/1.png"])
    ifeAlbum.addImage(["../src/img/1.png"])
    ifeAlbum.setGutter(10,10);
}