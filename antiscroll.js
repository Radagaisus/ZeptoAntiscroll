(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($) {
    var Antiscroll;
    $.fn.antiscroll = function(o) {
      var anti;
      anti = null;
      this.each(function() {
        return anti = new Antiscroll(this, o);
      });
      return anti;
    };
    return Antiscroll = (function() {
      var Scrollbar, scrollbarSize;

      function Antiscroll(el, o) {
        this.o = o != null ? o : {};
        this.el = $(el);
        this.x = this.o.x !== false;
        this.y = this.o.y !== false;
        this.padding = this.o.padding || 2;
        this.inner = this.el.find('.antiscroll-inner').css({
          width: "+=" + (scrollbarSize()),
          height: "+=" + (scrollbarSize())
        });
        this.refresh();
      }

      Antiscroll.prototype.refresh = function() {
        var needHScroll, needVScroll;
        needHScroll = this.inner.get(0).scrollWidth > this.el.width();
        needVScroll = this.inner.get(0).scrollHeight > this.el.height();
        if (!this.horizontal && needHScroll && this.x) {
          this.horizontal = new Scrollbar.Horizontal(this);
        } else if (this.horizontal && !needHScroll) {
          this.horizontal.destroy();
          this.horizontal = null;
        }
        if (!this.vertical && needVScroll && this.y) {
          return this.vertical = new Scrollbar.Vertical(this);
        } else if (this.vertical && !needVScroll) {
          this.vertical.destroy();
          return this.vertical["null"];
        }
      };

      Antiscroll.prototype.destroy = function() {
        if (this.horizontal) this.horizontal.destroy();
        if (this.vertical) this.vertical.destroy();
        return this;
      };

      Antiscroll.prototype.rebuild = function() {
        this.destroy();
        this.inner.attr('style', '');
        $.Antiscroll.call(this, this.el, this.o);
        return this;
      };

      Scrollbar = (function() {

        function Scrollbar(pane) {
          var handler, t, types, _i, _len,
            _this = this;
          this.pane = pane;
          this.hide = __bind(this.hide, this);
          this.pane.el.append(this.el);
          this.innerEl = this.pane.inner.get(0);
          this.dragging = false;
          this.enter = false;
          this.shown = false;
          types = ['DOMMouseScroll', 'mousewheel'];
          handler = function(e) {
            var args, delta, deltaX, deltaY, event, orgEvent, returnValue;
            orgEvent = e || window.event;
            args = [].slice.call(arguments, 1);
            delta = 0;
            returnValue = true;
            deltaX = 0;
            deltaY = 0;
            event = orgEvent;
            event.type = 'mousewheel';
            if (event.wheelDelta) delta = event.wheelDelta / 120;
            if (event.detail) delta = -event.detail / 3;
            deltaY = delta;
            if (orgEvent.axis && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
              deltaY = 0;
              deltaX = -1 * delta;
            }
            if (orgEvent.wheelDeltaY) deltaY = orgEvent.wheelDeltaY / 120;
            if (orgEvent.wheelDeltaX) deltaX = -1 * orgEvent.wheelDeltaX / 120;
            if (orgEvent.wheelDeltaY) deltaY = orgEvent.wheelDeltaY / 120;
            if (orgEvent.wheelDeltaX) deltaX = -1 * orgEvent.wheelDeltaX / 120;
            args.unshift(event, delta, deltaX, deltaY);
            return _this.mousewheel(args);
          };
          if (window.addEventListener) {
            for (_i = 0, _len = types.length; _i < _len; _i++) {
              t = types[_i];
              window.addEventListener(t, handler, false);
            }
          } else {
            window.onmousewheel = handler;
          }
          this.pane.el.mouseover(function() {
            _this.enter = true;
            return _this.show();
          });
          this.pane.el.mouseout(function() {
            _this.enter = false;
            if (!_this.dragging) return _this.hide();
          });
          this.el.mousedown(function(e) {
            e.preventDefault();
            _this.dragging = true;
            _this.startPageY = e.pageY - parseInt(_this.el.css('top'), 10);
            _this.startPageX = e.pageX - parseInt(_this.el.css('left'), 10);
            document.onselectstart = function() {
              return false;
            };
            pane = _this.pane;
            return $(document).mousemove(_this.mousemove).mouseup(function() {
              _this.dragging = false;
              document.onselectstart = null;
              $(document).unbind('mousemove', _this.mousemove);
              if (!_this.enter) return _this.hide;
            });
          });
          this.pane.inner.scroll(function() {
            if (!_this.shown) {
              _this.show();
              if (!_this.dragging && !_this.enter) {
                _this.hiding = setTimeout(_this.hide, 1500);
              }
            }
            return _this.update();
          });
        }

        Scrollbar.prototype.destroy = function() {
          this.el.remove();
          return this;
        };

        Scrollbar.prototype.show = function(dur) {
          if (!this.shown) {
            this.update();
            this.el.addClass('antiscroll-scrollbar-shown');
            if (this.hiding) {
              clearTimeout(this.hiding);
              this.hiding = null;
            }
            return this.shown = true;
          }
        };

        Scrollbar.prototype.hide = function() {
          if (this.shown) {
            this.el.removeClass('antiscroll-scrollbar-shown');
            return this.shown = false;
          }
        };

        return Scrollbar;

      })();

      Scrollbar.Horizontal = (function(_super) {

        __extends(Horizontal, _super);

        function Horizontal(pane) {
          this.mousewheel = __bind(this.mousewheel, this);
          this.mousemove = __bind(this.mousemove, this);          this.el = $('<div class="antiscroll-scrollbar antiscroll-scrollbar-horizontal">');
          Horizontal.__super__.constructor.call(this, pane);
        }

        Horizontal.prototype.update = function() {
          var innerEl, paneWidth, trackWidth;
          paneWidth = this.pane.el.width();
          trackWidth = paneWidth - this.pane.padding * 2;
          innerEl = this.pane.inner.get(0);
          return this.el.css({
            width: trackWidth * paneWidth / innerEl.scrollWidth,
            left: trackWidth * innerEl.scrollLeft / innerEl.scrollWidth
          });
        };

        Horizontal.prototype.mousemove = function(e) {
          var barWidth, innerEl, pos, trackWidth, y;
          trackWidth = this.pane.el.width() - this.pane.padding * 2;
          pos = e.pageX - this.startPageX;
          barWidth = this.el.width();
          innerEl = this.pane.inner.get(0);
          y = Math.min(Math.max(pos, 0), trackWidth - barWidth);
          return innerEl.scrollLeft = (innerEl.scrollWidth - this.pane.el.width()) * y / (trackWidth - barWidth);
        };

        Horizontal.prototype.mousewheel = function(e, delta, x, y) {
          if ((x < 0 && this.pane.inner.get(0).scrollLeft) || (x > 0 && this.innerEl.scrollLeft + this.pane.el.width() === this.innerEl.scrollWidth)) {
            e.preventDefault();
            return false;
          }
        };

        return Horizontal;

      })(Scrollbar);

      Scrollbar.Vertical = (function(_super) {

        __extends(Vertical, _super);

        function Vertical(pane) {
          this.mousemove = __bind(this.mousemove, this);
          this.mousewheel = __bind(this.mousewheel, this);          this.el = $('<div class="antiscroll-scrollbar antiscroll-scrollbar-vertical">');
          Vertical.__super__.constructor.call(this, pane);
        }

        Vertical.prototype.update = function() {
          var innerEl, paneHeight, trackHeight;
          paneHeight = this.pane.el.height();
          trackHeight = paneHeight - this.pane.padding * 2;
          innerEl = this.innerEl;
          return this.el.css({
            height: trackHeight * paneHeight / innerEl.scrollHeight,
            top: trackHeight * innerEl.scrollTop / innerEl.scrollHeight
          });
        };

        Vertical.prototype.mousewheel = function(e, delta, x, y) {
          if ((y > 0 && 0 === this.innerEl.scrollTop) || (y < 0 && this.innerEl.scrollTop + this.pane.el.height() === this.innerEl.scrollHeight)) {
            e.preventDefault();
            return false;
          }
        };

        Vertical.prototype.mousemove = function(ev) {
          var paneHeight = this.pane.el.height()
				      , trackHeight = paneHeight - this.pane.padding * 2
				      , pos = ev.pageY - this.startPageY
				      , barHeight = this.el.height()
				      , innerEl = this.innerEl

				    // minimum top is 0, maximum is the track height
				    var y = Math.min(Math.max(pos, 0), trackHeight - barHeight)

				    innerEl.scrollTop = (innerEl.scrollHeight - paneHeight)
				      * y / (trackHeight - barHeight);          return 0;
        };

        return Vertical;

      })(Scrollbar);

      scrollbarSize = function() {
        var div, w1, w2;
        if (!this.size) {
          div = $("<div style=\"width:50px;height:50px;overflow:hidden;\nposition:absolute;top:-200px;left:-200px;\"><div style=\"height:100px;\">\n</div>");
          $('body').append(div);
          w1 = $('div', div).width();
          div.css('overflow-y', 'scroll');
          w2 = $('div', div).width();
          $(div).remove();
          this.size = w1 - w2;
        }
        return this.size;
      };

      return Antiscroll;

    }).call(this);
  })(Zepto);

}).call(this);
