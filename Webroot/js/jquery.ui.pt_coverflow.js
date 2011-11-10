typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function($) {
	$.widget('pt.coverflow', {
		widgetEventPrefix : 'pt.coverflow',

		options: {

		},

		_create: function() {
			this.element.find("img").cover();
		},

		_setOption: function(key, value) {
			switch (key) {
			case "interval":
				// handle changes to interval option
				break;
			}

			$.Widget.prototype._setOption.apply(this, arguments);
		},

		destroy: function() {
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);