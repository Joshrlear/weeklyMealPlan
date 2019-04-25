const clickTracker = [];

function expandDay() {
  $('#js-main').on('click', 'li', function () {

    const currentPosition = $(this).offset().top;
    let lastPosition = null;
    const screenHeight = $(window).height();
    
    clickTracker.unshift(currentPosition);
    clickTracker.splice(2,1);
    console.log(clickTracker);

    for (let i of clickTracker) {
      (clickTracker.length > 1) ? lastPosition = clickTracker[clickTracker.length - 1] : null;
    };

    console.log(`current: ${currentPosition}, last position: ${lastPosition}, screen size: ${screenHeight}`)


    // animate on expand
    $('[data-expand="true"]').find('#js-section').show(750);
    $('[data-expand="true"]').find('#js-recipe-header').hide(500);
    $('[data-expand="true"]').find('#js-recipe-img').css({"filter": "brightness(1)"});

    $("HTML, BODY").animate({
      scrollTop: currentPosition
    });

    // animate on collapse
    $('[data-expand="false"]').find('#js-section').hide(500);
    $('[data-expand="false"]').find('#js-recipe-header').show(750);
    $('[data-expand="false"]').find('#js-recipe-img').css({"filter": "brightness(0.6)"});
  })
}

/*
sets data-expand="true/false" depending on if <li> is clicked.
Only allows one data-expand="true" at a time
*/
function handleClick() {

  $('#js-main').on('click', 'li', function () {
    const clicked = $(this).attr('data-expand', $(this).attr('data-expand') ==
      'false'
      ? 'true'
      : 'false');
    $(this).siblings().attr('data-expand', 'false');
    console.log(clicked.attr('data-expand'));
  });
}

$(function onLoad() {
    console.log('loading animate.js');
  $('li').find('#js-section').hide();
  handleClick();
  expandDay();
});