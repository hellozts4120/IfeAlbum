var GalleryWaterfall = function (selector) {
    this.target = document.querySelector(selector);
    this.col = this.setCol();
    this.init();
}

GalleryWaterfall.prototype.init = function() {
    var width = this.target.clientWidth / this.col;
    var html = "";
    for (var i = 0; i < this.col; i++) {
        html += '<div class="gallery-column" style="width: ' + width + 'px"></div>';
    }
    this.target.innerHTML = html;
    this.columns = this.target.querySelectorAll('.gallery-column');
}

GalleryWaterfall.prototype.setCol = function() {
    var col = 2;
    if (innerWidth > 1200) {
        col = 5;
    }
    else if (innerWidth > 992) {
        col = 4;
    }
    else if (innerWidth > 768) {
        col = 3;
    }
    return col;
}

GalleryWaterfall.prototype.append = function(photos) {
    photos.forEach((function(photo) {
        var item = document.createElement("div");
        item.className = "gallery-item";
        item.innerHTML = 
            '<div class="gallery-photo">' +
                '<img class="gallery-image"' + '" src="' + photo + '">' +
            '</div>';
        this.getMinCol().appendChild(item);
        item.querySelector('.gallery-photo').style.height = parseInt(item.clientWidth / photo.aspect_ratio) + 'px';
    }).bind(this));
}

GalleryWaterfall.prototype.clear = function() {
    for (var i = 0; i < this.columns.length; i++) {
        this.columns[i].innerHTML = "";
    }
}

GalleryWaterfall.prototype.getMinCol = function() {
    var min = this.columns[0];
    for (var i = 0; i < this.columns.length; i++) {
        if (this.columns[i].clientHeight < min.clientHeight) {
            min = this.columns[i];
        }
    }
    return min;
}