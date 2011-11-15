typeof jQuery != 'undefined'
&& typeof jQuery.ui != 'undefined'
&& (function($) {
	
	Math.degreesToRadians = function (degree) {
		return degree * (Math.PI / 180);
	};
	
	$.widget('pt.cover', {
		/* Begin Widget Overrides */

		widgetEventPrefix : 'pt.cover',

		options: {
			canvas: {
				left: 0,
				top: 0,
				zIndex: 0
			},
			width: 300,
			height: 300,
			angle: 0,
			perspective: "center", // (left|center|right)
			subdivisionLimit : 5,
			patchSize : 64,
			animation: {
				slide: {
					duration: 900,
					easing: "easeOutCirc"
				},
				perspective: {
					duration: 250,
					easing: "jswing" 
				}
			}
		},

		_create: function() {
			this._oldOptions = $.extend(true, {}, this.options);
			
			// IE doesn't always invoke the load event properly!
			if ( this.element[0].nodeType === 1 && this.element[0].tagName.toLowerCase() === 'img' && this.element[0].src !== '' ) {
				// Image is already complete, fire the _load method (fixes browser issues where cached
				// images aren't triggering the load event)
				if ( this.element[0].complete || this.element[0].readyState === 4 ) {
					this._load();
				}
				// Check if data URI images is supported, fire 'error' event if not
				else if ( this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0 ) {
					this.element.trigger('error');
				}
				else {
					this.element.load($.proxy(this, "_load"));
				}
			}
		},

		_setOption: function(key, value) {
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		destroy: function() {
			$.Widget.prototype.destroy.call(this);
		},

		/* End Widget Overrides */

		_$canvas: null,
		_image: null,
		_oldOptions: null,

		supportsCanvas: (function() {
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		})(),
		
				
		left: function() {
			var points = [ 
				[ 0, 0 ], // top left
				[ this.options.width, this._skewLength() ], // top right
				[ 0, this.options.height ], // bottom left
				[ this.options.width, this.options.height - this._skewLength() ]  // bottom right
			];
			this._draw(points);
		},
		
		center: function() {
			var points = [ 
				[ 0, 0 ], // top left
				[ this.options.width, 0 ], // top right
				[ 0, this.options.height ], // bottom left
				[ this.options.width, this.options.height ]  // bottom right
			];
			this._draw(points);
		},
		
		right: function() {
			var points = [ 
				[ 0, this._skewLength() ], // top left
				[ this.options.width, 0 ], // top right
				[ 0, this.options.height - this._skewLength() ], // bottom left
				[ this.options.width, this.options.height ]  // bottom right
			];
			this._draw(points);
		},
		
		refresh: function (animate) {
			animate = animate || false;
			
			if (!animate) {
				this[this.options.perspective]();
			}
			else {
				this._$canvas
				.css({ 
					zIndex: this.options.canvas.zIndex,
					top: this.options.canvas.top
				})
				.animate({
					left: this.options.canvas.left
				}, {
					queue: false,
					duration: this.options.animation.slide.duration,
					easing: this.options.animation.slide.easing
				})
				.animate({
					textIndent: this.options.perspective == "center" ? 0 : this.options.angle
				}, {
					queue: false,
					duration: this.options.animation.perspective.duration,
					easing: this.options.animation.perspective.easing,
					step: $.proxy(this, "_animationStep"),
					complete: $.proxy(this, "_animationComplete")
				});
			}
		},
		
		_animationStep: function(now, fx) {
			if (fx.prop == "textIndent") {
				var perspective = this._oldOptions.perspective;
				if (perspective == "center") {
					perspective = this.options.perspective;
				}
				
				this.options.angle = now;
				this[perspective]();
			}
		},
		
		_animationComplete: function() {
			this._oldOptions = $.extend(true, {}, this.options);
			this[this.options.perspective]();
		},
		
		_skewLength: function() {
			return Math.tan(Math.degreesToRadians(this.options.angle)) * this.options.width;
		},
		
		_load: function() {
			this._image = this.element;
			this._$canvas = this.supportsCanvas
				? $('<canvas>')
					.css({
						top: this.options.canvas.top,
						left: this.options.canvas.left,
						zIndex: this.options.canvas.zIndex,
						textIndent: this.options.angle,
						position: "absolute"
					})
					.click($.proxy(this, "_click"))
				: null;
			//TODO Add no canvas support
			this.element.css({ top: -1000, left: -1000, position: "absolute" }).after(this._$canvas);
			this.refresh();
		},
		
		_click: function(e) {
			this._trigger("click", e, { image: this.element }); 
		},

		_draw: function(points) {
			// Get extents.
			var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
			$.each(points, function() {
				minX = Math.min(minX, Math.floor(this[0]));
				maxX = Math.max(maxX, Math.ceil(this[0]));
				minY = Math.min(minY, Math.floor(this[1]));
				maxY = Math.max(maxY, Math.ceil(this[1]));
			});

			minX--;
			minY--;
			maxX++;
			maxY++;
			var width = maxX - minX;
			var height = maxY - minY;

			// Reshape canvas.
			var canvas = this._$canvas[0];
			canvas.width = width;
			canvas.height = height;

			// Measure texture.
			var image = this._image[0];
			iw = image.width;
			ih = image.height;

			// Set up basic drawing context.
			ctx = canvas.getContext("2d");
			ctx.translate(-minX, -minY);
			ctx.clearRect(minX, minY, width, height);
			ctx.strokeStyle = "rgb(220,0,100)";

			transform = Matrix.getProjectiveTransform(points);

			// Begin subdivision process.
			var ptl = transform.transformProjectiveVector([ 0, 0, 1 ]);
			var ptr = transform.transformProjectiveVector([ 1, 0, 1 ]);
			var pbl = transform.transformProjectiveVector([ 0, 1, 1 ]);
			var pbr = transform.transformProjectiveVector([ 1, 1, 1 ]);

			ctx.beginPath();
			ctx.moveTo(ptl[0], ptl[1]);
			ctx.lineTo(ptr[0], ptr[1]);
			ctx.lineTo(pbr[0], pbr[1]);
			ctx.lineTo(pbl[0], pbl[1]);
			ctx.closePath();
			ctx.clip();

			this._divide(0, 0, 1, 1, ptl, ptr, pbl, pbr, this.options.subdivisionLimit);
		},
		
		_divide: function(u1, v1, u4, v4, p1, p2, p3, p4, limit) {
			// See if we can still divide.
			if (limit) {
				// Measure patch non-affinity.
				var d1 = [ p2[0] + p3[0] - 2 * p1[0], p2[1] + p3[1] - 2 * p1[1] ];
				var d2 = [ p2[0] + p3[0] - 2 * p4[0], p2[1] + p3[1] - 2 * p4[1] ];
				var d3 = [ d1[0] + d2[0], d1[1] + d2[1] ];
				var r = Math.abs((d3[0] * d3[0] + d3[1] * d3[1]) / (d1[0] * d2[0] + d1[1] * d2[1]));

				// Measure patch area.
				d1 = [ p2[0] - p1[0] + p4[0] - p3[0], p2[1] - p1[1] + p4[1] - p3[1] ];
				d2 = [ p3[0] - p1[0] + p4[0] - p2[0], p3[1] - p1[1] + p4[1] - p2[1] ];
				var area = Math.abs(d1[0] * d2[1] - d1[1] * d2[0]);

				// Check area > patchSize pixels (note factor 4 due to not averaging
				// d1 and d2)
				// The non-affinity measure is used as a correction factor.
				if ((u1 == 0 && u4 == 1) || ((.25 + r * 5) * area > (this.options.patchSize * this.options.patchSize))) {
					// Calculate subdivision points (middle, top, bottom, left,
					// right).
					var umid = (u1 + u4) / 2;
					var vmid = (v1 + v4) / 2;
					var pmid = transform.transformProjectiveVector([ umid, vmid, 1 ]);
					var pt = transform.transformProjectiveVector([ umid, v1, 1 ]);
					var pb = transform.transformProjectiveVector([ umid, v4, 1 ]);
					var pl = transform.transformProjectiveVector([ u1, vmid, 1 ]);
					var pr = transform.transformProjectiveVector([ u4, vmid, 1 ]);

					// Subdivide.
					limit--;
					this._divide(u1, v1, umid, vmid, p1, pt, pl, pmid, limit);
					this._divide(umid, v1, u4, vmid, pt, p2, pmid, pr, limit);
					this._divide(u1, vmid, umid, v4, pl, pmid, p3, pb, limit);
					this._divide(umid, vmid, u4, v4, pmid, pr, pb, p4, limit);

					return;
				}
			}

			// Render this patch.
			ctx.save();

			// Set clipping path.
			ctx.beginPath();
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			ctx.lineTo(p4[0], p4[1]);
			ctx.lineTo(p3[0], p3[1]);
			ctx.closePath();
			// ctx.clip();

			// Get patch edge vectors.
			var d12 = [ p2[0] - p1[0], p2[1] - p1[1] ];
			var d24 = [ p4[0] - p2[0], p4[1] - p2[1] ];
			var d43 = [ p3[0] - p4[0], p3[1] - p4[1] ];
			var d31 = [ p1[0] - p3[0], p1[1] - p3[1] ];

			// Find the corner that encloses the most area
			var a1 = Math.abs(d12[0] * d31[1] - d12[1] * d31[0]);
			var a2 = Math.abs(d24[0] * d12[1] - d24[1] * d12[0]);
			var a4 = Math.abs(d43[0] * d24[1] - d43[1] * d24[0]);
			var a3 = Math.abs(d31[0] * d43[1] - d31[1] * d43[0]);
			var amax = Math.max(Math.max(a1, a2), Math.max(a3, a4));
			var dx = 0, dy = 0, padx = 0, pady = 0;

			// Align the transform along this corner.
			switch (amax) {
			case a1:
				ctx.transform(d12[0], d12[1], -d31[0], -d31[1], p1[0], p1[1]);
				// Calculate 1.05 pixel padding on vector basis.
				if (u4 != 1)
					padx = 1.05 / Math.sqrt(d12[0] * d12[0] + d12[1] * d12[1]);
				if (v4 != 1)
					pady = 1.05 / Math.sqrt(d31[0] * d31[0] + d31[1] * d31[1]);
				break;
			case a2:
				ctx.transform(d12[0], d12[1], d24[0], d24[1], p2[0], p2[1]);
				// Calculate 1.05 pixel padding on vector basis.
				if (u4 != 1)
					padx = 1.05 / Math.sqrt(d12[0] * d12[0] + d12[1] * d12[1]);
				if (v4 != 1)
					pady = 1.05 / Math.sqrt(d24[0] * d24[0] + d24[1] * d24[1]);
				dx = -1;
				break;
			case a4:
				ctx.transform(-d43[0], -d43[1], d24[0], d24[1], p4[0], p4[1]);
				// Calculate 1.05 pixel padding on vector basis.
				if (u4 != 1)
					padx = 1.05 / Math.sqrt(d43[0] * d43[0] + d43[1] * d43[1]);
				if (v4 != 1)
					pady = 1.05 / Math.sqrt(d24[0] * d24[0] + d24[1] * d24[1]);
				dx = -1;
				dy = -1;
				break;
			case a3:
				// Calculate 1.05 pixel padding on vector basis.
				ctx.transform(-d43[0], -d43[1], -d31[0], -d31[1], p3[0], p3[1]);
				if (u4 != 1)
					padx = 1.05 / Math.sqrt(d43[0] * d43[0] + d43[1] * d43[1]);
				if (v4 != 1)
					pady = 1.05 / Math.sqrt(d31[0] * d31[0] + d31[1] * d31[1]);
				dy = -1;
				break;
			}

			// Calculate image padding to match.
			var du = (u4 - u1);
			var dv = (v4 - v1);
			var padu = padx * du;
			var padv = pady * dv;

			ctx.drawImage(this._image[0], u1 * iw, v1 * ih,
				Math.min(u4 - u1 + padu, 1) * iw, Math.min(v4 - v1 + padv, 1) * ih, dx, dy, 1 + padx, 1 + pady);
			ctx.restore();
		}
	});
	
	// Begin Matrix
	var Matrix = function(values) {
		this.w = !values[0] ? 0 : values[0].length;
		this.h = values.length;
		this.values = values;
	};
	
	/**
	 * Calculate a projective transform that maps [0,1]x[0,1] onto the given set of points.
	 */
	Matrix.getProjectiveTransform = function (points) {
		var eqMatrix = new Matrix(
			[
				[ 1, 1, 1, 0, 0, 0,		-points[3][0],	-points[3][0],	-points[3][0] ],
				[ 0, 1, 1, 0, 0, 0, 	0,				-points[2][0],	-points[2][0] ],
				[ 1, 0, 1, 0, 0, 0,		-points[1][0],	0,				-points[1][0] ],
				[ 0, 0, 1, 0, 0, 0,		0, 				0, 				-points[0][0] ],
				[ 0, 0, 0, -1, -1, -1,	points[3][1],	points[3][1],	points[3][1] ],
				[ 0, 0, 0, 0, -1, -1,	0,				points[2][1],	points[2][1] ],
				[ 0, 0, 0, -1, 0, -1,	points[1][1],	0,				points[1][1] ],
				[ 0, 0, 0, 0, 0, -1, 	0, 				0,				points[0][1] ]
			]);

		var kernel = eqMatrix.rowEchelon().values;
		var transform = new Matrix([
			[ -kernel[0][8], -kernel[1][8], -kernel[2][8] ],
			[ -kernel[3][8], -kernel[4][8], -kernel[5][8] ],
			[ -kernel[6][8], -kernel[7][8], 1 ]
		]);
		return transform;
	};
	
	Matrix.cloneValues = function(values) {
		clone = [];
		for ( var i = 0; i < values.length; ++i) {
			clone[i] = [].concat(values[i]);
		}
		return clone;
	};
	
	Matrix.prototype.transformProjectiveVector = function(operand) {
		var out = [];
		for ( var y = 0; y < this.h; ++y) {
			out[y] = 0;
			for ( var x = 0; x < this.w; ++x) {
				out[y] += this.values[y][x] * operand[x];
			}
		}
		var iz = 1 / (out[out.length - 1]);
		for ( var y = 0; y < this.h; ++y) {
			out[y] *= iz;
		}
		return out;
	};
	
	Matrix.prototype.rowEchelon = function() {
		if (this.w <= this.h) {
			throw "Matrix rowEchelon size mismatch";
		}
	
		var temp = Matrix.cloneValues(this.values);
	
		// Do Gauss-Jordan algorithm.
		for ( var yp = 0; yp < this.h; ++yp) {
			// Look up pivot value.
			var pivot = temp[yp][yp];
			while (pivot == 0) {
				// If pivot is zero, find non-zero pivot below.
				for ( var ys = yp + 1; ys < this.h; ++ys) {
					if (temp[ys][yp] != 0) {
						// Swap rows.
						var tmpRow = temp[ys];
						temp[ys] = temp[yp];
						temp[yp] = tmpRow;
						break;
					}
				}
				if (ys == this.h) {
					// No suitable pivot found. Abort.
					return new Matrix(temp);
				}
				else {
					pivot = temp[yp][yp];
				}
			}
	
			// Normalize this row.
			var scale = 1 / pivot;
			for ( var x = yp; x < this.w; ++x) {
				temp[yp][x] *= scale;
			}
			// Subtract this row from all other rows (scaled).
			for ( var y = 0; y < this.h; ++y) {
				if (y == yp)
					continue;
				var factor = temp[y][yp];
				temp[y][yp] = 0;
				for ( var x = yp + 1; x < this.w; ++x) {
					temp[y][x] -= factor * temp[yp][x];
				}
			}
		}
	
		return new Matrix(temp);
	};
})(jQuery);