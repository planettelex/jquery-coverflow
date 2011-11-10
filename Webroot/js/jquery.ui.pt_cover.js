typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function($) {
	$.widget('pt.cover', {
		/* Begin Widget Overrides */

		widgetEventPrefix : 'pt.cover',

		options: {

		},

		_create: function() {
			this.element.load($.proxy(this, "_load"));
		},

		_setOption: function(key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		destroy: function() {
			$.Widget.prototype.destroy.call(this);
		},
		
		/* End Widget Overrides */
		
		_canvas: null,
		_cover: null,
		_context: null,
		_image: null,
		
		supportCanvas: (function() {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})(),
		
		_load: function() {
			this._image = this.element[0];
			this._canvas = this.supportCanvas ? document.createElement('canvas') : null;
			this._context = this._canvas ? this._canvas.getContext('2d') : null;
			this._cover = this._canvas || this.element;
			
			this.element.replaceWith(this._cover);
			this.draw();
		},
	    
		draw: function () {
			this._context.drawImage(this._image, 0, 0, this._image.width, this._image.height);
		}
	});
})(jQuery);