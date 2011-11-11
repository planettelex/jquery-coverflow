typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function($) {
	$.widget('pt.coverflow', {
		/* Begin Widget Overrides */

		widgetEventPrefix : 'pt.coverflow',

		options: {
			width: null,
			height: null,
			offsetSizeDiff: 20,
			selectedIndex: 1,
			cover: {
				width: 300,
				height: 300,
				overlap: 50,
				angle: 10
			}
		},

		_create: function() {
			this.options.width = this.options.width || this.element.width();
			this.options.height = this.options.height || this.element.height();

			var self = this;
			this._$images = this.element.find("img");
			this._$images.each(function(index) {
				//TODO Fix how the index is passed through the even handler.
				var coverConfig = self._coverConfig(self.options.selectedIndex, index);	
				coverConfig.options['click.cover'] = function (e) {
					self.gotoCover(index);
				};		
				
				$(this).cover(coverConfig.options);
			});
			
		},

		_setOption: function(key, value) {
			switch (key) {
			case "selectedIndex":
				this.gotoCover(value);
				break;
			}

			$.Widget.prototype._setOption.apply(this, arguments);
		},

		destroy: function() {
			$.Widget.prototype.destroy.call(this);
		},
		
		/* End Widget Overrides */

		_$images: [],
		
		gotoCover: function(selectedIndex) {
			var self = this;
			this._$images.each(function(index) {
				$this = $(this);
				var coverConfig = self._coverConfig(selectedIndex, index);
				$this.data("cover").option("perspective", coverConfig.options.perspective);
				$this.data("cover").refresh();
			});
		},
		
		_coverConfig: function(selectedIndex, index) {
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
			
			var coverOptions = $.extend({}, this.options.cover, {
				perspective: perspective,
				width: coverWidth,
				height: coverHeight,
				canvas: {
					left: this._coverLeft(centerOffset, coverWidth),
					top: this._coverTop(centerOffset, coverHeight),
					zIndex: this._$images.length - Math.abs(centerOffset)
				}
			});
			
			return {
				centerOffset: centerOffset,
				options: coverOptions
			};
		},
		
		_coverLeft: function (centerOffset, coverWidth) {
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
})(jQuery);