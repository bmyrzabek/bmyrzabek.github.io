 $( document ).ready(function() {
	AOS.init({
		duration: 1300,
		anchorPlacement: "bottom-bottom",
		once: true,
		// easing: "linear"
	})

	/**
	 * Получение, запоминание utm-меток
	 * Прописать их в адресную строку форм
	 */
	function utmTag() {

			// получаем GET параметры
			let currentUrlSearch = document.location.search;
			currentUrlSearch = currentUrlSearch.slice(1);

			// Если есть GET параметры
			// кроме меток номера страницы
			// проверяем есть уже такие метки или нет в сессии
			// записываем в сессию ту метки, которых нет
			if (currentUrlSearch) {

					let arrUrlSearch = currentUrlSearch.split('&');
					arrUrlSearch.forEach((item, index, arrUrlSearch) => {

							let k = item.split('=');
							if (k[0] != 'page') {
									if (!sessionStorage.getItem(k[0])) sessionStorage.setItem(k[0], k[1]);
									if (k[0].startsWith("utm")) document.cookie = `${k[0]}=${k[1]}; path=/; SameSite=Lax`;
							}

					});

			}

	}

	function utmLinks() {

			// Метки для переноса: 5 UTM + click-ID. Значения берём как есть —
			// они уже в URL-кодировке (как пришли в адресной строке), не пере-кодируем.
			let keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'yclid'];
			let pairs = [];

			keys.forEach(function (k) {
					let v = sessionStorage.getItem(k);
					if (v) pairs.push(k + '=' + v);
			});

			if (!pairs.length) return;

			let qs = pairs.join('&');
			let tagLinks = document.getElementsByClassName('utm-tag');

			for (let item of tagLinks) {
					// корректный разделитель: ? если в href его ещё нет, иначе &
					item.href = item.href + (item.href.indexOf('?') !== -1 ? '&' : '?') + qs;
			}

	}

	utmTag();
	utmLinks();
 
	// homepage slider
	const projectsSlider = new Swiper('.projects_slider', {	
		direction: 'horizontal',
		slidesPerView: 'auto',
		spaceBetween: 15,
		a11y: false,
		navigation: {
			nextEl: '.button-next',
			prevEl: '.button-prev',
		},
		breakpoints: {
			480: {
				slidesPerView: 1,
				spaceBetween: 30,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 30,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 30,
			}
		},
	});
	
	// team slider
	const teamSlider = new Swiper('.team_slider', {
		direction: 'horizontal',
		slidesPerView: 'auto',
		spaceBetween: 15,
		a11y: false,
		navigation: {
			nextEl: '.team-button-next',
			prevEl: '.team-button-prev',
		},	
		breakpoints: {
			1200: {
				slidesPerView: 4,
				spaceBetween: 30,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 30,
			}
		}
	});

	$(".projects_modal").modaal();
	$(".team_modal").modaal();
	$(".homepage_video").modaal({
		type: 'video'
	});

	// Generic investor modal links (data-modal attribute)
	$('.investor_modal_link').each(function() {
		var $el = $(this);
		var target = $el.data('modal');
		if (target) {
			$el.modaal({ content_source: target });
		}
	});

	$("#expand_about_text").on('click', function () {
		$(".page-history-block").removeClass("disable");
	});

	const items = document.querySelectorAll(".accordion button");

	function toggleAccordion() {
		const itemToggle = this.getAttribute('aria-expanded');
		
		for (i = 0; i < items.length; i++) {
			items[i].setAttribute('aria-expanded', 'false');
		}
		
		if (itemToggle == 'false') {
			this.setAttribute('aria-expanded', 'true');
		}
	}

	items.forEach(item => item.addEventListener('click', toggleAccordion));

});

$(document).ready(function () {
  "use strict";

  var progressPath = document.querySelector(".progress-wrap path");
  if (!progressPath) return;
  var pathLength = progressPath.getTotalLength();
  progressPath.style.transition = progressPath.style.WebkitTransition = "none";
  progressPath.style.strokeDasharray = pathLength + " " + pathLength;
  progressPath.style.strokeDashoffset = pathLength;
  progressPath.getBoundingClientRect();
  progressPath.style.transition = progressPath.style.WebkitTransition =
    "stroke-dashoffset 10ms linear";
  var updateProgress = function () {
    var scroll = $(window).scrollTop();
    var height = $(document).height() - $(window).height();
    var progress = pathLength - (scroll * pathLength) / height;
    progressPath.style.strokeDashoffset = progress;
  };
  updateProgress();
  $(window).scroll(updateProgress);
  var offset = 150;
  var duration = 550;
  jQuery(window).on("scroll", function () {
    if (jQuery(this).scrollTop() > offset) {
      jQuery(".progress-wrap").addClass("active-progress");
    } else {
      jQuery(".progress-wrap").removeClass("active-progress");
    }
  });
  jQuery(".progress-wrap").on("click", function (event) {
    event.preventDefault();
    jQuery("html, body").animate({ scrollTop: 0 }, duration);
    return false;
  });
});


$(function () {
  var width = $(window).width();
  if (width > 991) {
    ("use strict");

    var wind = $(window);
		
    /* =============================================================================
		-------------------------------  NabBar Scroll   -------------------------------
		============================================================================= */
    wind.on("scroll", function () {
      var bodyScroll = wind.scrollTop(),
        navbar = $(".header");
      // logo = $(".navbar.change .logo> img");

      if (bodyScroll > 300) {
        navbar.addClass("nav-scroll");
        // logo.attr('src', 'assets/imgs/logo-dark.png');
      } else {
        navbar.removeClass("nav-scroll");
        // logo.attr('src', 'assets/imgs/logo-light.png');
      }
    });
  }
  
    $('a[href*="#"]:not([href="#"])').click(function() {
        var offset = -100; // <-- change the value here
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top + offset
                }, 400);
                return false;
            }
        }
    });

});