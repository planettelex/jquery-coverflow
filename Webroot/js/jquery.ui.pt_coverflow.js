typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function ($) {
    $.widget('pt.coverflow', {
        /* Begin Widget Overrides */

        widgetEventPrefix: 'pt.coverflow',

        options: {
            width: null,
            height: null,
            selectedIndex: 0,
            autoplay: {
                enabled: false,
                interval: 5, 		    // seconds between covers
                pauseOnMouseenter: true,
                playsPerCategory: 2
            },
            categories: {
                enabled: true,
                defaultCategory: "Unknown",
                selectedCategory: null
            },
            cover: {
                angle: 12, 			    // degrees
                height: 300,
                width: 300,
                animation: {
                    perspective: {
                        duration: 80,   // milliseconds
                        inner: 120		// percentage of duration
                    }
                },
                background: {
                    size: 90			// percentage of original image
                },
                overlap: {
                    inner: 20, 	        // percentage of overlap
                    outer: 80			// percentage of overlap
                },
                perspective: {
                    enabled: true
                },
                reflection: {
                    enabled: true,
                    initialOpacity: 50, // percentage 0(transparent) <=> 100(opaque)
                    length: 80			// percentage of original image
                },
                title: {
                    enabled: true
                }
            },
            images: [],                 // image format = { src: "", title: "", subtitle: "" }
            slider: {
                enabled: true,
                width: 80				// percentage of width
            }
        },

        _create: function () {
            this._categories = [];
            this._imagesByCategory = {};
            this.options.width = this.options.width || this.element.width();
            this.options.height = this.options.height || this.element.height();

            this._currentIndex = this.options.selectedIndex;

            if (this.options.images.length > 0) {
                for (var i in this.options.images) {
                    var image = this.options.images[i];
                    this.element.append(
                       $("<img>")
                           .attr({
                                src: image.src,
                                alt: image.title + (!image.subtitle ? "" : ", " + image.subtitle)
                            })
                            .data({
                                title: image.title,
                                subtitle: image.subtitle
                            })
                    );
                }
            }

            this._$images = this.element.find("img");
            this._loadImages();
            this._loadSlider();

            if (this.options.autoplay.enabled) {
                this._play();
            }
        },

        _setOption: function (key, value) {
            switch (key) {
                case "selectedIndex":
                    this._gotoCover(value);
                    break;

                case "categories":
                    if (value.selectedCategory != this.options.categories.selectedCategory) {
                        this._gotoCategory(value);
                    }
                    break;

                case "autoplay":
                    if (value.enabled) {
                        this._play();
                    }
                    else {
                        this._pause();
                    }
                    break;
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },

        /* End Widget Overrides */

        _$activeImages: [],
        _categories: [],
        _$images: [],
        _imagesByCategory: {},

        _$slider: null,
        _$sliderHandleHelper: null,
        _currentIndex: 0,
        _currentCategoryIndex: 0,
        _playIntervalId: null,
        _playCountInCategory: 0,

        addImage: function ($image) {
            /// <summary>
            /// Add a new image to the end of the Coverflow.
            /// </summary> 
            /// <param name="$image" type="jQuery">The image to be added.</param>

            this._addImage($image, false);
        },

        _addImage: function ($image, isChangingCategory) {
            /// <summary>
            /// Add a new image to the end of the Coverflow.
            /// </summary> 
            /// <param name="$image" type="jQuery">The image to be added.</param>

            // Allow array index to just continually go up?
            // Maybe implement destruct on coverflow and have covers recreated when adding after removing.

            if (!$image.data("cover")) {
                this._$activeImages.each(function (i, img) {
                    $(img).cover("raiseZ");
                });

                $image.remove();
                this.element.append($image);
                var category = this._loadImage($image[0]);
                // Only display the image as active when it matches the current category if enabled.
                if (isChangingCategory || (!this.options.categories.enabled || this._getCurrentCategory() == category)) {
                    this._$activeImages.push($image[0]);
                    this._createCover(this._imagesCount() - 1, $image[0]);
                    this._syncSlider();
                }
            }
        },

        removeImage: function () {
            if (this._imagesCount() > 1) {
                this._removeImage();
            }
        },

        _removeImage: function () {
            ///<summary>Removes the first image on the left</summary>
            var removeIndex = 0;
            var image = this._$activeImages.splice(removeIndex, 1);
            $(image).cover("destroy");

            this._$activeImages.each(function (index, img) {
                $(img).cover("lowerZ");
                $(img).data("coverflow").index = index;
            });

            if (removeIndex == this._currentIndex) {
                this.gotoCover(this._currentIndex);
            }
            else {
                this.gotoCover(this._currentIndex - 1);
            }

            this._syncSlider();

            return image;
        },

        isPlaying: function () {
            return (this._playIntervalId != null);
        },

        play: function () {
            var autoplay = $.extend(true, {}, this.options.autoplay);
            autoplay.enabled = true;
            this._setOption("autoplay", autoplay);
            this._trigger("play", null, { selectedIndex: this._currentIndex });
        },

        _play: function () {
            if (!this.isPlaying()) {
                this._playIntervalId = setInterval($.proxy(this, "_playNext"), this.options.autoplay.interval * 1000);
            }
        },

        _playNext: function () {
            if (this.options.categories.enabled) {
                if (this._playCountInCategory >= this._imagesCount() || this._playCountInCategory >= this.options.autoplay.playsPerCategory) {
                    this._nextCategory();
                    this._playCountInCategory = 0;

                    return;
                }
                else {
                    ++this._playCountInCategory;
                }
            }

            this._nextCover();
        },

        pause: function () {
            this._pause();
            this._trigger("pause", null, { selectedIndex: this._currentIndex });
        },

        _pause: function () {
            if (this.isPlaying()) {
                clearInterval(this._playIntervalId);
                this._playIntervalId = null;
            }
        },

        togglePlay: function () {
            if (this.isPlaying()) {
                this._pause();
            }
            else {
                var autoplay = $.extend(true, {}, this.options.autoplay);
                autoplay.enabled = true;
                this._setOption("autoplay", autoplay);
            }
            this._trigger("togglePlay", null, { selectedIndex: this._currentIndex });
        },

        _getCurrentCategory: function () {
            return this._categories[this._currentCategoryIndex];
        },

        nextCategory: function () {
            if (this.options.categories.enabled) {
                this._nextCategory();
                this._trigger("nextCategory", null, { selectedCategory: this._getCurrentCategory() });
            }
        },

        _nextCategory: function () {
            var selectedIndex;
            if (this._currentCategoryIndex == this._categories.length - 1) {
                selectedIndex = 0;
            }
            else {
                selectedIndex = this._currentCategoryIndex + 1;
            }

            this._gotoCategory(this._categories[selectedIndex]);
        },

        prevCategory: function () {
            if (this.options.categories.enabled) {
                this._prevCategory();
                this._trigger("prevCategory", null, { selectedCategory: this._getCurrentCategory() });
            }
        },

        _prevCategory: function () {
            var selectedIndex;
            if (this._currentCategoryIndex == 0) {
                selectedIndex = this._categories.length - 1;
            }
            else {
                selectedIndex = this._currentCategoryIndex - 1;
            }

            this._gotoCategory(this._categories[selectedIndex]);
        },

        gotoCategory: function (selectedCategory) {
            var categories = $.extend(true, {}, this.options.categories);
            categories.selectedCategory = selectedCategory;
            this._setOption("categories", categories);
            this._trigger("gotoCategory", null, { selectedCategory: this._getCurrentCategory() });
        },

        _gotoCategory: function (selectedCategory) {
            var images = this._imagesByCategory[selectedCategory];
            if (images && images.length > 0) {
                var prevImagesCount = this._imagesCount();
                var i;
                for (i = 0; i < prevImagesCount; i++) {
                    this._removeImage();
                }
                for (i in images) {
                    this._addImage($(images[i]), true);
                }
                for (i = 0; i < this._categories.length; i++) {
                    if (this._categories[i] == selectedCategory) {
                        this._currentCategoryIndex = i;
                        break;
                    }
                }
            }
        },

        nextCover: function () {
            this._nextCover();
            this._trigger("nextCover", null, { selectedIndex: this._currentIndex });
        },

        _nextCover: function () {
            var selectedIndex;
            if (this._currentIndex == this._imagesCount() - 1) {
                selectedIndex = 0;
            }
            else {
                selectedIndex = this._currentIndex + 1;
            }

            this._gotoCover(selectedIndex);
        },

        prevCover: function () {
            this._prevCover();
            this._trigger("prevCover", null, { selectedIndex: this._currentIndex });
        },

        _prevCover: function () {
            var selectedIndex;
            if (this._currentIndex == 0) {
                selectedIndex = this._imagesCount() - 1;
            }
            else {
                selectedIndex = this._currentIndex - 1;
            }

            this._gotoCover(selectedIndex);
        },

        gotoCover: function (selectedIndex) {
            /// <summary>
            /// Wrapper for setting the "selectedIndex" option.
            /// </summary>
            this._setOption("selectedIndex", selectedIndex);
            this._trigger("gotoCover", null, { selectedIndex: this._currentIndex });
        },

        _gotoCover: function (selectedIndex, isSliding) {
            isSliding = isSliding || false;
            if (this.options.slider.enabled && !isSliding) {
                this._$slider.slider("value", selectedIndex);
            }
            this._$activeImages.each($.curry(this, "_updateCover", isSliding, selectedIndex));
            this._currentIndex = selectedIndex;

            if (this._currentIndex == this._imagesCount()) {
                this._trigger("lastCover", null, { selectedIndex: this._currentIndex });
            }
        },

        _createCover: function (index, image) {
            var options = this._coverConfig(false, this._currentIndex, index, {
                click: $.proxy(this, "_clickCover"),
                mouseenter: $.proxy(this, "_mouseenterCover"),
                mouseleave: $.proxy(this, "_mouseleaveCover")
            });
            $(image).show().cover(options).data("coverflow", {
                index: index
            });
        },

        _loadImages: function () {
            for (var i = 0; i < this._$images.length; i++) {
                this._loadImage(this._$images[i]);
            }

            if (this.options.categories.enabled) {
                var selectedCategory = this.options.categories.selectedCategory;
                if (!selectedCategory) {
                    selectedCategory = this._categories[0];
                }
                this._$activeImages = $(this._imagesByCategory[selectedCategory]);
            }
            else {
                this._$activeImages = this._$images;
            }

            this._$activeImages.each($.proxy(this, "_createCover"));
        },

        _loadImage: function (image) {
            var $image = $(image).hide();

            var category = null;
            if (this.options.categories.enabled) {
                category = $image.data("category");
                if (!category) {
                    category = this.options.categories.defaultCategory;
                }

                if (!this._imagesByCategory[category]) {
                    this._imagesByCategory[category] = [];
                    this._categories.push(category);
                }

                this._imagesByCategory[category].push(image);
            }

            return category;
        },

        _updateCover: function (isSliding, selectedIndex, index, image) {
            var coverOptions = this._coverConfig(isSliding, selectedIndex, index);
            var cover = $(image).data("cover");
            for (var option in coverOptions) {
                cover.option(option, coverOptions[option]);
            }

            cover.refresh(true);
        },

        _sliderChange: function (event, ui) {
            if (ui.value != this._currentIndex) {
                this._gotoCover(ui.value, true);
                this._trigger("slide", null, { selectedIndex: this._currentIndex });
            }
        },

        _clickCover: function (e, data) {
            this._gotoCover(data.image.data("coverflow").index);
        },

        _mouseenterCover: function () {
            if (this.options.autoplay.pauseOnMouseenter) {
                this._pause();
                this._trigger("mouseenter", null, { selectedIndex: this._currentIndex });
            }
        },

        _mouseleaveCover: function () {
            if (this.options.autoplay.pauseOnMouseenter) {
                if (this.options.autoplay.enabled) {
                    this._play();
                }
                this._trigger("mouseleave", null, { selectedIndex: this._currentIndex });
            }
        },

        _coverConfig: function (isSliding, selectedIndex, index, options) {
            options = options || {};
            var centerOffset = 0;
            var perspective = "center";
            var scale = 0;

            if (index < selectedIndex) {
                centerOffset = (selectedIndex - index) * -1;
                perspective = "left";
            }
            else if (index > selectedIndex) {
                centerOffset = index - selectedIndex;
                perspective = "right";
            }

            if (index != selectedIndex) {
                scale = 1 - (this.options.cover.background.size / 100);
            }

            var perspectiveDuration = this.options.cover.animation.perspective.duration;
            if (!isSliding && Math.abs(this._currentIndex - selectedIndex) == 1) {
                perspectiveDuration += perspectiveDuration * (this.options.cover.animation.perspective.inner / 100);
            }

            var coverWidth = this.options.cover.width - (scale * this.options.cover.width);
            var coverHeight = this.options.cover.height - (scale * this.options.cover.height);

            var coverOptions = $.extend(true, {}, this.options.cover, options, {
                perspective: {
                    position: perspective
                },
                width: coverWidth,
                height: coverHeight,
                canvas: {
                    left: this._coverLeft(centerOffset, coverWidth),
                    top: this._coverTop(centerOffset, coverHeight, scale),
                    zIndex: this._$activeImages.length - Math.abs(centerOffset)
                },
                animation: {
                    slide: {
                        duration: 900,
                        easing: "easeOutCirc"
                    },
                    perspective: {
                        duration: perspectiveDuration,
                        easing: "jswing"
                    }
                }
            });

            return coverOptions;
        },

        _coverLeft: function (centerOffset, coverWidth) {
            var left = (this.options.width / 2) - (coverWidth / 2) + (coverWidth * centerOffset);
            var overlap;
            if (Math.abs(centerOffset) > 1) { // outer
                overlap = (this.options.cover.overlap.outer / 100) * coverWidth;
                overlap *= Math.abs(centerOffset) - 1;
                overlap += (this.options.cover.overlap.inner / 100) * coverWidth;
            }
            else { // inner
                overlap = (this.options.cover.overlap.inner / 100) * coverWidth;
                overlap *= Math.abs(centerOffset);
            }

            if (centerOffset < 0) {
                left += overlap;
            }
            else if (centerOffset > 0) {
                left -= overlap;
            }

            return left;
        },

        _coverTop: function (centerOffset, coverHeight, scalePercentage) {
            var top = 0;
            if (centerOffset != 0) {
                top += coverHeight * (scalePercentage / 2);
            }
            return top;
        },

        _imagesCount: function () {
            return this._$activeImages.length;
        },

        _loadSlider: function () {
            if (!this.options.slider.enabled) {
                return;
            }

            var coverCount = this._imagesCount();
            var sliderWidth = this.options.width - (1 - (this.options.slider.width / 100)) * this.options.width;
            var handleSize = sliderWidth / coverCount;

            this._$slider = $("<div/>")
                .css({
                    width: sliderWidth,
                    position: "absolute",
                    zIndex: coverCount + 1,
                    left: (this.options.width - sliderWidth) / 2
                })
                .addClass("coverflow-slider")
                .slider({
                    animate: true,
                    value: this._currentIndex,
                    max: coverCount - 1,
                    slide: $.proxy(this, "_sliderChange")
                });


            this._$sliderHandleHelper = this._$slider.find(".ui-slider-handle")
                .css({
                    width: handleSize,
                    marginLeft: -handleSize / 2 - 2
                })
                .wrap($("<div class='ui-handle-helper-parent'></div>")
                    .width(sliderWidth - handleSize)
                    .css({
                        position: "relative",
                        height: "100%",
                        margin: "auto"
                    })
                )
                .parent();

            this.element.append(this._$slider);
        },

        _syncSlider: function () {
            if (!this.options.slider.enabled) {
                return;
            }

            var coverCount = this._imagesCount();
            this._$slider
                .css({ zIndex: coverCount + 1 })
                .slider("option", "max", coverCount - 1)
                .slider("value", this._currentIndex);

            var sliderWidth = this.options.width - (1 - (this.options.slider.width / 100)) * this.options.width;
            var handleSize = sliderWidth / coverCount;

            this._$sliderHandleHelper
                .width(sliderWidth - handleSize)
                .find("a")
                    .css({
                        width: handleSize,
                        marginLeft: -handleSize / 2 - 2
                    });
        }
    });

    $.curry = function (fn, proxy) {
        ///	<summary>
        ///		Just like proxy, but enhanced with the ability to "curry" arguments.
        ///     Takes a function and returns a new one that will always have a particular scope.
        ///	</summary>
        /// <remarks>
        ///     Not replacing the proxy method because there are still some edge cases where this breaks proxy.
        /// </remarks>
        /// <example>
        ///     Any of the following signatures will bind a function to a particular context and return the bound function.
        ///
        /// jQuery.curry( function, scope )
        /// jQuery.curry( scope, name )
        /// jQuery.curry( function, scope, args... )
        /// jQuery.curry( scope, name, args... )
        /// </example>
        ///	<param name="fn" type="Function">
        ///		The function whose scope will be changed.
        ///	</param>
        ///	<param name="proxy" type="Object">
        ///		The object to which the scope of the function should be set.
        ///	</param>
        ///	<returns type="Function" />

        var context = null, args = Array.prototype.slice.call(arguments, 2);

        if (arguments.length >= 2) {

            if (typeof proxy === "string") {
                context = fn;
                fn = context[proxy];
                proxy = undefined;

            }
            else if (proxy && !jQuery.isFunction(proxy)) {
                context = proxy;
                proxy = undefined;

            }
        }

        if (!proxy && fn) {
            proxy = function () {
                var combinedArgs = jQuery.merge([], args);
                combinedArgs = jQuery.merge(combinedArgs, arguments);
                return fn.apply(context || this, combinedArgs);
            };
        }

        // Set the guid of unique handler to the same of original handler, so it can be removed
        if (fn) {
            proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
        }

        // So proxy can be declared as an argument
        return proxy;
    };
})(jQuery);
