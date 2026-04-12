jQuery(function(){
	nav.init();
	$(window).on("resize", function () { nav.resize(); });
	$(window).on("scroll", function () { nav.resize(); });

	$('.goal-list .btn-close').click(function(e) {
		$(this).parent('.text-wrap').parent('div').removeClass('active');
	});
	$('.goal-list .btn.open-pop').click(function(e) {
		$(this).parent('div').addClass('active');
	});
	$(document).bind('touchmove', function (e) {
		if($('.goal-list > div').hasClass('active') == true){
			if(!$('.text-wrap').has(e.target).length) {
				$('.goal-list > div').removeClass('active');
			}
		}
	});
});

var nav = {
	gnbScrollTop: 0,
	delta: 40,
	unMob: 960,
	init: function () {
		nav.checkViewport();
		nav.headerChange();
	},
	checkViewport: function () {
		var wWidth = window.innerWidth;
		if(wWidth > nav.unMob) {
			$('body').removeClass('is-mobile');
		} else {
			$('body').addClass('is-mobile');
		}
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	},
	resize: function () {
		$(window).on("scroll", function (e) {
			var st = $(this).scrollTop();
			if (st == 0) {
				$('body').removeClass('scroll-has');
			} else {
				$('body').addClass('scroll-has');
				if(st == $(document).height() - $(window).height()){
					$('body').addClass('scroll-end');
				} else {
					$('body').removeClass('scroll-end');
				}
			}
			if (Math.abs(nav.gnbScrollTop - st) <= nav.delta) return;
			if ((st > nav.gnbScrollTop) && (nav.gnbScrollTop > 0)) {
				$('body').addClass('scroll-down').removeClass('scroll-up');
			} else {
				$('body').addClass('scroll-up').removeClass('scroll-down');
			}
			nav.gnbScrollTop = st;
		});
	},
	headerChange: function () {
		var st = $(window).scrollTop(),
			$header = $("#header"),
			headerH = $header.outerHeight();
		if (st > headerH) {
			$header.addClass("fixed");
		} else {
			$header.removeClass("fixed");
		}
	}
}
