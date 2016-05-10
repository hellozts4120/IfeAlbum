var GalleryBarrel = function (selector, minHeight) {
    minHeight = minHeight || 300
    this.target = document.querySelector(selector);
    this.padding = 8;
    this.minAspectRatio = this.target.clientWidth / minHeight;
    this.photos = [];
}

GalleryBarrel.prototype.append = function (photos) {
    var that = this;
    this.getRows(photos).forEach(function (row) {
        var totalWidth = that.target.clientWidth - (row.photos.length - 1) * that.padding;
        var _row = document.createElement("div");
        _row.className = 'gallery-row';
        _row.style.height = parseInt(totalWidth / row.aspectRatio) + 'px';
        _row.innerHTML = row.photos.reduce(function (html, photo) {
            html +=
            '<div class="gallery-item-wrapper">' +
                '<div class="gallery-item">' +
                    '<img ' + 'title="' + photo.name + '" ' + 
                    'class="gallery-image" data-large="' + photo.image.large + '" ' + 
                    'src="' + photo.image.small + '">' +
                '</div>' +
            '</div>'
            return html;
        }, '')
        that.target.appendChild(_row);
    });    
}

GalleryBarrel.prototype.getRows = function (photos) {
    photos = this.photos.concat(photos);
    var aspectRatio = 0;
    var rows = [];
    var _photos = [];
    
    for (var i = 0; i < photos.length; i += 1) {
        _photos.push(photos[i]);
        aspectRatio += photos[i].aspect_ratio;

        if (aspectRatio > this.minAspectRatio) {
            rows.push({
                aspectRatio: aspectRatio,
                photos: _photos
            })
            _photos = [];
            aspectRatio = 0;
        }
    }

    this.photos = _photos;
    return rows;
}

