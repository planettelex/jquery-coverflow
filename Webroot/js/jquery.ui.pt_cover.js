typeof jQuery != 'undefined' &&
typeof jQuery.ui != 'undefined' &&
(function ($) {

    Math.degreesToRadians = function (degree) {
        return degree * (Math.PI / 180);
    };

    $.widget('pt.cover', {
        /* Begin Widget Overrides */

        widgetEventPrefix: 'pt.cover',

        options: {
            id: (new Date()).getTime(),
            angle: 0,
            width: 300,
            height: 300,
            patchSize: 70,
            perspective: {
                enabled: true,
                position: "center"	// (left|center|right)
            },
            subdivisionLimit: 3,
            animation: {
                slide: {
                    duration: 900,
                    easing: "easeOutCirc"
                },
                perspective: {
                    duration: 120,
                    easing: "jswing"
                }
            },
            canvas: {
                left: 0,
                top: 0,
                zIndex: 0,
                opacity: 1
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

        _create: function () {
            this._oldOptions = $.extend(true, {}, this.options);

            // IE doesn't always invoke the load event properly!
            if (this.element[0].nodeType === 1 && this.element[0].tagName.toLowerCase() === 'img' && this.element[0].src !== '') {
                // Image is already complete, fire the _load method (fixes browser issues where cached
                // images aren't triggering the load event)
                if (this.element[0].complete || this.element[0].readyState === 4) {
                    this._load();
                }
                // Check if data URI images is supported, fire 'error' event if not
                else if (this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0) {
                    this.element.trigger('error');
                }
                else {
                    this.element.load($.proxy(this, "_load"));
                }
            }
        },

        _setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
        },

        destroy: function () {
            if (this.supportsCanvas) {
                this._$cover.remove();
                if (this.options.title.enabled) {
                    this._$titleContainer.remove();
                }
            }
            else {
                //TODO Restore image to original state.
            }
            $.Widget.prototype.destroy.call(this);
        },

        /* End Widget Overrides */

        _$cover: null,
        _oldOptions: null,
        _srcCanvas: null,
        _drawing: null,
        _$titleContainer: null,

        supportsCanvas: (function () {
            var elem = document.createElement('canvas');
            //
            return !!(elem.getContext && elem.getContext('2d'));
        })(),

        left: function () {
            var height = this._height();
            var points = [
				[0, 0], // top left
				[this.options.width, this._skewLength()], // top right
				[0, height], // bottom left
				[this.options.width, height - this._skewLength()]  // bottom right
			];
            this._draw(points);
        },

        center: function () {
            var height = this._height();
            var points = [
				[0, 0], // top left
				[this.options.width, 0], // top right
				[0, height], // bottom left
				[this.options.width, height]  // bottom right
			];
            this._draw(points);
        },

        right: function () {
            var height = this._height();
            var points = [
				[0, this._skewLength()], // top left
				[this.options.width, 0], // top right
				[0, height - this._skewLength()], // bottom left
				[this.options.width, height]  // bottom right
			];
            this._draw(points);
        },

        refresh: function (animate) {
            animate = animate || false;

            if (this.options.title.enabled) {
                switch (this.options.perspective.position) {
                    case "center":
                        this._$titleContainer.show();
                        break;

                    default:
                        this._$titleContainer.hide();
                }
            }

            if (!animate) {
                this._oldOptions = $.extend(true, {}, this.options);
                this._perspective();
                this._trigger("refreshed-" + this.options.id, null, { image: this.element });                
            }
            else {
                // Animation CSS
                this._$cover
				.css({
				    zIndex: this.options.canvas.zIndex,
				    top: this.options.canvas.top
				})
				.animate({
				    left: this.options.canvas.left,
				    opacity: this.options.canvas.opacity
				}, {
				    queue: false,
				    duration: this.options.animation.slide.duration,
				    easing: this.options.animation.slide.easing,
				    complete: $.proxy(this, "_animateLeftComplete")
				})
				.animate({
				    textIndent: this.options.perspective.position == "center" ? 0 : this.options.angle
				}, {
				    queue: false,
				    duration: this.options.animation.perspective.duration,
				    easing: this.options.animation.perspective.easing,
				    step: $.proxy(this, "_animateAngleStep"),
				    complete: $.proxy(this, "_animateAngleComplete")
				});
            }
        },

        raiseZ: function () {
            ++this.options.canvas.zIndex;
            this._$cover.css({ zIndex: this.options.canvas.zIndex });
        },

        lowerZ: function () {
            --this.options.canvas.zIndex;
            this._$cover.css({ zIndex: this.options.canvas.zIndex });
        },

        _animateAngleStep: function (now, fx) {
            if (fx.prop == "textIndent") {
                var position = this._oldOptions.perspective.position;
                if (position == "center") {
                    position = this.options.perspective.position;
                }

                this.options.angle = now;
                this._perspective(position);
            }
        },

        _animateAngleComplete: function () {
            this._oldOptions = $.extend(true, {}, this.options);
            this._perspective();
        },
        
        _animateLeftComplete: function () {
            this._trigger("refreshed-" + this.options.id, null, { image: this.element });             
        },

        _height: function () {
            var height = this.options.height;
            if (this.options.reflection.enabled) {
                height *= 2;
            }
            return height;
        },

        _skewLength: function () {
            return Math.tan(Math.degreesToRadians(this.options.angle)) * this.options.width;
        },

        _load: function () {
            this._$cover = this.element;

            if (this.supportsCanvas) {
                this._$cover = $("<canvas/>");
            }

            this._$cover.attr({
                width: this.options.width,
                height: this.options.height
            })
				.css({
				    top: this.options.canvas.top,
				    left: this.options.canvas.left,
				    zIndex: this.options.canvas.zIndex,
				    textIndent: this.options.angle,
				    position: "absolute",
				    cursor: "pointer"
				})
				.click($.proxy(this, "_click"))
				.mouseenter($.proxy(this, "_mouseenter"))
				.mouseleave($.proxy(this, "_mouseleave"));

            if (this.supportsCanvas) {
                this.element.css({ top: -1000, left: -1000, position: "absolute" }).after(this._$cover);

                this._drawing = new pt.Drawing(this._$cover[0], this.options);
                this._drawing.importImage(this.element[0]);

                if (this.options.reflection.enabled) {
                    this._drawing.addMirror();
                }

                // Keep a cached copy of the canvas to be used as a source later when applying a perspective.
                this._srcCanvas = this._drawing.cloneCanvas();
            }

            if (this.options.title.enabled) {
                this._$titleContainer = $("<div/>")
					.addClass("cover-title")
					.append($("<h1/>").text(this.element.data("title")))
					.append($("<h2/>").text(this.element.data("subtitle"))
				).hide();

                this.element.after(this._$titleContainer);
            }

            this.refresh();
        },

        _click: function (e) {
            this._trigger("click", e, { image: this.element });
        },

        _mouseenter: function (e) {
            this._trigger("mouseenter", e, { image: this.element });
        },

        _mouseleave: function (e) {
            this._trigger("mouseleave", e, { image: this.element });
        },

        _draw: function (points) {
            if (this.supportsCanvas) {
                this._drawing.perspective(points, this._srcCanvas, !this.options.reflection.enabled);
                if (this.options.reflection.enabled) {
                    this._drawing.addMirrorReflection();
                }
            }
            else {
                this._$cover.attr({
                    width: this.options.width,
                    height: this.options.height
                });
            }
        },

        _perspective: function (position) {
            position = position || this.options.perspective.position;

            if (this.options.perspective.enabled) {
                this[position]();
            }
            else {
                this.center();
            }
        }
    });

    // ReSharper disable UsageOfPossiblyUnassignedValue
    var pt = pt || {};
    // ReSharper restore UsageOfPossiblyUnassignedValue    

    pt.Drawing = function (canvas, options) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.options = $.extend({
            subdivisionLimit: 3,
            patchSize: 70,
            reflection: {
                initialOpacity: 50,
                length: 80
            }
        }, options);

        this.transform = null;
        this.iw = 0;
        this.ih = 0;
    };

    pt.Drawing.prototype.cloneCanvas = function () {
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var cloneCanvas = document.createElement("canvas");
        cloneCanvas.width = this.canvas.width;
        cloneCanvas.height = this.canvas.height;
        var cloneCtx = cloneCanvas.getContext("2d");
        cloneCtx.putImageData(imageData, 0, 0);

        return cloneCanvas;
    };

    pt.Drawing.prototype.importImage = function (img) {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };

    pt.Drawing.prototype.perspective = function (points, srcImage, clipImage) {
        this.image = srcImage || this.cloneCanvas();

        // Get extents.
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        $.each(points, function () {
            minX = Math.min(minX, Math.floor(this[0]));
            maxX = Math.max(maxX, Math.ceil(this[0]));
            minY = Math.min(minY, Math.floor(this[1]));
            maxY = Math.max(maxY, Math.ceil(this[1]));
        });

        var width = maxX - minX;
        var height = maxY - minY;

        // Reshape canvas.
        this.canvas.width = width;
        this.canvas.height = height;

        // Measure texture.
        this.iw = this.image.width;
        this.ih = this.image.height;

        // Set up basic drawing context.
        this.ctx.translate(-minX, -minY);
        this.ctx.clearRect(minX, minY, width, height);

        this.transform = matrix.getProjectiveTransform(points);

        // Begin subdivision process.
        var ptl = this.transform.transformProjectiveVector([0, 0, 1]);
        var ptr = this.transform.transformProjectiveVector([1, 0, 1]);
        var pbl = this.transform.transformProjectiveVector([0, 1, 1]);
        var pbr = this.transform.transformProjectiveVector([1, 1, 1]);

        if (clipImage) {
            this.ctx.beginPath();
            this.ctx.moveTo(ptl[0], ptl[1]);
            this.ctx.lineTo(ptr[0], ptr[1]);
            this.ctx.lineTo(pbr[0], pbr[1]);
            this.ctx.lineTo(pbl[0], pbl[1]);
            this.ctx.closePath();
            this.ctx.clip();
        }

        this.divide(0, 0, 1, 1, ptl, ptr, pbl, pbr, this.options.subdivisionLimit);
    };

    pt.Drawing.prototype.addMirror = function () {
        // Set up the canvas clone to be used as a source for the mirror image.
        var cloneCanvas = this.cloneCanvas();

        // Add original image to the taller canvas.
        this.canvas.height *= 2;  // Make space for the mirror image
        this.ctx.drawImage(cloneCanvas, 0, 0);
        this.ctx.save();

        // Add the mirror image below original image.
        this.ctx.translate(0, this.canvas.height);
        this.ctx.scale(1, -1);
        this.ctx.drawImage(cloneCanvas, 0, 0);
        this.ctx.restore();
    };

    pt.Drawing.prototype.addMirrorReflection = function () {
        var startY = Math.floor(this.canvas.height / 2);

        // Add the reflection gradient over the second half of the image.
        var opacity = this.options.reflection.initialOpacity / 100;
        var length = this.options.reflection.length / 100;

        this.ctx.save();
        this.ctx.globalCompositeOperation = "destination-out";
        var gradient = this.ctx.createLinearGradient(0, startY, 0, this.canvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - opacity) + ")");
        gradient.addColorStop(length, "rgba(255, 255, 255, 1.0)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
        this.ctx.fillStyle = gradient;
        this.ctx.rect(0, startY, this.canvas.width, startY);
        this.ctx.fill();
        this.ctx.restore();
    };

    pt.Drawing.prototype.divide = function (u1, v1, u4, v4, p1, p2, p3, p4, limit) {
        // See if we can still divide.
        if (limit) {
            // Measure patch non-affinity.
            var d1 = [p2[0] + p3[0] - 2 * p1[0], p2[1] + p3[1] - 2 * p1[1]];
            var d2 = [p2[0] + p3[0] - 2 * p4[0], p2[1] + p3[1] - 2 * p4[1]];
            var d3 = [d1[0] + d2[0], d1[1] + d2[1]];
            var r = Math.abs((d3[0] * d3[0] + d3[1] * d3[1]) / (d1[0] * d2[0] + d1[1] * d2[1]));

            // Measure patch area.
            d1 = [p2[0] - p1[0] + p4[0] - p3[0], p2[1] - p1[1] + p4[1] - p3[1]];
            d2 = [p3[0] - p1[0] + p4[0] - p2[0], p3[1] - p1[1] + p4[1] - p2[1]];
            var area = Math.abs(d1[0] * d2[1] - d1[1] * d2[0]);

            // Check area > patchSize pixels (note factor 4 due to not averaging
            // d1 and d2)
            // The non-affinity measure is used as a correction factor.
            if ((u1 == 0 && u4 == 1) || ((.25 + r * 5) * area > (this.options.patchSize * this.options.patchSize))) {
                // Calculate subdivision points (middle, top, bottom, left, right).
                var umid = (u1 + u4) / 2;
                var vmid = (v1 + v4) / 2;
                var pmid = this.transform.transformProjectiveVector([umid, vmid, 1]);
                var pt1 = this.transform.transformProjectiveVector([umid, v1, 1]);
                var pb = this.transform.transformProjectiveVector([umid, v4, 1]);
                var pl = this.transform.transformProjectiveVector([u1, vmid, 1]);
                var pr = this.transform.transformProjectiveVector([u4, vmid, 1]);

                // Subdivide.
                limit--;
                this.divide(u1, v1, umid, vmid, p1, pt1, pl, pmid, limit);
                this.divide(umid, v1, u4, vmid, pt1, p2, pmid, pr, limit);
                this.divide(u1, vmid, umid, v4, pl, pmid, p3, pb, limit);
                this.divide(umid, vmid, u4, v4, pmid, pr, pb, p4, limit);

                return;
            }
        }

        // Render this patch.
        this.ctx.save();

        // Set clipping path.
        this.ctx.beginPath();
        this.ctx.moveTo(p1[0], p1[1]);
        this.ctx.lineTo(p2[0], p2[1]);
        this.ctx.lineTo(p4[0], p4[1]);
        this.ctx.lineTo(p3[0], p3[1]);
        this.ctx.closePath();

        // Get patch edge vectors.
        var d12 = [p2[0] - p1[0], p2[1] - p1[1]];
        var d24 = [p4[0] - p2[0], p4[1] - p2[1]];
        var d43 = [p3[0] - p4[0], p3[1] - p4[1]];
        var d31 = [p1[0] - p3[0], p1[1] - p3[1]];

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
                this.ctx.transform(d12[0], d12[1], -d31[0], -d31[1], p1[0], p1[1]);
                // Calculate 1.05 pixel padding on vector basis.
                if (u4 != 1)
                    padx = 1.05 / Math.sqrt(d12[0] * d12[0] + d12[1] * d12[1]);
                if (v4 != 1)
                    pady = 1.05 / Math.sqrt(d31[0] * d31[0] + d31[1] * d31[1]);
                break;
            case a2:
                this.ctx.transform(d12[0], d12[1], d24[0], d24[1], p2[0], p2[1]);
                // Calculate 1.05 pixel padding on vector basis.
                if (u4 != 1)
                    padx = 1.05 / Math.sqrt(d12[0] * d12[0] + d12[1] * d12[1]);
                if (v4 != 1)
                    pady = 1.05 / Math.sqrt(d24[0] * d24[0] + d24[1] * d24[1]);
                dx = -1;
                break;
            case a4:
                this.ctx.transform(-d43[0], -d43[1], d24[0], d24[1], p4[0], p4[1]);
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
                this.ctx.transform(-d43[0], -d43[1], -d31[0], -d31[1], p3[0], p3[1]);
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

        this.ctx.drawImage(this.image, u1 * this.iw, v1 * this.ih,
			Math.min(u4 - u1 + padu, 1) * this.iw, Math.min(v4 - v1 + padv, 1) * this.ih, dx, dy, 1 + padx, 1 + pady);
        this.ctx.restore();
    };

    // Begin Matrix
    var matrix = function (values) {
        this.w = !values[0] ? 0 : values[0].length;
        this.h = values.length;
        this.values = values;
    };

    /**
    * Calculate a projective transform that maps [0,1]x[0,1] onto the given set of points.
    */
    matrix.getProjectiveTransform = function (points) {
        var eqMatrix = new matrix(
			[
				[1, 1, 1, 0, 0, 0, -points[3][0], -points[3][0], -points[3][0]],
				[0, 1, 1, 0, 0, 0, 0, -points[2][0], -points[2][0]],
				[1, 0, 1, 0, 0, 0, -points[1][0], 0, -points[1][0]],
				[0, 0, 1, 0, 0, 0, 0, 0, -points[0][0]],
				[0, 0, 0, -1, -1, -1, points[3][1], points[3][1], points[3][1]],
				[0, 0, 0, 0, -1, -1, 0, points[2][1], points[2][1]],
				[0, 0, 0, -1, 0, -1, points[1][1], 0, points[1][1]],
				[0, 0, 0, 0, 0, -1, 0, 0, points[0][1]]
			]);

        var kernel = eqMatrix.rowEchelon().values;
        var transform = new matrix([
			[-kernel[0][8], -kernel[1][8], -kernel[2][8]],
			[-kernel[3][8], -kernel[4][8], -kernel[5][8]],
			[-kernel[6][8], -kernel[7][8], 1]
		]);
        return transform;
    };

    matrix.cloneValues = function (values) {
        var clone = [];
        for (var i = 0; i < values.length; ++i) {
            clone[i] = [].concat(values[i]);
        }
        return clone;
    };

    matrix.prototype.transformProjectiveVector = function (operand) {
        var out = [];
        var y;
        for (y = 0; y < this.h; ++y) {
            out[y] = 0;
            for (var x = 0; x < this.w; ++x) {
                out[y] += this.values[y][x] * operand[x];
            }
        }
        var iz = 1 / (out[out.length - 1]);
        for (y = 0; y < this.h; ++y) {
            out[y] *= iz;
        }
        return out;
    };

    matrix.prototype.rowEchelon = function () {
        if (this.w <= this.h) {
            throw "Matrix rowEchelon size mismatch";
        }

        var temp = matrix.cloneValues(this.values);

        // Do Gauss-Jordan algorithm.
        for (var yp = 0; yp < this.h; ++yp) {
            // Look up pivot value.
            var pivot = temp[yp][yp];
            while (pivot == 0) {
                // If pivot is zero, find non-zero pivot below.
                for (var ys = yp + 1; ys < this.h; ++ys) {
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
                    return new matrix(temp);
                }
                else {
                    pivot = temp[yp][yp];
                }
            }

            // Normalize this row.
            var scale = 1 / pivot;
            var x;
            for (x = yp; x < this.w; ++x) {
                temp[yp][x] *= scale;
            }
            // Subtract this row from all other rows (scaled).
            for (var y = 0; y < this.h; ++y) {
                if (y == yp)
                    continue;
                var factor = temp[y][yp];
                temp[y][yp] = 0;
                for (x = yp + 1; x < this.w; ++x) {
                    temp[y][x] -= factor * temp[yp][x];
                }
            }
        }

        return new matrix(temp);
    };
})(jQuery);