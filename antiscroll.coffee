( ($) ->
	###
	scrollbarSize = ->
		unless @size
			div = $ """
				<div style="width:50px;height:50px;overflow:hidden;
				position:absolute;top:-200px;left:-200px;"><div style="height:100px;">
				</div>
			"""
		
			$('body').append div
		
			w1 = $('div', div).width() # fuck
			div.css 'overflow-y', 'scroll'
			w2 = $('div', div).height() # fuck
			$(div).remove()
			@size = w1 - w2
		return @size
	###
	
	scrollbarSize = ->
		`var inner = document.createElement('p');
		  inner.style.width = "100%";
		  inner.style.height = "200px";

		  var outer = document.createElement('div');
		  outer.style.position = "absolute";
		  outer.style.top = "0px";
		  outer.style.left = "0px";
		  outer.style.visibility = "hidden";
		  outer.style.width = "200px";
		  outer.style.height = "150px";
		  outer.style.overflow = "hidden";
		  outer.appendChild (inner);

		  document.body.appendChild (outer);
		  var w1 = inner.offsetWidth;
		  outer.style.overflow = 'scroll';
		  var w2 = inner.offsetWidth;
		  if (w1 == w2) w2 = outer.clientWidth;

		  document.body.removeChild (outer);

		  `
		return (w1 - w2);
	
	$.fn.antiscroll = (o) ->
		anti = null
		@each ->
			$(this).find('.antiscroll-scrollbar').remove()
			anti = new Antiscroll this, o
		return anti
	
	class Antiscroll
		constructor: (el, @o = {}) ->
			@el = $ el
			@x = @o.x isnt false
			@y = @o.y isnt false
			@padding = @o.padding || 2
			
			# console.log scrollbarSize()
			@inner = @el.find('.antiscroll-inner')
			@inner.css
				width: @inner.width() + scrollbarSize()
				height: @inner.height() + scrollbarSize()
			
			@refresh()
		
		refresh: ->
			needHScroll = @inner.get(0).scrollWidth > @el.width()
			needVScroll = @inner.get(0).scrollHeight > @el.height()
			
			if not @horizontal and needHScroll and @x
				@horizontal = new Scrollbar.Horizontal(this)
			else if @horizontal and not needHScroll
				@horizontal.destroy()
				@horizontal = null
			
			if not @vertical and needVScroll and @y
				@vertical = new Scrollbar.Vertical(this)
			else if @vertical and not needVScroll
				@vertical.destroy()
				@vertical.null
		
		destroy: ->
			@horizontal.destroy() if @horizontal
			@vertical.destroy() if @vertical
			return this
		
		rebuild: ->
			@destroy()
			@inner.attr 'style', ''
			$.Antiscroll.call this, @el, @o
			return this
		
		class Scrollbar
			constructor: (@pane) ->
				@pane.el.append(@el)
				@innerEl = @pane.inner.get 0
				@dragging = false
				@enter = false
				@shown = false
				
				###
				types = ['DOMMouseScroll', 'mousewheel']
				handler = (e) =>
					orgEvent = e or window.event
					args = [].slice.call(arguments, 1)
					delta = 0
					returnValue = true
					deltaX = 0
					deltaY = 0
					event = orgEvent
					event.type = 'mousewheel'

					# scrollwheel delta
					if event.wheelDelta then delta = event.wheelDelta / 120
					if event.detail then delta = -event.detail/3

					# multidimensional scroll (touchpads) deltas
					deltaY = delta

					# Gecko
					if orgEvent.axis and orgEvent.axis is orgEvent.HORIZONTAL_AXIS
						deltaY = 0
						deltaX = -1*delta

					# Webkit
					if orgEvent.wheelDeltaY then deltaY = orgEvent.wheelDeltaY/120
					if orgEvent.wheelDeltaX then deltaX = -1*orgEvent.wheelDeltaX/120

					# Webkit
					if orgEvent.wheelDeltaY then deltaY = orgEvent.wheelDeltaY/120
					if orgEvent.wheelDeltaX then deltaX = -1*orgEvent.wheelDeltaX/120

					# Add event and delta to the front of the arguments
					args.unshift event, delta, deltaX, deltaY

					#console.log args
					@mousewheel args
					
				if window.addEventListener
					for t in types
						window.addEventListener t, handler, false
				else
					window.onmousewheel = handler
				###
				@pane.el.mouseover =>
					@enter = true
					@show()
				@pane.el.mouseout =>
					@enter = false
					@hide() unless @dragging
				 
				@el.mousedown (e) =>
					e.preventDefault()
					@dragging = true
					@startPageY = e.pageY - parseInt(@el.css('top'), 10)
					@startPageX = e.pageX - parseInt(@el.css('left'), 10)
					
					# Prevent Crazy Selections on IE
					document.onselectstart = -> false
					
					pane = @pane
					
					$(document)
						.mousemove(@mousemove)
						.mouseup =>
							@dragging = false
							document.onselectstart = null
							$(document).unbind 'mousemove', @mousemove
							@hide unless @enter
					
				
				@pane.inner.scroll =>
					unless @shown
						@show()
						if not @dragging and not @enter
							@hiding = setTimeout(@hide, 1500)
					@update()
				
				# wheel -optional-
				# @pane.inner.bind 'mousewheel', @mousewheel
				
			destroy: ->
				@el.remove()
				return this
			
			show: (dur) ->
				unless @shown
					@update()
					@el.addClass 'antiscroll-scrollbar-shown'
					if @hiding
						clearTimeout @hiding
						@hiding = null
					@shown = true
			
			hide: =>
				if @shown
					@el.removeClass 'antiscroll-scrollbar-shown'
					@shown = false
			
		
		class Scrollbar.Horizontal extends Scrollbar
			constructor: (pane) ->
				@el = $ '<div class="antiscroll-scrollbar antiscroll-scrollbar-horizontal">'
				super pane
			
			update: ->
				paneWidth = @pane.el.width()
				trackWidth = paneWidth - @pane.padding * 2
				innerEl = @pane.inner.get 0
				@el.css
					width: trackWidth * paneWidth / innerEl.scrollWidth
					left: trackWidth * innerEl.scrollLeft / innerEl.scrollWidth
			
			mousemove: (e) =>
				trackWidth = @pane.el.width() - @pane.padding * 2
				pos = e.pageX - @startPageX
				barWidth = @el.width()
				innerEl = @pane.inner.get 0
				
				# minimum top is 0, maximum is the track height
				y = Math.min(Math.max(pos, 0), trackWidth - barWidth)
				
				innerEl.scrollLeft = (innerEl.scrollWidth - @pane.el.width()) * y / (trackWidth - barWidth)
			
			mousewheel: (e, delta, x, y) =>
				if (x < 0 and @pane.inner.get(0).scrollLeft) or (x > 0 and @innerEl.scrollLeft + @pane.el.width() is @innerEl.scrollWidth)
					e.preventDefault()
					return false
		
		class Scrollbar.Vertical extends Scrollbar
			constructor: (pane) ->
				@el = $ '<div class="antiscroll-scrollbar antiscroll-scrollbar-vertical">'
				super pane
			
			update: ->
				paneHeight = @pane.el.height()
				trackHeight = paneHeight - @pane.padding * 2
				innerEl = @innerEl
				
				@el.css
					height: trackHeight * paneHeight / innerEl.scrollHeight
					top: trackHeight * innerEl.scrollTop / innerEl.scrollHeight
			
			mousewheel: (e, delta, x, y) =>
				if (y > 0 and 0 is @innerEl.scrollTop) or (y < 0 and @innerEl.scrollTop + @pane.el.height() is @innerEl.scrollHeight)
					e.preventDefault()
					return false
			
			mousemove: (ev) =>
				`var paneHeight = this.pane.el.height()
				      , trackHeight = paneHeight - this.pane.padding * 2
				      , pos = ev.pageY - this.startPageY
				      , barHeight = this.el.height()
				      , innerEl = this.innerEl

				    // minimum top is 0, maximum is the track height
				    var y = Math.min(Math.max(pos, 0), trackHeight - barHeight)

				    innerEl.scrollTop = (innerEl.scrollHeight - paneHeight)
				      * y / (trackHeight - barHeight)`
				
				return 0
)($)