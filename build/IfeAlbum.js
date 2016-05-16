(function (window) {

    // 由于是第三方库，我们使用严格模式，尽可能发现潜在问题
    'use strict';
    
    
    var GalleryPuzzle = function(src) {
        this.target = document.querySelector(src);
        this.photos = [];
    }
    
    GalleryPuzzle.prototype.init = function () {
        this.target.classList.add('gallery-' + this.photos.length);
        this.target.innerHTML = this.photos.reduce(function(html, item) {
            html += 
                '<div class="gallery-item" style="background-image: url(' + item + ')">' +
                '</div>'
            return html;    
        }, '');
        var that = this;
    }
    
    GalleryPuzzle.prototype.append = function(photos) {
        this.photos = photos.slice(0, 6);
        this.init();
        this.setSize();
    }
    
    GalleryPuzzle.prototype.clear = function() {
        this.photos = [];
        this.setSize();
    }

    GalleryPuzzle.prototype.setSize = function() {
        if (this.photos.length == 0) {
            return;
        }
        
        var item = this.target.querySelectorAll(".gallery-item");
        this["size" + this.photos.length]().forEach(function(size, i) {
            item[i].style.width = size.width + 'px';
            item[i].style.height = size.height + 'px';
            if (size.right) {
                item[i].style.float = "right";
            }
        })
    }

    GalleryPuzzle.prototype.size1 = function() {
        return [
            {
                width: this.target.clientWidth,
                height: this.target.clientHeight
            }
        ];
    }

    GalleryPuzzle.prototype.size2 = function() {
        var width = this.target.clientWidth * 2 / 3
        
        return [
            {
              width: width,
              height: this.target.clientHeight
            },
            
            {
              width: width,
              height: this.target.clientHeight
            }
        ];
    }

    GalleryPuzzle.prototype.size3 = function() {
        var length = this.target.clientHeight / 2;
        return [
            {
                width: this.target.clientWidth - length,
                height: this.target.clientHeight
            },
            
            {
                width: length,
                height: length
            },
            
            {
                width: length,
                height: length
            }
        ];
    }

    GalleryPuzzle.prototype.size4 = function() {
        var width = this.target.clientWidth / 2;
        var height = this.target.clientHeight / 2;
        return [
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            }
        ];
    }

    GalleryPuzzle.prototype.size5 = function() {
        var width = this.target.clientWidth / 3;
        var height = this.target.clientHeight / 3;
        var returnObj = [
            {
                width: width * 2,
                height: height * 2
            },
            
            {
                right: true,
                width: width,
                height: width
            },
            
            {
                right: true,
                width: width,
                height: this.target.clientHeight - width
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            }
        ];
        if (this.target.clientWidth > this.target.clientHeight * 2) {
            returnObj.push(returnObj.splice(2, 1)[0])
        }
      
        return returnObj;
    }

    GalleryPuzzle.prototype.size6 = function() {
        var width = this.target.clientWidth / 3;
        var height = this.target.clientHeight / 3;
        return [
            {
                width: width * 2,
                height: height * 2
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            },
            
            {
                width: width,
                height: height
            }
        ];
    }
    
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
    
    var GalleryBarrel = function (selector, minHeight, maxHeight) {
        this.minHeight = minHeight || 300;
        this.maxHeight = maxHeight || 1000;
        this.target = document.querySelector(selector);
        this.padding = 8;
        this.minAspectRatio = this.target.clientWidth / this.minHeight;
        this.maxAspectRatio = this.target.clientWidth / this.maxHeight;
        this.photos = [];
    }

    GalleryBarrel.prototype.append = function (photos) {
        var that = this;
        if (this.photos.length == 0) {
            this.photos = photos;
        }
        else this.photos.concat(photos);
        this.getRows(that.photos).forEach(function (row) {
            var totalWidth = that.target.clientWidth - (row.photos.length - 1) * that.padding;
            var _row = document.createElement("div");
            _row.className = 'gallery-row';
            var curHeight = parseInt(totalWidth / row.aspectRatio);
            if (curHeight > that.maxHeight) {
                curHeight = that.maxHeight;
            }
            _row.style.height = curHeight + 'px';
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
        document.querySelector(".gallery").innerHTML = "";
        this.append(this.photos);
    }
    
    GalleryBarrel.prototype.setBin = function (min, max) {
        this.minNum = min;
        this.maxNum = max;
        document.querySelector(".gallery").innerHTML = "";
        this.append(this.photos);
    }

    GalleryBarrel.prototype.clear = function () {
        var gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        this.photos = [];
    }

    GalleryBarrel.prototype.getRows = function (photos) {
        var aspectRatio = 0;
        var rows = [];
        var _photos = [];
        
        for (var i = 0; i < photos.length; i++) {
            _photos.push(photos[i]);
            var img = new Image();
            img.src = photos[i];
            aspectRatio += img.naturalWidth / img.naturalHeight;

            if (aspectRatio > this.minAspectRatio) {

                rows.push({
                    aspectRatio: aspectRatio,
                    photos: _photos
                })
                _photos = [];
                aspectRatio = 0;
            }
        }
        rows.push({
            aspectRatio: aspectRatio,
            photos: _photos
        })
        

        //this.photos = _photos;
        return rows;
    }


    function IfeAlbum() {

        // 布局的枚举类型
        this.LAYOUT = {
            PUZZLE: 1,    // 拼图布局
            WATERFALL: 2, // 瀑布布局
            BARREL: 3     // 木桶布局
        };

        // 公有变量可以写在这里
        // this.xxx = ...
        
        this.isFullScreenEnabled = false;
        this.modal = new Modal();
        this.setLayout(3);
        this.setImage(["../src/img/1.png", "../src/img/2.png", "../src/img/3.png", "../src/img/4.png", "../src/img/5.png", "../src/img/6.png", "../src/img/7.png"])

    }

    // 私有变量可以写在这里
    // var xxx = ...
    
    /*var layoutFunction = {
        1: GalleryPuzzle,
        2: GalleryWaterfall,
        3: GalleryBarrel
    }*/



    /************* 以下是本库提供的公有方法 *************/



    /**
     * 初始化并设置相册
     * 当相册原本包含图片时，该方法会替换原有图片
     * @param {(string|string[])} image  一张图片的 URL 或多张图片 URL 组成的数组
     * @param {object}            option 配置项
     */
    IfeAlbum.prototype.setImage = function (image, option) {
        
        if (typeof image === 'string') {
            // 包装成数组处理
            this.setImage([image]);
            return;
        }

        // 你的实现
        var that = this;
        imgIsLoad(image, function (isLoadOver) {
            if (isLoadOver) {
                that.photos = image;
                that.layout.clear();
                that.layout.append(image);
            }
        })
        
    };



    /**
     * 获取相册所有图像对应的 DOM 元素
     * 可以不是 ，而是更外层的元素
     * @return {HTMLElement[]} 相册所有图像对应的 DOM 元素组成的数组
     */
    IfeAlbum.prototype.getImageDomElements = function() {
        return document.querySelectorAll('.gallery-image');
    };



    /**
     * 向相册添加图片
     * 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
     * @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     */
    IfeAlbum.prototype.addImage = function (image) {
        if (typeof image === 'string') {
            // 包装成数组处理
            this.addImage([image]);
            return;
        }
        
        this.photos.concat(image);
        this.layout.append(image);
        
        //TODO
        
    };



    /**
     * 移除相册中的图片
     * @param  {(HTMLElement|HTMLElement[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    IfeAlbum.prototype.removeImage = function (image) {
        return this.layout.clear(image);
        
        //TODO
    };



    /**
     * 设置相册的布局
     * @param {number} layout 布局值，IfeAlbum.LAYOUT 中的值
     */
    IfeAlbum.prototype.setLayout = function (layout) {
        var that = this;
        switch(layout) {
            case 1:
                that.layout = new GalleryPuzzle('.gallery');
                break;
            case 2:
                that.layout = new GalleryWaterfall('.gallery');
                break;
            case 3:
                that.layout = new GalleryBarrel('.gallery');
                break;
        }
        this.layout.name = Object.keys(this.LAYOUT)[layout - 1];
    };



    /**
     * 获取相册的布局
     * @return {number} 布局枚举类型的值
     */
    IfeAlbum.prototype.getLayout = function() {
        return this.layout.name;
    };



    /**
     * 设置图片之间的间距
     * 注意这个值仅代表图片间的间距，不应直接用于图片的 margin 属性，如左上角图的左边和上边应该紧贴相册的左边和上边
     * 相册本身的 padding 始终是 0，用户想修改相册外框的空白需要自己设置相框元素的 padding
     * @param {number}  x  图片之间的横向间距
     * @param {number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
     */
    IfeAlbum.prototype.setGutter = function (x, y) {
        if (x == undefined) {
            console.error("x must be greater than 0!");
            return;
        }
        if (this.getLayout() == "PUZZLE") {
            console.error("拼图布局，为获得良好体验，不能设置图片间距！");
            return;
        }
        y = y || x;
        this.gutter = [x, y];
        if (this.getLayout() == "WATERFALL") {
            var images = document.querySelectorAll('.gallery-item');
            console.log(images);
            for (var i = 0; i < images.length; i++) {
                images[i].style.borderTop = (y / 2) + 'px solid #f0f0f0';
                images[i].style.borderBottom = (y / 2) + 'px solid #f0f0f0';
                images[i].style.borderLeft = (x / 2) + 'px solid #f0f0f0';
                images[i].style.borderRight = (x / 2) + 'px solid #f0f0f0';
            }
        }
        if (this.getLayout() == "BARREL") {
            var images = document.querySelectorAll('.gallery-item-wrapper');
            console.log(images);
            for (var i = 0; i < images.length; i++) {
                console.log(images[i]);
                images[i].style.marginTop = (y / 2) + 'px solid #f0f0f0';
                images[i].style.marginBottom = (y / 2) + 'px solid #f0f0f0';
                images[i].style.marginLeft = (x / 2) + 'px solid #f0f0f0';
                images[i].style.marginRight = (x / 2) + 'px solid #f0f0f0';
            }
        }
        
    };



    /**
     * 允许点击图片时全屏浏览图片
     */
    IfeAlbum.prototype.enableFullscreen = function () {
        this.isFullScreenEnabled = true;
        document.addEventListener('click', this.click.bind(this));
    };



    /**
     * 禁止点击图片时全屏浏览图片
     */
    IfeAlbum.prototype.disableFullscreen = function () {
        this.isFullScreenEnabled = false;
        document.removeEventListener('click', this.click.bind(this));
    };



    /**
     * 获取点击图片时全屏浏览图片是否被允许
     * @return {boolean} 是否允许全屏浏览
     */
    IfeAlbum.prototype.isFullscreenEnabled = function () {
        return this.isFullScreenEnabled;
    };


    /**
     * 设置木桶模式每行图片数的上下限
     * @param {number} min 最少图片数（含）
     * @param {number} max 最多图片数（含）
     */
    IfeAlbum.prototype.setBarrelBin = function (min, max) {

        // 注意异常情况的处理，做一个健壮的库
        if (min === undefined || max === undefined || min > max) {
            console.error('error occurs!');
            return;
        }

        // 你的实现
        if (this.getLayout() != "BARREL") {
            console.error("Not Barrel now!");
            return;
        }
        
        this.layout.setBin(min, max);

    };



    /**
     * 获取木桶模式每行图片数的上限
     * @return {number} 最多图片数（含）
     */
    IfeAlbum.prototype.getBarrelBinMax = function () {

    };



    /**
     * 获取木桶模式每行图片数的下限
     * @return {number} 最少图片数（含）
     */
    IfeAlbum.prototype.getBarrelBinMin = function () {

    };



    /**
     * 设置木桶模式每行高度的上下限，单位像素
     * @param {number} min 最小高度
     * @param {number} max 最大高度
     */
    IfeAlbum.prototype.setBarrelHeight = function (min, max) {
        if (this.getLayout() != "BARREL") {
            console.error("Not Barrel now!");
            return;
        }
        if (max < min) {
            console.error("max height must be greater or same as the min height!");
        }
        this.layout.setHeight(min, max);
    };



    /**
     * 获取木桶模式每行高度的上限
     * @return {number} 最多图片数（含）
     */
    IfeAlbum.prototype.getBarrelHeightMax = function () {
        
    };



    /**
     * 获取木桶模式每行高度的下限
     * @return {number} 最少图片数（含）
     */
    IfeAlbum.prototype.getBarrelHeightMin = function () {
        
    };



    // 你想增加的其他接口
    
    
    IfeAlbum.prototype.click = function (event) {
        var _target = event.target;
        if ((_target.className == 'gallery-image') || (this.getLayout() == "PUZZLE" && _target.className == "gallery-item")) {
            this.modal.show(_target.src || _target.style.backgroundImage.split("\"")[1], _target.clientWidth, _target.clientHeight);
        }
    }



    /************* 以上是本库提供的公有方法 *************/



    // 实例化
    if (typeof window.ifeAlbum === 'undefined') {
        // 只有当未初始化时才实例化
        window.ifeAlbum = new IfeAlbum();
    }

}(window));

ifeAlbum.enableFullscreen();
//ifeAlbum.setGutter(10,10);