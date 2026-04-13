jQuery(function () {
	gsap.registerPlugin(ScrollTrigger);

	// ============================================
	// CANVAS FRAME ANIMATION SETUP
	// ============================================

	// Helper: create canvas frame animation (lazy — images load on demand)
	function createFrameAnim(canvasId, width, height, frameCount, framePath, sharedImages) {
		var canvas = document.getElementById(canvasId);
		if (!canvas) return null;
		var ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		var images = sharedImages || [];
		var loaded = sharedImages ? true : false;
		var state = { frame: 0 };
		function loadFrames() {
			if (loaded) return;
			loaded = true;
			for (var i = 0; i < frameCount; i++) {
				var img = new Image();
				img.src = framePath(i);
				images.push(img);
			}
		}
		function render() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			var img = images[state.frame];
			if (img && img.complete && img.naturalWidth > 0) {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			}
		}
		return { canvas: canvas, ctx: ctx, images: images, state: state, render: render, frameCount: frameCount, loadFrames: loadFrames };
	}

	// Smile character (green, sitting)
	var smile = createFrameAnim("3d_Smile", 500, 500, 121, function(i) {
		return "./@resource/images/char-smile/smile_" + (i + 1) + ".webp";
	});

	// Blink character (pink, blinking)
	var blink = createFrameAnim("3d_Blink", 500, 500, 121, function(i) {
		return "./@resource/images/char-blink/blink_" + (i + 1) + ".webp";
	});

	// Yawn character (green, yawning)
	var yawn = createFrameAnim("3d_Yawn", 500, 500, 121, function(i) {
		return "./@resource/images/char-yawn/yawn_" + (i + 1) + ".webp";
	});

	// Group (5 characters hugging)
	var group = createFrameAnim("3d_Group", 500, 500, 121, function(i) {
		return "./@resource/images/char-group/group_" + (i + 1) + ".webp";
	});

	// SmileCard — shares smile's images array (no duplicate download)
	var smileCard = smile ? createFrameAnim("3d_SmileCard", 500, 500, 121, null, smile.images) : null;

	// Character for Together — shares group's images array
	var character = group ? createFrameAnim("3d_Character", 500, 500, 121, null, group.images) : null;

	// ============================================
	// SMOOTH SCROLLBAR + SCROLLTRIGGER
	// ============================================
	setTimeout(function() {
		var scroller = document.querySelector('.scroller');
		var bodyScrollBar = Scrollbar.init(scroller, {
			damping: 0.1,
			mobile: { speed: 2 }
		});
		bodyScrollBar.setPosition(0, 0);
		bodyScrollBar.track.xAxis.element.remove();
		ScrollTrigger.scrollerProxy(scroller, {
			scrollTop: function(value) {
				if (arguments.length) {
					bodyScrollBar.scrollTop = value;
				}
				return bodyScrollBar.scrollTop;
			}
		});
		bodyScrollBar.addListener(ScrollTrigger.update);
		ScrollTrigger.defaults({ scroller: scroller });

		// ============================================
		// HEADER LOGO ANIMATION
		// ============================================
		gsap.set(".header", { top: "3%" });

		gsap.timeline({
			ease: "none",
			scrollTrigger: {
				trigger: ".anniversary",
				start: "top 3%",
				end: "top bottom",
				scrub: true,
				pinType: "transform",
				invalidateOnRefresh: true,
				onEnter: function () { $(".header").addClass("show"); },
				onEnterBack: function () { $(".header").removeClass("show"); },
			}
		});
		gsap.timeline({
			ease: "none",
			scrollTrigger: {
				trigger: ".anniversary",
				start: "top 3%",
				end: "top bottom",
				scrub: true,
				pinType: "transform",
				invalidateOnRefresh: true,
				onEnter: function () { $(".header").addClass("change"); },
				onEnterBack: function () { $(".header").removeClass("change"); },
			}
		});
		gsap.timeline({
			scrollTrigger: {
				trigger: '.anniversary',
				start: "bottom 0%",
				end: "top bottom",
				pinType: "transform",
				invalidateOnRefresh: true,
				onEnter: function () { $('.header').addClass('sticky'); },
				onEnterBack: function () { $('.header').removeClass('sticky'); },
			}
		});

		// Scroll title horizontal movement
		gsap.utils.toArray(".anniversary .scroll-title").forEach(function(scrollTitle, index) {
			var w = scrollTitle.querySelector(".title");
			var x = w.scrollWidth / 1;
			var xEnd = 0;
			gsap.fromTo(w, { x: x }, {
				x: xEnd,
				scrollTrigger: {
					trigger: scrollTitle,
					start: "top 100%",
					end: "top 3%",
					scrub: 1,
					invalidateOnRefresh: true,
					scroller: scroller,
					pinType: "transform",
				}
			});
		});

		gsap.timeline({
			scrollTrigger: {
				trigger: ".anniversary",
				start: "top 3%",
				end: "top bottom",
				invalidateOnRefresh: true,
				onEnter: function () { $(".anniversary").addClass("hide"); },
				onEnterBack: function () { $(".anniversary").removeClass("hide"); },
			}
		});

		// Header logo size reduction
		ScrollTrigger.matchMedia({
			"(min-width: 769px)": function () {
				gsap.timeline({
					ease: "none",
					scrollTrigger: { trigger: ".anniversary", start: "top 3%", scrub: true, pinType: "transform", invalidateOnRefresh: true }
				}).to(".header .logo", { fontSize: "24px" });
				gsap.timeline({
					ease: "none",
					scrollTrigger: { trigger: ".anniversary", start: "top 3%", scrub: true, invalidateOnRefresh: true }
				}).to(".header", { top: "24px" });
			},
			"(max-width: 768px)": function () {
				gsap.timeline({
					ease: "none",
					scrollTrigger: { trigger: ".anniversary", start: "top 3%", scrub: 1, invalidateOnRefresh: true }
				}).to(".header .logo", { fontSize: "18px" });
				gsap.timeline({
					ease: "none",
					scrollTrigger: { trigger: ".anniversary", start: "top 3%", scrub: true, invalidateOnRefresh: true }
				}).to(".header", { top: "20px" });
			}
		});

		// ============================================
		// TAGS ANIMATION
		// ============================================
		gsap.utils.toArray(".tag").forEach(function (t) {
			gsap.set(t, { autoAlpha: 1 });
			t.addEventListener('mouseover', function() {
				gsap.to(t, { scale: 1.5, autoAlpha: 0, duration: 0.5, ease: "power2.out" });
			});
		});

		gsap.set(".tags .gutter", { yPercent: 80 });
		gsap.timeline({
			scrollTrigger: { trigger: ".tags .gutter", scrub: 3, start: "top bottom", end: "top 0%", ease: "power2.out" }
		}).to(".tags .gutter", { yPercent: 0, duration: 1 });

		gsap.timeline({
			scrollTrigger: { trigger: ".tags", start: "top top", end: "100% top", scrub: .5 }
		}).to(".bg-gradient", { yPercent: -85, duration: 1 }, 0);

		// ============================================
		// GOAL HORIZONTAL SCROLL (3 character cards)
		// ============================================
		var goal_container = document.querySelector(".goal .h-scroll");
		var goal_panel = gsap.utils.toArray(".goal .h-scroll > div");
		var goal_scroll = gsap.timeline({
			scrollTrigger: {
				pin: true, scrub: 1, start: "top top", trigger: ".goal .h-scroll",
				invalidateOnRefresh: true, scroller: scroller, pinType: "transform",
				end: function() { return "+=" + (goal_container.scrollWidth - document.documentElement.clientWidth); },
			}
		});
		goal_scroll.to(goal_panel, {
			x: function() { return -(goal_container.scrollWidth - document.documentElement.clientWidth) + "px"; },
			duration: 1, ease: "none",
		});
		goal_scroll.to({}, { duration: 0.2 });

		// Character canvas animations triggered by scroll
		// Preload triggers — start downloading frames before section is visible
		if (smile) {
			ScrollTrigger.create({ trigger: ".goal", start: "top 150%", once: true, onEnter: function() { smile.loadFrames(); } });
		}
		if (blink) {
			ScrollTrigger.create({ trigger: ".goal", start: "top 150%", once: true, onEnter: function() { blink.loadFrames(); } });
		}
		if (yawn) {
			ScrollTrigger.create({ trigger: ".goal", start: "top 150%", once: true, onEnter: function() { yawn.loadFrames(); } });
		}
		if (group) {
			ScrollTrigger.create({ trigger: ".make", start: "top 150%", once: true, onEnter: function() { group.loadFrames(); } });
		}

		if (smile) {
			gsap.to(smile.state, {
				frame: smile.frameCount - 1, snap: "frame", repeat: -1, ease: "none", duration: 5,
				scrollTrigger: {
					trigger: ".goal-list",
					start: "top 100%",
					onEnter: function () { $(".smile").addClass("on"); },
					onEnterBack: function () { $(".smile").addClass("on"); },
					onLeave: function () { $(".smile").removeClass("on"); },
					onLeaveBack: function () { $(".smile").removeClass("on"); },
				},
				onUpdate: smile.render
			});
		}

		if (blink) {
			gsap.to(blink.state, {
				frame: blink.frameCount - 1, snap: "frame", repeat: -1, ease: "none", duration: 5,
				scrollTrigger: {
					trigger: ".blink", start: "left 120%", end: "right -10%", containerAnimation: goal_scroll,
					onEnter: function () { $(".blink").addClass("on"); },
					onEnterBack: function () { $(".blink").addClass("on"); },
					onLeave: function () { $(".blink").removeClass("on"); },
					onLeaveBack: function () { $(".blink").removeClass("on"); },
				},
				onUpdate: blink.render
			});
		}

		if (yawn) {
			gsap.to(yawn.state, {
				frame: yawn.frameCount - 1, snap: "frame", repeat: -1, ease: "none", duration: 5,
				scrollTrigger: {
					trigger: ".yawn", start: "left 120%", end: "right -10%", containerAnimation: goal_scroll,
					onEnter: function () { $(".yawn").addClass("on"); },
					onEnterBack: function () { $(".yawn").addClass("on"); },
					onLeave: function () { $(".yawn").removeClass("on"); },
					onLeaveBack: function () { $(".yawn").removeClass("on"); },
				},
				onUpdate: yawn.render
			});
		}

		// ============================================
		// MAKE SECTION
		// ============================================
		gsap.set(".make .text-wrap", { yPercent: 60 });
		gsap.timeline({
			scrollTrigger: { trigger: ".make .text-wrap", scrub: 2, start: "top bottom", end: "top 0%", ease: "power2.out" }
		}).to(".make .text-wrap", { yPercent: 0, duration: 1 });

		// Group character in cat position
		if (group) {
			gsap.to(group.state, {
				frame: group.frameCount - 1, snap: "frame", repeat: -1, ease: "none", duration: 5,
				scrollTrigger: {
					trigger: ".cat",
					start: "top 80%",
					end: "bottom 100%",
					scrub: 1,
					onEnter: function () { $(".cat").addClass("show").addClass("on"); },
					onEnterBack: function () { $(".cat").removeClass("show"); },
				},
				onUpdate: group.render
			});
		}

		// SmileCard in card section
		if (smileCard) {
			gsap.to(smileCard.state, {
				frame: smileCard.frameCount - 1, snap: "frame", repeat: -1, ease: "none", duration: 5,
				scrollTrigger: {
					trigger: ".make .card",
					start: "top bottom",
					onEnter: function () { $(".make .card").addClass("on"); },
					onLeaveBack: function () { $(".make .card").removeClass("on"); },
				},
				onUpdate: smileCard.render
			});
		}

		// Scroll title "REDEFINE YOUR CONFIDENCE"
		gsap.utils.toArray(".scroll-title.long").forEach(function(section, index) {
			var w = section.querySelector(".title");
			var x = w.scrollWidth / 1;
			var xEnd = 0;
			gsap.fromTo(w, { x: x }, {
				x: xEnd,
				scrollTrigger: { trigger: section, start: "top 100%", end: "top 10%", scrub: 2, invalidateOnRefresh: true }
			});
		});

		// ============================================
		// PLAN-B SECTION
		// ============================================
		gsap.set(".plan-b .text-wrap", { yPercent: 60 });
		gsap.timeline({
			scrollTrigger: { trigger: ".plan-b .text-wrap", scrub: 2, start: "top bottom", end: "top 0%", ease: "power2.out" }
		}).to(".plan-b .text-wrap", { yPercent: 0, duration: 1 });

		gsap.set(".plan-b .img-wrap", { yPercent: 20 });
		gsap.timeline({
			scrollTrigger: { trigger: ".plan-b .img-wrap", scrub: 3, start: "top bottom", end: "top 15%", ease: "power2.out" }
		}).to(".plan-b .img-wrap", { yPercent: 0, duration: 1 });

		// ============================================
		// KIT / ENVIRONMENT HORIZONTAL SCROLL
		// ============================================
		var kit_container = document.querySelector(".kit .h-scroll");
		var kit_panel = gsap.utils.toArray(".kit .h-scroll > div");
		var kit_scroll = gsap.timeline({
			scrollTrigger: {
				pin: true, scrub: 2, start: "top top", trigger: ".kit .h-scroll",
				invalidateOnRefresh: true, scroller: scroller, pinType: "transform",
				end: function() { return "+=" + (kit_container.scrollWidth - document.documentElement.clientWidth); },
			}
		});
		kit_scroll.to(kit_panel, {
			x: function() { return -(kit_container.scrollWidth - document.documentElement.clientWidth) + "px"; },
			duration: 1, ease: "none",
		});
		kit_scroll.to({}, { duration: 0.2 });

		// Kit text parallax
		ScrollTrigger.matchMedia({
			"(min-width: 769px)": function () {
				gsap.set(".kit .text-wrap", { yPercent: 0 });
				gsap.timeline({
					scrollTrigger: { trigger: ".kit .text-wrap", scrub: 2, start: "top 150%", end: "top 70%", ease: "power2.out" }
				}).to(".kit .text-wrap", { yPercent: -10, duration: 1 });
			},
			"(max-width: 768px)": function () {
				gsap.set(".kit .text-wrap", { yPercent: 30 });
				gsap.timeline({
					scrollTrigger: { trigger: ".kit .text-wrap", scrub: 2, start: "top bottom", end: "top top", ease: "power2.out" }
				}).to(".kit .text-wrap", { yPercent: 0, duration: 1 });
			}
		});

		// Digital kit scroll title
		gsap.utils.toArray(".scroll-title.short").forEach(function(section2, index) {
			var w = section2.querySelector(".title");
			var x = w.scrollWidth / 1;
			var xEnd = 0;
			gsap.fromTo(w, { x: x }, {
				x: xEnd,
				scrollTrigger: { trigger: section2, start: "top 100%", end: "top 10%", scrub: 2 }
			});
		});

		// Digital kit list animation
		var yPercent_vh = function(coef) { return window.innerHeight * (coef/100); };
		ScrollTrigger.matchMedia({
			"(min-width: 769px)": function () {
				var dKit = gsap.timeline({
					scrollTrigger: { scrub: 1.5, trigger: ".digital-kit", pin: true, pinSpacing: true, start: "top 0%", end: "+=230%" }
				});
				dKit.to(".kit-list > li:nth-child(1)", { yPercent: yPercent_vh(-40), duration: 1.5 }, "-=1")
					.to(".kit-list > li:nth-child(2)", { yPercent: yPercent_vh(-40), duration: 1.5 }, "-=1")
					.to(".kit-list > li:nth-child(3)", { yPercent: yPercent_vh(-40), duration: 1.5 }, "-=1");
			},
			"(max-width: 768px)": function () {
				var dKit = gsap.timeline({
					scrollTrigger: { scrub: 1.5, trigger: ".digital-kit", pin: true, pinSpacing: true, start: "top 0%", end: "+=230%" }
				});
				dKit.to(".kit-list > li:nth-child(1)", { yPercent: yPercent_vh(-200), duration: 1.5 }, "-=1")
					.to(".kit-list > li:nth-child(2)", { yPercent: yPercent_vh(-200), duration: 1.5 }, "-=1")
					.to(".kit-list > li:nth-child(3)", { yPercent: yPercent_vh(-200), duration: 1.5 }, "-=1");
			}
		});

		// Rotating image in kit
		gsap.to(".kit .img-wrap.ani", {
			rotation: 360, duration: 3.5, repeat: -1, ease: "none"
		});

		// ============================================
		// DOWNLOAD SECTION
		// ============================================
		gsap.set(".download .bg", { yPercent: 0 });
		gsap.timeline({
			defaults: { ease: "none" },
			scrollTrigger: { trigger: ".download .bg", start: "top 70%", end: "+top 10%", scrub: 1 }
		}).to(".download .bg", { duration: 0.5, yPercent: -80 });

		gsap.set(".download .text-wrap", { yPercent: 0 });
		gsap.set(".download .form-area", { yPercent: 120 });
		gsap.timeline({
			defaults: { ease: "none" },
			scrollTrigger: { trigger: ".download-wrap", start: "top top", end: "+=120%", pin: true, scrub: 0.3, pinType: "transform" }
		}).to(".download .form-area", { duration: 1, yPercent: 0 });

		// ============================================
		// CONTACT + TOGETHER
		// ============================================
		gsap.set(".contact .text-wrap", { yPercent: 20 });
		gsap.timeline({
			scrollTrigger: { trigger: ".contact .text-wrap", scrub: 2, start: "top bottom", end: "top top", ease: "power2.out" }
		}).to(".contact .text-wrap", { yPercent: -20, duration: 1 });

		gsap.set(".contact .title-wrap", { yPercent: 20 });
		gsap.timeline({
			scrollTrigger: { trigger: ".contact .title-wrap", scrub: 2, start: "top bottom", end: "top top", ease: "power2.out" }
		}).to(".contact .title-wrap", { yPercent: -20, duration: 1 });

		// Layer content stacking
		gsap.set(".layer-content > section", {
			zIndex: function(i, target, targets) { return targets.length - i; }
		});

		if (character) {
			gsap.to(character.state, {
				frame: character.frameCount - 1, snap: "frame", repeat: -1, ease: "none", duration: 5,
				scrollTrigger: {
					trigger: ".together .gutter-100",
					start: "top top",
					onEnter: function () { $(".together").addClass("on"); },
					onLeaveBack: function () { $(".together").removeClass("on"); },
				},
				onUpdate: character.render
			});
		}

		ScrollTrigger.matchMedia({
			"(min-width: 769px)": function () {
				gsap.to(".layer-content > section", {
					yPercent: -100, ease: "none", stagger: 0.5,
					scrollTrigger: { trigger: ".layer-content", end: "+=200%", scrub: 1.5, pin: true, pinType: "transform", invalidateOnRefresh: true }
				});
			},
			"(max-width: 768px)": function () {
				gsap.to(".layer-content > section", {
					yPercent: -140, ease: "none", stagger: 0.5,
					scrollTrigger: { trigger: ".layer-content", end: "+=200%", scrub: 2.5, pin: true, pinType: "transform", invalidateOnRefresh: true }
				});
			}
		});

		// ============================================
		// FLOATING CONTACT BUTTON
		// ============================================
		gsap.to(".click-to-contact", {
			rotation: 360, duration: 3.5, repeat: -1, ease: "none"
		});

		ScrollTrigger.matchMedia({
			"(max-width: 768px)": function () {
				gsap.to(".click-to-contact", {
					scrollTrigger: {
						trigger: ".anniversary", start: "top 80%", end: "top 80%", scrub: 0.3,
						onEnter: function () { $(".click-to-contact").addClass("show"); },
						onEnterBack: function () { $(".click-to-contact").removeClass("show"); },
					}
				});
			}
		});

		gsap.to(".click-to-contact", {
			scrollTrigger: {
				trigger: ".contact .title-wrap", start: "top bottom", end: "top bottom", scrub: 0.3,
				onEnter: function () { $(".click-to-contact").removeClass("show").addClass("hide"); },
				onEnterBack: function () { $(".click-to-contact").addClass("show").removeClass("hide"); },
			}
		});

		// ============================================
		// MOUSE CURSOR
		// ============================================
		entryPointer();
		function entryPointer() {
			var cursor = document.querySelector('#cursorContact');
			var mouse = { x: -100, y: -100 };
			var pos = { x: 0, y: 0 };
			var speed = 0.1;
			window.addEventListener('mousemove', function(e) {
				mouse.x = e.clientX;
				mouse.y = e.clientY;
			});
			function updateCursor() {
				var diffX = Math.round(mouse.x - pos.x);
				var diffY = Math.round(mouse.y - pos.y);
				pos.x += diffX * speed;
				pos.y += diffY * speed;
				cursor.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)';
			}
			function loop() {
				updateCursor();
				requestAnimationFrame(loop);
			}
			requestAnimationFrame(loop);
			var cursorModifiers = document.querySelectorAll('[cursor-class]');
			cursorModifiers.forEach(function(mod) {
				mod.addEventListener('mouseenter', function () {
					cursor.classList.add(this.getAttribute('cursor-class'));
				});
				mod.addEventListener('mouseleave', function () {
					cursor.classList.remove(this.getAttribute('cursor-class'));
				});
			});
		}

	}, 4500);

	ScrollTrigger.refresh();
	ScrollTrigger.config({ ignoreMobileResize: true });
});
