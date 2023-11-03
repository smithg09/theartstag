// A Carousel Object will have a .carousel html element associated with it with the car parameter
// At the end of this document, all .carousel elements are assigned to a Carousel Object
function Carousel(car){
	// this will be our Carousel object, which will be referred to as carousel
	var carousel = this;

	// PROPERTIES

	// carousel.element is a jquery object of the car element passed into the Carousel constructor
	carousel.element = $(car);
	carousel.currentSlide = 0;
	carousel.previousSlide = 0;
	carousel.numberOfSlides = 0;
	// timer will be the timer object
	carousel.timer = false;
	// timerLength is the time between slideshow switches
	carousel.timerLength = 5000;
	// timerPause is the time between clicking a button and the slideshow starting again
	carousel.timerPause = 10000;
	// timing will stop button clicks if it is true
	carousel.timing = false;



	// METHODS

	// .changePosition() is a method for altering the carousel's data
	// It gets passed true, false, or a number
	// It makes sure that the slides always stay within available parameters
	// It calls the .showPosition() method at the end
	carousel.changePosition = function(direction){
		// Don't do anything if you're already moving
		if(carousel.timing) return;

		carousel.previousSlide = carousel.currentSlide;
		// If moving to the left, decrement currentSlide
		if(direction === false) {
			carousel.currentSlide--;
		} else 
		// If moving to the right, increment currentSlide
		if(direction === true) {
			carousel.currentSlide++;
		} else 
		// If direction is a number
		{
			if(carousel.currentSlide<direction) {
				carousel.currentSlide = direction;
				// return will stop the current function from doing anything else, and switch straight to .showPosition()
				return carousel.showPosition(true,true);
			} else if (carousel.currentSlide>direction) {
				carousel.currentSlide = direction;
				return carousel.showPosition(false,true);
			}
		}

		if(carousel.currentSlide == carousel.previousSlide) return;

		if(carousel.currentSlide < 0){
			carousel.currentSlide = carousel.numberOfSlides-1;
		} else if(carousel.currentSlide >= carousel.numberOfSlides){
			carousel.currentSlide = 0;
		}

		carousel.showPosition(direction,false);
	};

	// .showPosition() will 
	carousel.showPosition = function(direction,placed){
		// Clear the changeTimer if it's currently running
		clearTimeout(carousel.changeTimer);
		carousel.changeTimer = false;

		var leftposition, rightposition;
		if(carousel.currentSlide == 0){
			leftposition = carousel.numberOfSlides-1;
		} else leftposition = carousel.currentSlide-1;

		if(carousel.currentSlide == carousel.numberOfSlides-1){
			rightposition = 0;
		} else rightposition = carousel.currentSlide+1;


		// Select all the slides, remove any odd classes from them, and then set them back to carousel-slide
		var cs = carousel.element.find(".carousel-slide")
			.removeClass("atLeft atRight atCenter moving");

		cs.eq(carousel.previousSlide).addClass("atCenter")
		if(direction===true){
			cs.eq(carousel.currentSlide).addClass("atRight");
			cs.eq(rightposition).addClass("atRight");
		} else if(direction===false){
			cs.eq(carousel.currentSlide).addClass("atLeft");
			cs.eq(leftposition).addClass("atLeft");
		}

		// Set timing to true so that no button clicks will work while a slide is happening
		carousel.timing = true;

		// Wait some milliseconds for the computer to render the slides into their starting positions
		// Then move the correct slides to their new positions
		carousel.changeTimer = setTimeout(function(){
			carousel.element.find(".carousel-paginate")
				.eq(carousel.currentSlide).addClass("active")
				.siblings().removeClass("active");
			cs.eq(carousel.currentSlide)
				.removeClass("atLeft atRight").addClass("moving atCenter");
			cs.eq(carousel.previousSlide)
				.removeClass("atLeft atRight atCenter").addClass("moving at"+
					(direction===true ? "Left" : "Right"));

			// Wait a second and let the button be clicked again
			setTimeout(function(){carousel.timing = false;},400);
		// The number here can be adjusted if you have too many glitches
		},50);
	};


	// Slideshow Methods
	// .startTimer() starts a repeating interval timer which calls .tick() every timerLength
	carousel.startTimer = function(){
		// No slideshow if the timerLength is 0
		if(carousel.timerLength === 0) return;
		carousel.timer = setInterval(carousel.tick, carousel.timerLength);
	};
	// .stopTimer() clears the interval and resets the timer to false
	carousel.stopTimer = function(){
		clearInterval(carousel.timer);
		carousel.timer = false;
	};
	// .pauseTimer() calls the .stopTimer() and then starts a single use timer to call .startTimer() again
	carousel.pauseTimer = function(){
		carousel.stopTimer();
		carousel.timer = setTimeout(carousel.startTimer, carousel.timerPause);
	};
	// .tick() will call the .changePosition() function and move to the right
	carousel.tick = function(){
		carousel.changePosition(true);
	};



	// This function will create a series of buttons to a new div and append that
	// div to the controls div
	carousel.makeButtons = function(){
		// Passing a string of an html tag into jquery returns a new element
		var button,buttondiv = $("<div class='carousel-pagination'>");
		// New elements can be appended, prepended, and more to other elements
		for(var i=0; i<carousel.numberOfSlides; i++) {
			// Make a new button element
			btn = $("<button class='carousel-paginate'>").html("&#x25cf;");
			// If it's the first button, add an active class to it.
			if(i==0) btn.addClass("active");
			// Add the button to the buttondiv
			buttondiv.append(btn);
		}
		// Add the buttondiv to the carousel controls
		carousel.element.append(
			$("<div class='carousel-controls'>").html(
				"<div class='carousel-move-left'><img src='./assets/right-arrow.png' class='chevron-right'/></div>"+
				"<div class='carousel-move-right'><img src='./assets/right-arrow.png' class='chevron-right'/></div>"
				).append(buttondiv)
			);
	};



	carousel.init = function(){

		// If a timer attribute has been given, set the timer values
		if(carousel.element.data("timer")=="none") {
			carousel.timerLength = 0;
		} else if(carousel.element.data("timer")!=undefined) {
			carousel.timerLength = +carousel.element.data("timer")*1000;
		}
		carousel.timerPause = carousel.timerLength*2;

		// Find the number of slides from the html carousel-deck
		carousel.numberOfSlides = carousel.element.find(".carousel-slide").length;
		// Show the first slide
		carousel.element.find(".carousel-slide").eq(0).addClass("atCenter");

		// Create all the buttons
		carousel.makeButtons();
		// Start the slideshow
		carousel.startTimer();
	};





	// EVENT HANDLERS
	carousel.element.on("click",".carousel-move-left",function(){
		carousel.changePosition(false);
		carousel.pauseTimer();
	});
	carousel.element.on("click",".carousel-move-right",function(){
		carousel.changePosition(true);
		carousel.pauseTimer();
	});
	carousel.element.on("click",".carousel-paginate",function(){
		carousel.changePosition($(this).index());
		carousel.pauseTimer();
	});



	// Call a function called .init() to start anything that needs to be started
	carousel.init();
}

$(function(){ // document ready
	// Find all the .carousel elements and assign them to a Carousel Object
	$(".carousel").each(function(){
		new Carousel(this);
	});
});