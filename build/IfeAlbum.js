(function (window) {

    // 由于是第三方库，我们使用严格模式，尽可能发现潜在问题
    'use strict';



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
        this.spinner = document.querySelector('.spinner');
        this.modal = new Modal();
        this.loading = false;
        this.source = '500px';
        this.page = 0;
        this.setLayout(2);
        this.load();
        window.addEventListener('scroll', this.scroll.bind(this));

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
        this.photos = [];
        var that = this;
        image.forEach(function(item, index, array){
            that.photos.push({image: {large: item, small: item}});
        });
        console.log(this.photos);
        this.layout.init();
    };



    /**
     * 获取相册所有图像对应的 DOM 元素
     * 可以不是 ，而是更外层的元素
     * @return {HTMLElement[]} 相册所有图像对应的 DOM 元素组成的数组
     */
    IfeAlbum.prototype.getImageDomElements = function() {
        
    };



    /**
     * 向相册添加图片
     * 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
     * @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     */
    IfeAlbum.prototype.addImage = function (image) {

    };



    /**
     * 移除相册中的图片
     * @param  {(HTMLElement|HTMLElement[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    IfeAlbum.prototype.removeImage = function (image) {

    };



    /**
     * 设置相册的布局
     * @param {number} layout 布局值，IfeAlbum.LAYOUT 中的值
     */
    IfeAlbum.prototype.setLayout = function (layout) {
        var that = this;
        switch(layout) {
            case 1:
                that.layout = new GalleryPuzzle('.gallery', that.photos);
                break;
            case 2:
                that.layout = new GalleryWaterfall('.gallery', 5);
                break;
            case 3:
                that.layout = new GalleryBarrel('.gallery');
                break;
        }
        this.layout.name = Object.keys(this.LAYOUT)[layout-1];
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
            console.error('...');
            return;
        }

        // 你的实现

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
        if (_target.className == 'gallery-image') {
            this.modal.show(_target.dataset.large, _target.clientWidth, _target.clientHeight);
        }
    }

    IfeAlbum.prototype.scroll = function () {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop + innerHeight >= document.body.clientHeight && !this.loading) {
            this.load();
        }
    }

    IfeAlbum.prototype.loaded = function (photos) {
        this.spinner.style.display = 'none';
        this.loading = false;
        console.log(photos);
        this.layout.append(photos);
    }

    IfeAlbum.prototype.load = function () {
        this.spinner.style.display = 'block';
        this.loading = true;
        getPhotos(this.page++, this.source).then(this.loaded.bind(this));
    }



    /************* 以上是本库提供的公有方法 *************/



    // 实例化
    if (typeof window.ifeAlbum === 'undefined') {
        // 只有当未初始化时才实例化
        window.ifeAlbum = new IfeAlbum();
    }

}(window));
