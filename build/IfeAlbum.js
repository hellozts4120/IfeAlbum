
    // 由于是第三方库，我们使用严格模式，尽可能发现潜在问题
    'use strict';
    
    
    /**
     * 拼图布局的类
     * 由于拼图，瀑布流，木桶布局相对独立，因此没有将其的相关事件加入IfeAlbum函数对象的原型链
     * 反之，将三种布局作为相对独立的函数对象，在初始化相册布局时调用
     * @param {string} selector  插入此布局的DOM结点地址
     */
    var GalleryPuzzle = function(selector) {
        this.target = document.querySelector(selector);
        this.photos = [];
    }
    
    //初始化拼图布局外层DOM结点
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
    
    /**
     * 向拼图布局添加图片
     * @param {string[]} photos  传入的图片url数组
     */
    GalleryPuzzle.prototype.append = function(photos) {
        this.photos = photos.slice(0, 6);
        this.init();
        this.setSize();
    }
    
    /**
     * 清除特定的某张或某几张图片
     * @param {string[]} image  需删除的图片url数组
     * @return {boolean} 是否成功删除所有指定图片
     */
    GalleryPuzzle.prototype.clear = function(image) {
        var isAll = true;
        var that = this;
        for (var i = 0; i < image.length; i++) {
            for (var j in that.photos) {
                if (that.photos[j] == image[i]) {
                    that.photos.splice(j, 1);
                    break;
                }
                if (j == that.photos.length - 1) isAll = false;
            }
        }
        this.append(that.photos);
        return isAll;
    }
    
    //清除拼图布局内所有图片
    GalleryPuzzle.prototype.clearAll = function() {
        this.photos = [];
        this.setSize();
    }
    
    //根据传入的图片数量确定拼图布局方式并渲染
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

    //一张图片时的拼图布局
    GalleryPuzzle.prototype.size1 = function() {
        return [
            {
                width: this.target.clientWidth,
                height: this.target.clientHeight
            }
        ];
    }

    //二张图片时的拼图布局
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

    //三张图片时的拼图布局
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

    //四张图片时的拼图布局
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

    //五张图片时的拼图布局
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

    //六张图片时的拼图布局
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
    
    /**
     * 瀑布流布局的类
     * @param {string} selector  插入此布局的DOM结点地址
     */
    var GalleryWaterfall = function (selector) {
        this.target = document.querySelector(selector);
        this.col = this.setCol();
        this.init();
    }

    //初始化瀑布流布局各列DOM结点并渲染
    GalleryWaterfall.prototype.init = function() {
        var width = this.target.clientWidth / this.col;
        var html = "";
        for (var i = 0; i < this.col; i++) {
            html += '<div class="gallery-column" style="width: ' + width + 'px"></div>';
        }
        this.target.innerHTML = html;
        this.columns = this.target.querySelectorAll('.gallery-column');
        this.photos = [];
    }

    /**
     * 根据屏幕宽度自适应设定瀑布流布局列数
     * 为了更好的体验，禁止用户自行设定列数
     * @return {number} 当前页面瀑布流布局列数
     */
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

    /**
     * 向瀑布流布局添加图片并渲染
     * @param {string[]} photos 传入的图片url数组
     */
    GalleryWaterfall.prototype.append = function(photos) {
        if (this.photos.length == 0) {
            this.photos = photos;
        }
        else {
            for (var i in photos) {
                this.photos.push(photos[i]);
            }
            for (var i = 0; i < this.columns.length; i++) {
                this.columns[i].innerHTML = "";
            }
        }
        this.photos.forEach((function(photo) {
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
    
    /**
     * 清除特定的某张或某几张图片
     * @param {string[]} image  需删除的图片url数组
     * @return {boolean} 是否成功删除所有指定图片
     */
    GalleryWaterfall.prototype.clear = function(image) {
        var isAll = true;
        var that = this;
        for (var i = 0; i < image.length; i++) {
            for (var j in that.photos) {
                if (that.photos[j] == image[i]) {
                    that.photos.splice(j, 1);
                    break;
                }
                if (j == that.photos.length - 1) isAll = false;
            }
        }
        var photoArray = this.photos;
        this.clearAll();
        this.append(photoArray);
        return isAll;
    }

    //清除瀑布流布局内所有图片
    GalleryWaterfall.prototype.clearAll = function() {
        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i].innerHTML = "";
        }
        this.photos = [];
    }

    /**
     * 获取当前高度最小的列
     * @return {number} 当前高度最小列
     */
    GalleryWaterfall.prototype.getMinCol = function() {
        var min = this.columns[0];
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].clientHeight < min.clientHeight) {
                min = this.columns[i];
            }
        }
        return min;
    }
    
    /**
     * 木桶布局的类
     * @param {string} selector  插入此布局的DOM结点地址
     */
    var GalleryBarrel = function (selector, minHeight, maxHeight) {
        this.minHeight = minHeight || 300;
        this.maxHeight = maxHeight || 1000;
        this.target = document.querySelector(selector);
        this.padding = 8;
        this.minAspectRatio = this.target.clientWidth / this.minHeight;
        this.maxAspectRatio = this.target.clientWidth / this.maxHeight;
        this.photos = [];
    }

    /**
     * 向木桶布局添加图片并渲染
     * @param {string[]} photos 传入的图片url数组
     */
    GalleryBarrel.prototype.append = function (photos) {
        var that = this;
        if (this.photos.length == 0) {
            this.photos = photos;
        }
        else {
            for (var i in photos) {
                this.photos.push(photos[i]);
            }
            document.querySelector(".gallery").innerHTML = "";
        }
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

    /**
     * 设定木桶布局每行的高度范围
     * @param {number} min 每列高度最小值
     * @param {number} max 每列高度最大值
     */
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
    
    /**
     * 设定木桶布局每行的图片数量范围
     * @param {number} min 每列图片数目最小值
     * @param {number} max 每列图片数目最大值
     */
    GalleryBarrel.prototype.setBin = function (min, max) {
        this.minNum = min;
        this.maxNum = max;
        document.querySelector(".gallery").innerHTML = "";
        this.append(this.photos);
    }

    /**
     * 清除特定的某张或某几张图片
     * @param {string[]} image  需删除的图片url数组
     * @return {boolean} 是否成功删除所有指定图片
     */
    GalleryBarrel.prototype.clear = function (image) {
        var isAll = true;
        var that = this;
        console.log(that.photos);
        for (var i = 0; i < image.length; i++) {
            for (var j in that.photos) {
                if (that.photos[j] == image[i]) {
                    that.photos.splice(j, 1);
                    break;
                }
                if (j == that.photos.length - 1) isAll = false;
            }
        }
        var photoArray = this.photos;
        this.clearAll();
        this.append(photoArray);
        return isAll;
    }
    
    //清除木桶布局内所有图片
    GalleryBarrel.prototype.clearAll = function () {
        var gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        this.photos = [];
    }
    
    /**
     * 获取当前布局每行高度及其中的图片
     * @param {string[]} photos  传入的图片url数组
     * @return {object} 每行高度及其中的图片的集合
     */
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
    
    var Modal = function () {
        var that = this;

        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.innerHTML =

            '<div class="modal-container"><img class="modal-image"></div>'

        addEvent(this.modal, 'click', function (event) {
            if (event.target == that.modal) {
                that.modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        this.container = this.modal.querySelector('.modal-container');

        this.image = this.modal.querySelector('.modal-image')

        document.body.appendChild(this.modal);
    }

    Modal.prototype.show = function (url, width, height) {
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('active');

        if (this.image.src != url) {
            var imageAspectRatio = width / height;
            var windowAspectRatio = innerWidth / innerHeight;

            if (windowAspectRatio > imageAspectRatio) {
                this.container.style.width = parseInt(innerHeight * imageAspectRatio) + 'px';
            } 
            else {
                this.container.style.width = innerWidth + 'px';
                this.container.style.marginTop = (innerHeight - innerWidth / imageAspectRatio) / 2 + 'px';
            }

            this.image.src = url;
      }
    }
    
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

    function imgIsLoad(urlArr, fn) {
        var imgList = [], n = 0;
        for(var i = 0, m = urlArr.length; i < m; i++){
            imgList.push(new Image());
            imgList[i].index = i;
            imgList[i].src = urlArr[i];
            imgList[i].onload = imgList[i].onerror = function() {
                if(fn) {
                    this.serial = n++;
                    if(n === urlArr.length) fn.call(this, true);
                    else fn.call(this, false);          
                }   
            }
        }
    }


    /**
     * 
     * @param {string} selector  插入布局的DOM结点地址
     */
    function IfeAlbum(selector) {

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
        this.selector = selector;
        
    }

    // 私有变量可以写在这里
    // var xxx = ...
    

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
                that.layout.clearAll();
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
        
        if (this.getLayout == "PUZZLE") {
            
        }
        else this.layout.append(image);
        
        //TODO
        
    };



    /**
     * 移除相册中的图片
     * @param  {(string|string[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    IfeAlbum.prototype.removeImage = function (image) {
        
        if (typeof image === 'string') {
            // 包装成数组处理
            this.removeImage([image]);
            return;
        }
        
        return this.layout.clear(image);

    };



    /**
     * 设置相册的布局
     * @param {number} layout 布局值，IfeAlbum.LAYOUT 中的值
     */
    IfeAlbum.prototype.setLayout = function (layout) {
        var that = this;
        switch(layout) {
            case 1:
                that.layout = new GalleryPuzzle(that.selector);
                break;
            case 2:
                that.layout = new GalleryWaterfall(that.selector);
                break;
            case 3:
                that.layout = new GalleryBarrel(that.selector);
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
        }
        if (this.getLayout() == "BARREL") {
            var images = document.querySelectorAll('.gallery-item-wrapper');
        }
        for (var i = 0; i < images.length; i++) {
            images[i].style.borderTop = (y / 2) + 'px solid #f0f0f0';
            images[i].style.borderBottom = (y / 2) + 'px solid #f0f0f0';
            images[i].style.borderLeft = (x / 2) + 'px solid #f0f0f0';
            images[i].style.borderRight = (x / 2) + 'px solid #f0f0f0';
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
     * 设置木桶模式每行图片数的上下限(Not actually implement...)
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
     * 获取木桶模式每行图片数的上限(Not actually implement...)
     * @return {number} 最多图片数（含）
     */
    IfeAlbum.prototype.getBarrelBinMax = function () {
        return this.layout.maxNum;
    };



    /**
     * 获取木桶模式每行图片数的下限(Not actually implement...)
     * @return {number} 最少图片数（含）
     */
    IfeAlbum.prototype.getBarrelBinMin = function () {
        return this.layout.minNum;
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
     * @return {number} 最大高度
     */
    IfeAlbum.prototype.getBarrelHeightMax = function () {
        return this.layout.minHeight;
    };



    /**
     * 获取木桶模式每行高度的下限
     * @return {number} 最小高度
     */
    IfeAlbum.prototype.getBarrelHeightMin = function () {
        return this.layout.maxHeight;
    };



    // 你想增加的其他接口
    
    
    /**
     * 每张图片的点击事件
     * 当启用图片点击全屏时，点击图片可将图片放大至全屏模式
     * @param {object} event  鼠标点击的对象
     */
    IfeAlbum.prototype.click = function (event) {
        console.log(typeof event)
        var _target = event.target;
        if ((_target.className == 'gallery-image') || (this.getLayout() == "PUZZLE" && _target.className == "gallery-item")) {
            this.modal.show(_target.src || _target.style.backgroundImage.split("\"")[1], _target.clientWidth, _target.clientHeight);
        }
    }



    /************* 以上是本库提供的公有方法 *************/



    // 实例化
    if (typeof window.ifeAlbum === 'undefined') {
        // 只有当未初始化时才实例化
        window.ifeAlbum = new IfeAlbum('.gallery');
    }

