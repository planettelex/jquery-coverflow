typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function ($) {
	$.widget ('pt.coverflow', {
		/* Begin Widget Overrides */

		widgetEventPrefix : 'pt.coverflow',

		options : {
			width : null,
			height : null,
			offsetSizeDiff : 20,
			selectedIndex : 1,
			cover : {
				width : 300,
				height : 300,
				overlap : 50,
				angle : 10
			}
		},

		_create : function() {
			this.options.width = this.options.width || this.element.width();
			this.options.height = this.options.height || this.element.height();

			this._$images = this.element.find("img");
			this._$images.each ($.proxy(this, "_createCover"));
		},
		
		_setOption : function (key, value) {
			switch (key) {
				case "selectedIndex":
					this._gotoCover(value);
					break;
			}

			$.Widget.prototype._setOption.apply(this, arguments);
		},
		
		destroy : function() {
			$.Widget.prototype.destroy.call(this);
		},
		
		/* End Widget Overrides */

		_$images: [],

		_createCover: function(index, image) {
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

			cover.refresh();
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
			var offsetSizeDiff = 0;

			if (index < selectedIndex) {
				centerOffset = (selectedIndex - index) * -1;
				perspective = "left";
				offsetSizeDiff = this.options.offsetSizeDiff;
			}
			else if (index > selectedIndex) {
				centerOffset = index - selectedIndex;
				perspective = "right";
				offsetSizeDiff = this.options.offsetSizeDiff;
			}

			var coverWidth = this.options.cover.width - offsetSizeDiff;
			var coverHeight = this.options.cover.height - offsetSizeDiff;

			var coverOptions = $.extend({}, this.options.cover, options, {
				perspective : perspective,
				width : coverWidth,
				height : coverHeight,
				canvas : {
					left : this._coverLeft(centerOffset, coverWidth),
					top : this._coverTop(centerOffset, coverHeight),
					zIndex : this._$images.length - Math.abs(centerOffset)
				}
			});

			return coverOptions;
		},
		
		_coverLeft: function(centerOffset, coverWidth) {
			var left = (this.options.width / 2) - (coverWidth / 2) + (coverWidth * centerOffset);
			if (centerOffset < 0) {
				left += this.options.cover.overlap;
			}
			else if (centerOffset > 0) {
				left -= this.options.cover.overlap;
			}

			return left;
		},
		
		_coverTop: function (centerOffset, coverHeight) {
			var top = 0;
			if (centerOffset != 0) {
				top = (this.options.height / 2) - (coverHeight / 2);
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

		var context, args = Array.prototype.slice.call(arguments, 2);

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
