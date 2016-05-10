var GalleryWaterfall = function (selector, col) {
    this.target = document.querySelector(selector);
    this.col = col || 5;
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

GalleryWaterfall.prototype.append = function(photos) {
    photos.forEach((function(photo) {
        var item = document.createElement("div");
        item.className = "gallery-item";
        item.innerHTML = 
            '<div class="gallery-photo">' +
                '<img class="gallery-image" data-large="' + photo.image.large + '" src="' + photo.image.small + '">' +
            '</div>' +
            '<div class="gallery-photo-info">' +
                '<div class="gallery-photo-name">' + photo.name + '</div>' +
                '<div class="gallery-photo-description">' + photo.description + '</div>' +
            '</div>';
        this.getMinCol().appendChild(item);
        item.querySelector('.gallery-photo').style.height = parseInt(item.clientWidth / photo.aspect_ratio) + 'px';
    }).bind(this));
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