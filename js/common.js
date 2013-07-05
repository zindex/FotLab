$(function(){
    InitCommonFeatures();
    var main = new mainJS();
});

function InitCommonFeatures(){
    // vertical + horizontal images align
	$('.b-img_align-middle img').load(function(){
        $(this).css({
            'top': '50%',
            'left': '50%',
            'margin-left': -($(this).width()/2),
            'margin-top': -($(this).height()/2)
        })
    });

    //fixed sidebar
    if(!$('#jsFlyBox').length == 0 && $('#jsFlyBox').height() < $('.cnt__main').height()){
        var elem = $('#jsFlyBox');

        $(window).scroll(function(e) {
            elem.removeClass('jsFlyBox-bottom jsFlyBox-top');
            GetPosition();
            if(elem.height() < $('.cnt__main').height()){
                if ($(window).scrollTop() > posTop){
                    elem.addClass('jsFlyBox-top');
                    elem.removeClass('jsFlyBox-bottom');
                }
                else {
                    elem.removeClass('jsFlyBox-top jsFlyBox-bottom');
                }

                if($(window).scrollTop() > posBottom){
                    elem.addClass('jsFlyBox-bottom');
                }
            }
        });
        $(window).resize(function(){
            GetPosition();
        });

        function GetPosition(){
            posTop = elem.offset().top -47; //position to top - top padding
            posBottom = posTop + $('.cnt__main').height() - elem.height() + 31; // max fly position (+ margin&padding)
        }
    }

    //add to cart animation
    $('.jsToCartButton').click(function(e){
        var cart = $('.jsCart');
        if(cart.is(':hidden')){
            cart.show();
            var height = cart.height();
            cart.css({'height':'0px'});
            cart.animate({'height':height+'px'},500,function(){
                cart.css({'height':'auto'});
            });

        }
        $("html:not(:animated),body:not(:animated)").animate({ scrollTop: cart.position().top }, 500);

        e.preventDefault();
    });

    //mode switcher
    $('.b-mode__item').click(function(){
        $(this).siblings('.b-mode__item').removeClass('b-mode__item_active');
        $(this).addClass('b-mode__item_active');
    });

    //show field for promo code
    $('.jsPromoButton').click(function(e){
        $(this).hide().next('.btn_type_white').show();

        e.preventDefault();
    });
}


var mainJS = function(){
    var scope = this;
    $(function() {
        scope.initGallery();
        scope.initSlider();
        scope.initPopup();
        scope.initPopupClose();
    });

    var jcrop_api;

    this.initGallery = function(){
        if($('#gallery').length !== 0){
            var galleryItemWidth = 229,
                itemToScroll = 5;

            $("#gallery").after('<div id="gallery2" />').next().html($("#gallery").html());
            $("#gallery .gallery__img:odd").remove();
            $("#gallery2 .gallery__img:even").remove();

            $("#gallery").carouFredSel({
                synchronise: "#gallery2",
                scroll: itemToScroll,
                auto: false,
                width: '100%',
                prev: ".gallery__left",
                next: ".gallery__right",
                items: {
                    width: galleryItemWidth,
                    visible: {
                        min: 3,
                        max: 5
                    }
                }
            });
            $("#gallery2").carouFredSel({
                auto: false,
                width: '100%',
                items: {
                    width: galleryItemWidth,
                    visible: {
                        min: 3,
                        max: 5
                    }
                }
            });

            function galleryItemsScrolled(){
                if($(window).width() < 1286 && $(window).width() > 1113){
                    $("#gallery").trigger("configuration", {
                        scroll: 4
                    });
                }
                if($(window).width() < 1113){
                    $("#gallery").trigger("configuration", {
                        scroll: 3
                    });
                }
                if($(window).width() > 1286){
                    $("#gallery").trigger("configuration", {
                        scroll: itemToScroll
                    });
                }
            }

            galleryItemsScrolled();
            $(window).resize(function(){
                galleryItemsScrolled();
            });
        }
    };
    this.initSlider = function(currentSlideActive){
        var slider = $('#slider'),
            oneSlide = $('.slider__slide'),
            leftMod = 0,
            current = 0,
            locked = false,
            bulletsContainer = $('#bullets'),
            bullet = '<a href="#" class="bullets__item"></a>';

        //align slider-text
        $('.slider-info').css('margin-top', -$('.slider-info').height()/2);

        if (currentSlideActive){
            current = currentSlideActive
        }

        createBullets();
        onResize();
        $(window).resize(function() {
            onResize();
        });
        $('.bullets__item',bulletsContainer).click(function(e){
            var index = $(this).index();
            if(index !== current || locked == true){
                locked = true;
                if(($.browser.msie) && (/MSIE .+Win/.test(navigator.userAgent))){
                    oneSlide.animate({
                        left: '-'+leftMod*index+'px'
                    },1000,'easeInOutQuart',function(){
                        locked = false;
                    });
                } else {
                    slider.addClass('slider_animated').css({
                        '-webkit-transform':'translate('+'-'+(leftMod*index)+'px, 0px)',
                        '-moz-transform':'translate('+'-'+(leftMod*index)+'px, 0px)',
                        '-o-transform':'translate('+'-'+(leftMod*index)+'px, 0px)',
                        '-ms-transform':'translate('+'-'+(leftMod*index)+'px, 0px)',
                        'transform':'translate('+'-'+(leftMod*index)+'px, 0px)'
                    },function(){
                        locked = false;
                    });
                }

                $(this).siblings('.bullets__item').removeClass('bullets__item_active');
                $(this).addClass('bullets__item_active');
                current = $(this).index();
                slider.remove('slider_animated');
            }
            e.preventDefault();
        });

        function onResize(){
            leftMod = $(document).width();
            slider.removeClass('slider_animated');
            slider.css({
                'width':(oneSlide.index()+ 1)*leftMod,
                '-webkit-transform':'translate('+'-'+(current*leftMod)+'px, 0px)',
                '-moz-transform':'translate('+'-'+(current*leftMod)+'px, 0px)',
                '-o-transform':'translate('+'-'+(current*leftMod)+'px, 0px)',
                '-ms-transform':'translate('+'-'+(current*leftMod)+'px, 0px)',
                'transform':'translate('+'-'+(current*leftMod)+'px, 0px)'
            });
            oneSlide.css('width',leftMod);
        }
        function createBullets(){
            for(var i=0; i<oneSlide.size();i++){
                bulletsContainer.append(bullet);
                $('.bullets__item',bulletsContainer).eq(current).addClass('bullets__item_active');
            }
        }
    };
    this.initPopup = function(){
        $('.jsShowPopup').click(function(e){
            //popup appear and vertical align
            var popup = $('.b-popup'),
                popupData = $('.b-popup__data',popup),
                popupBg = $('.b-popup__bg',popup),
                popupCrop = $('.b-crop',popupData),
                loader = $('.b-loader-i',popupData),
                imageSrc = $(this).attr('href'),
                popupImg = $('img',popupData),
                imgHeight,
                imgWidth,
                a = new Image();

            var loaded = false,
                wait,
                fullyLoaded = false;

            popupData.hide();
            popupBg.hide();
            popupImg.hide();

            popup.show();
            popupData.show();
            loader.show();
            popupBg.show();

            popupCrop.css({
                'height': 'auto',
                'width': 'auto'
            });
            popupData.css({
                'margin-top': '-58px',
                'margin-left': '-212px',
                'width': 'auto'
            });

            a.addEventListener('load', function () {
                fullyLoaded = true;
                $('.jcrop-holder').hide();
                $('.jcrop-holder').fadeIn(500);
            }, true);

            a.src = imageSrc;
            wait = setInterval(function () {
                if (a.width != 0){
                    //console.log(a.width, 'x', a.height);
                    loaded = true;
                    clearInterval(wait);

                    popupImg.attr('src', imageSrc);
                    imgHeight = a.height;
                    imgWidth = a.width;

                    //setting max and min width/height
                    var prop = imgHeight / imgWidth;
                    //console.log(prop);

                    if ( prop < 1){
                        imgWidth = 750;
                        imgHeight = imgWidth*prop;
                    } else {
                        imgHeight = 750;
                        imgWidth = imgHeight/prop;
                    }

                    popupCrop.animate({
                        'height': imgHeight,
                        'width': imgWidth
                    },{ queue:false, duration:300});

                    popupData.animate({
                        'margin-top': -(imgHeight+117)/2,
                        'margin-left': -(imgWidth+24)/2,
                        'width': imgWidth+24+'px'
                    }, {
                        queue:false,
                        duration:300,
                        complete: function(){
                            //loader.hide();

                            //
                            // init other functions here
                            //
                            $('#crop').Jcrop({
                                boxWidth: imgWidth,
                                boxHeight: imgHeight,
                                minSize: [180,180],
                                setSelect:   [ 0, 0, 180, 180 ],
                                opacity:.6,
                                aspectRatio: 1
                            },function(){
                                jcrop_api = this;
                            });


                            //initOne
                            $('#crop-one').click(function(e){
                                jcrop_api.destroy();
                                jcrop_api.enable();

                                $('#crop').Jcrop({
                                    boxWidth: imgWidth,
                                    boxHeight: imgHeight,
                                    minSize: [180,180],
                                    setSelect:   [ 0, 0, 180, 180 ],
                                    opacity:.6,
                                    aspectRatio: 1
                                },function(){
                                    jcrop_api = this;
                                });
                                return false;
                            });

                            //init grid
                            $('#crop-grid').click(function(e){
                                jcrop_api.destroy();
                                jcrop_api.enable();
                                $('#crop').Jcrop({
                                    boxWidth: imgWidth,
                                    boxHeight: imgHeight,
                                    minSize: [180,270],
                                    setSelect:   [ 0, 0, 180, 180 ],
                                    opacity:.6,
                                    aspectRatio: 3/2,
                                    onSelect: function(){
                                        var cropGrid = $('#crop').parents('.b-crop').find('.jcrop-tracker').eq(0);
                                        cropGrid.siblings('.b-crop__col1, .b-crop__col2, .b-crop__row').remove();
                                        cropGrid.after('<div class="b-crop__col1"></div><div class="b-crop__col2"></div><div class="b-crop__row"></div>');
                                    }
                                },function(){
                                    jcrop_api = this;
                                });

                                return false;
                            });
                        }
                    });
                }
            }, 0);

            e.preventDefault();
        });
    };
    this.initPopupClose = function(){
        //popup close
        $('.b-popup__bg').click(function(){
            $(this).parents('.b-popup').hide();
            jcrop_api.destroy();
            $('.jcrop-holder').remove();
        });
    };
};


