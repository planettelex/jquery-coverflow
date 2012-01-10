typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function ($) {
    var position = {
        left: 1,
        center: 2,
        right: 3
    };

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
                playsPerCategory: 1
            },
            categories: {
                enabled: false,
                defaultCategory: "Unknown",
                selectedCategory: null,
                renderTitles: true
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
            ///<summary>Creates a new instance of the Coverflow.</summary>
            ///<returns type="Undefined" />

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

            // CSS that is required for Coverflow to function correctly.
            this.element.css({
                position: "relative",
                overflow: "hidden"
            });
            this._$images = this.element.find("img");
            this._loadImages();
            this._loadSlider();

            if (this.options.categories.enabled) {
                this._loadCategoryTitles();
            }

            if (this.options.autoplay.enabled) {
                this._play();
            }
        },

        _setOption: function (key, value) {
            ///<summary>Sets an option.</summary>
            ///<param name="key" type="String">The option name (key in the options object).</param>
            ///<param name="value" type="Object">The is a mixed type value of the option.</param>
            ///<returns type="Undefined" />

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
            ///<summary>Destroys the Coverflow instance and restores the DOM to its original state prior to the Coverflow creation.</summary>
            ///<returns type="Undefined" />

            this._$images.each(function (i, img) {
                $(img).cover("destroy");
            });
            this._$categoryContainer.remove();
            this._$slider.slider("destroy").remove();

            this.element.unbind().css({
                position: "",
                overflow: ""
            });

            $.Widget.prototype.destroy.call(this);
        },

        /* End Widget Overrides */

        _$activeImages: [],
        _categories: [],
        _$categoryContainer: null,
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
            /// Adds a new image to the end of the Coverflow on the right.
            /// If categories are active then the image may not immediately
            /// be displayed if its category doesn't match the currently active one.
            /// </summary> 
            /// <param name="$image" type="jQuery">The image to be added.</param>
            ///<returns type="Undefined" />

            this._addImage($image, false);

        },

        _addImage: function ($image, isChangingCategory) {
            /// <summary>
            /// Adds a new image to the end of the Coverflow on the right.
            /// </summary> 
            /// <param name="$image" type="jQuery">The image to be added.</param>
            /// <param name="isChangingCategory" type="Boolean">
            /// Determines if the category is being changed or not.
            /// This way during a category change images are allowed to be added to the previously active category.
            /// Defaults to false.
            /// </param>
            ///<returns type="Undefined" />

            isChangingCategory = isChangingCategory || false;
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
                    this._createCover(this._imagesCount() - 1, $image[0], position.right);
                    this._updateCover(true, this._currentIndex, this._imagesCount() - 1, $image[0], position.center);
                    this._syncSlider();
                }
            }
        },

        removeImage: function () {
            ///<summary>
            /// Removes the first image on the left of the Coverflow.
            ///</summary>
            ///<returns type="Undefined" />

            if (this._imagesCount() > 1) {
                this._removeImage();
            }
        },

        _removeImage: function () {
            ///<summary>Removes the first image on the left of the Coverflow.</summary>
            ///<returns type="Undefined" />

            var removeIndex = 0;
            var image = this._$activeImages.splice(removeIndex, 1);
            this._updateCover(true, this._currentIndex, removeIndex, image, position.left);
            this.element.one("pt.coverrefreshed-" + $(image).data("coverflow").id, function (e, data) {
                $(data.image).cover("destroy");
            });

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
            ///<summary>
            /// Determines if the Coverflow is currently playing.
            ///</summary>
            ///<returns type="Boolean"><c>true</c> if play mode is active.</returns>

            return (this._playIntervalId != null);
        },

        play: function () {
            ///<summary>
            /// Turns on autoplay mode.
            ///</summary>
            ///<returns type="Undefined" />

            var autoplay = $.extend(true, {}, this.options.autoplay);
            autoplay.enabled = true;
            this._setOption("autoplay", autoplay);
            this._trigger("play", null, { selectedIndex: this._currentIndex });
        },

        _play: function () {
            ///<summary>
            /// Turns on autoplay mode, but does not trigger any events.
            ///</summary>
            ///<returns type="Undefined" />

            if (!this.isPlaying()) {
                this._playIntervalId = setInterval($.proxy(this, "_playNext"), this.options.autoplay.interval * 1000);
            }
        },

        _playNext: function () {
            ///<summary>
            /// Controls what gets played next during each interval while autoplay mode is enabled.
            /// If categories are enabled then the next one might be shown instead of the next cover.
            ///</summary>
            ///<returns type="Undefined" />

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
            var autoplay = $.extend(true, {}, this.options.autoplay);
            autoplay.enabled = false;
            this._setOption("autoplay", autoplay);
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

            if (selectedIndex != this._currentCategoryIndex) {
                this._gotoCategory(this._categories[selectedIndex]);
            }
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
            if (this.options.categories.enabled) {
                var categories = $.extend(true, {}, this.options.categories);
                categories.selectedCategory = selectedCategory;
                this._setOption("categories", categories);
                this._trigger("gotoCategory", null, { selectedCategory: this._getCurrentCategory() });
            }
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

            this._loadCategoryTitles();
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

        _createCover: function (index, image, initialPosition) {
            ///<summary>Creates the cover for an image and places it in the coverflow.</summary>
            ///<param name="index" type="Numeric" integer="true">The images index in the coverflow.</param>
            ///<param name="image" domElement="true">The image element from the DOM.</param>
            ///<param name="initialPosition" type="String">The initial placement of the cover relative to the coverflow container.</param>

            initialPosition = initialPosition || position.center;
            var options = this._coverConfig(initialPosition, false, this._currentIndex, index, {
                id: (new Date()).getTime(),
                click: $.proxy(this, "_clickCover"),
                mouseenter: $.proxy(this, "_mouseenterCover"),
                mouseleave: $.proxy(this, "_mouseleaveCover")
            });
            $(image).show().cover(options).data("coverflow", {
                index: index,
                id: options.id
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

        _updateCover: function (isSliding, selectedIndex, index, image, targetPosition) {
            targetPosition = targetPosition || position.center;
            var coverOptions = this._coverConfig(targetPosition, isSliding, selectedIndex, index);
            //TODO Find another solution to using the positioning for settings these? 
            //TODO For example, when going to previous category we might want to reverse this.
            if (targetPosition == position.left) {
                coverOptions.canvas.opacity = 0;
                coverOptions.animation.slide.easing = "jswing";
            }
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

        _coverConfig: function (initialPosition, isSliding, selectedIndex, index, options) {
            initialPosition = initialPosition || position.center;
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
                    background: this.element.css("background-color"),
                    left: this._coverLeft(centerOffset, coverWidth, initialPosition),
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

        _coverLeft: function (centerOffset, coverWidth, initialPosition) {
            var left = 0;
            switch (initialPosition) {
                case position.center:
                    left = (this.options.width / 2) - (coverWidth / 2) + (coverWidth * centerOffset);
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
                    break;

                case position.right:
                    left = this.options.width - coverWidth;
                    break;
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

        _loadCategoryTitles: function () {
            if (!this.options.categories.renderTitles) {
                return;
            }

            if (this._$categoryContainer) {
                this._$categoryContainer.remove();
            }

            this._$categoryContainer = $("<ul />").addClass("coverflow-categories");
            for (var i in this._categories) {
                var category = this._categories[i];
                var $cat = $("<li />")
                    .text(category)
                    .click($.curry(this, "gotoCategory", category));
                if (category == this._getCurrentCategory()) {
                    $cat.addClass("coverflow-selected-category");
                }
                this._$categoryContainer.append($cat);
            }
            this.element.prepend(this._$categoryContainer);
        },

        _loadSlider: function () {
            if (!this.options.slider.enabled) {
                return;
            }

            var coverCount = this._imagesCount();
            var sliderWidth = this.options.width - (1 - (this.options.slider.width / 100)) * this.options.width;
            var handleSize = sliderWidth / coverCount;

            this._$slider = $("<div />")
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
