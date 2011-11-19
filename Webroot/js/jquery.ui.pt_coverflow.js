typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function ($) {
	$.widget ('pt.coverflow', {
		/* Begin Widget Overrides */

		widgetEventPrefix : 'pt.coverflow',

		options: {
			width: null,
			height: null,
			selectedIndex: 1,
			cover: {
				addReflection: false,
				width: 300,
				height: 300,
				overlap: {
					inner: 20,	// percentage
					outer: 80	// percentage
				},
				backgroundScale: 10, // percentage
				angle : 10,
				animation: {
					perspective: {
						duration: 80,	// milliseconds
						inner: 120		// percentage of duration
					}
				}
			},
			images: [] // one image = {src: "", title: "", subtitle: ""}
		},

		_create : function() {
			this.options.width = this.options.width || this.element.width();
			this.options.height = this.options.height || this.element.height();

			if (this.options.images.length > 0) {
				 for (var i in this.options.images) {
				 	var image = this.options.images[i];
				 	this.element.append(
				 		$("<img>")
				 			.attr({ src: image.src })
				 			.data({
				 				title: image.title,
				 				subtitle: image.subtitle
				 			})
				 	);
				 }
			}
			
			this._$images = this.element.find("img");	
			this._$images.each($.proxy(this, "_createCover"));
		},
		
		_setOption : function (key, value) {
			switch (key) {
				case "selectedIndex":
					this._gotoCover(value);
					this._currentIndex = value;
					break;
			}

			$.Widget.prototype._setOption.apply(this, arguments);
		},
		
		destroy : function() {
			$.Widget.prototype.destroy.call(this);
		},
		
		/* End Widget Overrides */

		_$images: [],
		_currentIndex: 0,

		_createCover: function(index, image) {
			this._currentIndex = this.options.selectedIndex;
			var options = this._coverConfig(this.options.selectedIndex, index, {
				click: $.proxy(this, "_clickCover")
			});
			$(image).cover(options).data("coverFlow", {
				index: index
			});
		},
		
		_updateCover: function(selectedIndex, index, image) {
			var coverOptions = this._coverConfig(selectedIndex, index);
			var cover = $ (image).data("cover");
			for (var option in coverOptions) {
				cover.option(option, coverOptions [option]);
			}

			cover.refresh(true);
		},
		
		_clickCover: function(e, data) {
			this.gotoCover(data.image.data("coverFlow").index);
		},
		
		/**
		 * Wrapper for setting the "selectedIndex" option.
		 */
		gotoCover: function(selectedIndex) {
			this._setOption("selectedIndex", selectedIndex);
		},
		
		_gotoCover: function(selectedIndex) {
			this._$images.each($.curry(this, "_updateCover", selectedIndex));
		},
		
		_coverConfig: function(selectedIndex, index, options) {
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
				scale = (this.options.cover.backgroundScale / 100);
			}
			
			var perspectiveDuration = this.options.cover.animation.perspective.duration;
			if (Math.abs(this._currentIndex - selectedIndex) == 1) {
				perspectiveDuration += perspectiveDuration * (this.options.cover.animation.perspective.inner / 100);
			}

			var coverWidth = this.options.cover.width - (scale * this.options.cover.width);
			var coverHeight = this.options.cover.height - (scale * this.options.cover.height);

			var coverOptions = $.extend(true, {}, this.options.cover, options, {
				perspective: perspective,
				width: coverWidth,
				height: coverHeight,
				canvas: {
					left: this._coverLeft(centerOffset, coverWidth),
					top: this._coverTop(centerOffset, coverHeight, scale),
					zIndex: this._$images.length - Math.abs(centerOffset)
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
		
		_coverLeft: function(centerOffset, coverWidth) {
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
