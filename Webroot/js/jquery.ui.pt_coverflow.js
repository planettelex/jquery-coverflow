typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function ($) {
	$.widget('pt.coverflow', {
		/* Begin Widget Overrides */

		widgetEventPrefix : 'pt.coverflow',

		options: {
			width: null,
			height: null,
			selectedIndex: 0,
			autoplay: {
				enabled: false,
				interval: 5,			// seconds
				pauseOnMouseenter: true
			},
			categories: {
				enabled: true
			},
			cover: {
				angle : 12,				// degrees
				height: 300,
				width: 300,
				animation: {
					perspective: {
						duration: 80,	// milliseconds
						inner: 120		// percentage of duration
					}
				},
				background: {
					size: 90			// percentage of original image
				},
				overlap: {
					inner: 20,			// percentage of overlap
					outer: 80			// percentage of overlap
				},
				perspective: {
					enabled: true
				},
				reflection: {
					enabled: true,
					initialOpacity: 50,	// percentage 0(transparent) <=> 100(opaque)
					length: 80			// percentage of original image
				},
				title:  {
					enabled: true
				}
			},
			images: [], // image format = { src: "", title: "", subtitle: "" }
			slider: {
				enabled: true,
				width: 80				// percentage of width
			}
		},

		_create: function () {
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

				case "autoplay": {
					if (value.enabled) {
						this._play();
					}
					else {
						this._pause();
					}
					break;
				}
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
		_playIntervalId: null,
		
		addImage: function($image) {
			// Allow array index to just continually go up?
			// Maybe implement destruct on coverflow and have covers recreated when adding after removing.
			
			if (!$image.data("cover")) {
				//TODO Just increase all of the container's elements zIndex?
				this._$activeImages.each(function (i, img) {
					$(img).cover("raiseZ");
				});
				
				$image.remove();
				this.element.append($image);
				this._$activeImages.push($image[0]);
				this._loadImage($image[0]);
				this._createCover(this._coverCount() - 1, $image[0]);
				this._syncSlider();
			}
		},
		
		removeImage: function () {
			var image = null;
			
			//Removes the first image on the left
			if (this._coverCount() > 1) {
				var removeIndex = 0;
				image = this._$activeImages.splice(removeIndex, 1);
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
			}
			
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
				this._playIntervalId = setInterval($.proxy(this, "nextCover"), this.options.autoplay.interval * 1000);
			}
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

		nextCover: function () {
			this._nextCover();
			this._trigger("nextCover", null, { selectedIndex: this._currentIndex });
		},

		_nextCover: function () {
			var selectedIndex;
			if (this._currentIndex == this._coverCount()) {
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
				selectedIndex = this._coverCount();
			}
			else {
				selectedIndex = this._currentIndex - 1;
			}

			this._gotoCover(selectedIndex);
		},

		/**
		 * Wrapper for setting the "selectedIndex" option.
		 */
		gotoCover: function (selectedIndex) {
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

			if (this._currentIndex == this._coverCount()) {
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
			var activeImages = [];
			var firstCategory = null;
			for (var i = 0; i < this._$images.length; i++) {
				var category = this._loadImage(this._$images[i]);
				
				if (!firstCategory) {
					firstCategory = category;
				}
				
				if (!this.options.categories.enabled || category == firstCategory) {
					activeImages.push(this._$images[i]);
				}
			}

			this._$activeImages = $(activeImages);
			this._$activeImages.each($.proxy(this, "_createCover"));
		},
		
		_loadImage: function (image) {
			var $image = $(image).hide();
			var category = $image.data("category");
			if (!category) {
				category = "Unknown";
			}

			if (!this._imagesByCategory[category]) {
				this._imagesByCategory[category] = [];
				this._categories.push(category);
			}

			this._imagesByCategory[category].push(image);
			
			return category;
		},

		_updateCover: function (isSliding, selectedIndex, index, image) {
			var coverOptions = this._coverConfig(isSliding, selectedIndex, index);
			var cover = $(image).data("cover");
			for (var option in coverOptions) {
				cover.option(option, coverOptions [option]);
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

		_coverCount: function () {
			return this._$activeImages.length;
		},

		_loadSlider: function () {
			if (!this.options.slider.enabled) {
				return;
			}

			var coverCount = this._coverCount();
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
			
			var coverCount = this._coverCount();
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

			if ( typeof proxy === "string") {
				context = fn;
				fn = context [proxy];
				proxy = undefined;

			}
			else if (proxy && !jQuery.isFunction(proxy)) {
				context = proxy;
				proxy = undefined;

			}
		}

		if (!proxy && fn) {
			proxy = function () {
				var combinedArgs = jQuery.merge( [], args);
				combinedArgs = jQuery.merge(combinedArgs, arguments);
				return fn.apply (context || this, combinedArgs);
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if (fn) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	};
}) (jQuery);
