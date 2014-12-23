(function ($) {
	var defaults = {
		largeDiv: '',
		smallDiv: '',
		hideDiv: '',
		photosetID: '72157648525457150',
		limit: 10,
	};

	$.fn.flickrPicker = function (options) {

		var options = $.extend(defaults, options);

		$(defaults.hideDiv).hide();

		if (defaults.largeDiv == '' || defaults.smallDiv == '' || defaults.sliderDiv == '') {
			console.log("You need to specify a large and small div example:");
			console.log("$('.slider').flickrPicker({largeDiv:'.slider-for', smallDiv:'.slider-nav', hideDiv:'.slider', photosetID: '72157648525457150', limit: 10});");
			return;
		}

		if (defaults.photosetID == '72157648525457150') {
			console.log("You might want to specify a different photosetID example:");
			console.log("$('.slider').flickrPicker({largeDiv:'.slider-for', smallDiv:'.slider-nav', hideDiv:'.slider', photosetID: '72157648525457150', limit: 10});");
		}

		// Return each instance of the flickPicker
		return this.each(function (options) {
			var apiCall = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=16c28cba59fbe3b8685bc2316a38a1a0&photoset_id=" + defaults.photosetID + "&extras=tags%2C+o_dims%2C++url_sq%2C+url_q%2C+url_t%2C+url_s%2C+url_m%2C+url_n%2C+url_-%2C+url_z%2C+url_o%2C+url_h&format=json&nojsoncallback=1";

			// call out to flickr for images
			$.getJSON(apiCall, function (data) {
				var image, images = [], i;

				// Loop through each image item
				$.each(data.photoset.photo, function (i, item) {
					// Create an image object
					if (i <= defaults.limit - 1) {
						image = {
							id: item.id,
							title: item.title,
							tags: item.tags,
							description: '',
							thumbnail: item.url_q,
							imageLarge: item.url_o
						};

						// Push flickr images into array
						images.push(image);
					}
				});

				// We have to make another call to grab the image description
				$.each(images, function (i, item) {

					var largeImage, smallImage, text;
					// url to get descriptions for an image
					apiCall = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=16c28cba59fbe3b8685bc2316a38a1a0&photo_id=" + item.id + "&format=json&nojsoncallback=1";

					$.getJSON(apiCall, function (data) {

						// Assign the large image with attributes and add to div
						largeImage = $("<img/>").attr({
							src: item.imageLarge,
							alt: data.photo.description._content
						});
						//add description as text below main image
						text = $("<span style='width:100%;background-color:white; display:block; padding:2px;'>" + data.photo.description._content + "</span>")
						$(defaults.largeDiv).append("<div>" + largeImage[0].outerHTML + text[0].outerHTML + "</div>");

						// Assign the small image with attributes and add to div
						smallImage = $("<img/>").attr({
							src: item.thumbnail,
							alt: data.photo.description._content
						});
						$(defaults.smallDiv).append("<div>" + smallImage[0].outerHTML + "</div>");
					});
				});

				//wait 450ms for images to load from flickr, then create the slider
				setTimeout(function () {

					//big image display slider
					$(defaults.largeDiv).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: false,
						fade: true,
						asNavFor: defaults.smallDiv
					});

					//small image nav slider
					$(defaults.smallDiv).slick({
						slidesToShow: 3,
						slidesToScroll: 1,
						asNavFor: defaults.largeDiv,
						dots: true,
						centerMode: true,
						focusOnSelect: true
					});

					// hide the div covering the slider while it's loading
					$(defaults.hideDiv).show();
					$(defaults.hideDiv).find(".slick-next").click();
					$('.resizeSlider').css({ height: 'auto' });
				}, 800);
			});
		});
	}
})(jQuery);



