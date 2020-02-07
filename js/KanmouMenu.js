$().ready(function() {
    /**
     * [pluginName description]
     * @type {String}
     */
    var pluginName = "KanmouMenu";
    var defaults = {
        speed: 300,
        showDelay: 0,
        hideDelay: 0,
        singleOpen: true,
        clickEffect: true
    };
    /**
     * [Plugin description]
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({},
        defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init()
    };

            
    /**
     * [init description]
     * @param  {[type]} )  init    [封装函数，初始化]
     * @param  {[type]} clickMenu  [菜单点击事件]
     * @return {[type]}            [description]
     */
    $.extend(Plugin.prototype, {init: function() {
        // 菜单点击事件
        this.clickMenu();
        // 子菜单标志
        this.submenuSign();        
        //菜单点击效应
        if (defaults.clickEffect) {
            this.clickMenuEffect();
        }
        // 创建菜单搜索表单
        this.menuSearch($("#form"), $("#nav-list"));
        
    },
        // 菜单点击事件
        /**
         * [clickMenu description]
         * @return {[type]} [description]
         */
        clickMenu: function() {
            $(this.element).children("ul").find("li").bind("click touchstart",function(e) {                
                e.stopPropagation();
                e.preventDefault();
                if ($(this).children(".submenu").length > 0) {
                    if ($(this).children(".submenu").css("display") == "none") {
                        $(this).children(".submenu").delay(defaults.showDelay).slideDown(defaults.speed);
                        $(this).children(".submenu").siblings("a").addClass("submenu-signs");
                        if (defaults.singleOpen) {
                            $(this).siblings().children(".submenu").slideUp(defaults.speed);
                            $(this).siblings().children(".submenu").siblings("a").removeClass("submenu-signs")
                        }
                        return false
                    } else {
                        // 当前菜单的子菜单展开，再点击当前菜单则隐藏子菜单
                        $(this).children(".submenu").delay(defaults.hideDelay).slideUp(defaults.speed);
                    }
                    if ($(this).children(".submenu").siblings("a").hasClass("submenu-signs")) {
                        $(this).children(".submenu").siblings("a").removeClass("submenu-signs");
                    }
                }
                window.location.href = $(this).children("a").attr("href")
            })
        },
        /**
         * [submenuSign description]
         * @return {[type]} [description]
         */
        submenuSign: function() {
            // 如果当前菜单下存在子菜单
            if ($(this.element).find(".submenu").length > 0) {
                // 当前菜单添加子菜单标志
                $(this.element).find(".submenu").siblings("a").append("<span class='submenu-sign'>+</span>")
            }
        },
        // 菜单点击效应（动画）
        /**
         * [clickMenuEffect description]
         * @return {[type]} [description]
         */
        clickMenuEffect: function() {
            var ink, d, x, y;
            $(this.element).find("a").bind("click touchstart",
            function(e) {
                $(".ink").remove();
                if ($(this).children(".ink").length === 0) {
                    $(this).prepend("<span class='ink'></span>")
                }
                ink = $(this).find(".ink");
                ink.removeClass("animate-ink");
                if (!ink.height() && !ink.width()) {
                    d = Math.max($(this).outerWidth(), $(this).outerHeight());
                    ink.css({
                        height: d,
                        width: d
                    })
                }
                x = e.pageX - $(this).offset().left - ink.width() / 2;
                y = e.pageY - $(this).offset().top - ink.height() / 2;
                ink.css({
                    top: y + 'px',
                    left: x + 'px'
                }).addClass("animate-ink")
            })
        },
        /**
         * [menuSearch 菜单搜索]
         * @param  {[type]} header [头部]
         * @param  {[type]} list   [列表]
         * @return {[type]}        [description]
         */
        menuSearch: function(header, list) {
            var form = $("<form>").attr({
                "class":"filterform",
                action:"#"
            }), input = $("<input>").attr({
                "class":"menu-search",
                type:"text",
                "placeholder":"输入关键词搜索",
            });
            $(form).append(input).appendTo(header);
            $(input).change(function() {
                var filter = $(this).val();
                if (filter) {
                    $matches = $(list).find("a:Contains(" + filter + ")").parent();
                    $("li", list).not($matches).slideUp();
                    $matches.slideDown();
                } else {
                    $(list).find("li").slideDown();
                }
                return false;
            }).keyup(function() {
                $(this).change();
            });
        }
    });
    /**
     * [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options))
            }
        });
        return this
    }
    // 定义伪类选择器(菜单)
    /**
     * [Contains description]
     * @param {[type]} a [description]
     * @param {[type]} i [description]
     * @param {[type]} m [description]
     */
    $.expr[":"].Contains = function(a, i, m) {
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
    //绑定看某菜单插件运行
    $("#KanmouMenu").KanmouMenu();
})