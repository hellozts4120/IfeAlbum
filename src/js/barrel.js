var GalleryBarrel = function (selector, minHeight) {
    this.minHeight = minHeight || 300;
    this.maxHeight = maxHeight || 1000;
    this.target = document.querySelector(selector);
    this.padding = 8;
    this.minAspectRatio = this.target.clientWidth / this.minHeight;
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
                    '<img ' + 
                    'class="gallery-image" ' + 
                    'src="' + photo + '">' +
                '</div>' +
            '</div>'
            return html;
        }, '')
        that.target.appendChild(_row);
    });    
}

GalleryBarrel.prototype.setHeight = function (min, max) {
    min = min || 0;
    max = max || 0;
    if (min > 0) {
        this.minHeight = min;
        this.minAspectRatio = this.target.clientWidth / this.minHeight;
    }
    if (max > 0) {
        this.maxHeight = max;
    }
}

GalleryBarrel.prototype.clear = function () {
    var gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    this.photos = [];
}

GalleryBarrel.prototype.getRows = function (photos) {
    photos = this.photos.concat(photos);
    var aspectRatio = 0;
    var rows = [];
    var _photos = [];
    
    for (var i = 0; i < photos.length; i++) {
        _photos.push(photos[i]);
        var img = new Image();
        img.src = photos[i];
        document.querySelector(".gallery1").appendChild(img);
        img = document.querySelector(".gallery1").childNodes[i];
        console.log(img.naturalWidth);
        
        //TODO
        
        aspectRatio += parseFloat(img.naturalWidth / img.naturalHeight); 
        if (aspectRatio > this.minAspectRatio) {
            rows.push({
                aspectRatio: aspectRatio,
                photos: _photos
            })
            _photos = [];
            aspectRatio = 0;
        }
        
        console.log(aspectRatio)

        
    }

    this.photos = _photos;
    console.log(this.photos);
    return rows;
}