//set animation timing
var animationDelay = 2500,
  //loading bar effect
  barAnimationDelay = 3800,
  barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
  //letters effect
  lettersDelay = 50,
  //type effect
  typeLettersDelay = 150,
  selectionDuration = 500,
  typeAnimationDelay = selectionDuration + 800,
  //clip effect 
  revealDuration = 600,
  revealAnimationDelay = 1500;

Meteor.AnimatedHeadlines = {
  options: {
    // set animation timing
    animationDelay: animationDelay,
    // loading bar effect
    barAnimationDelay: barAnimationDelay,
    barWaiting: barWaiting, // 3000 is the duration of the transition on the loading bar - set in the scss/css file
    // letters effect
    lettersDelay: lettersDelay,
    // type effect
    typeLettersDelay: typeLettersDelay,
    selectionDuration: selectionDuration,
    typeAnimationDelay: typeAnimationDelay,
    // clip effect 
    revealDuration: revealDuration,
    revealAnimationDelay: revealAnimationDelay
  }
};

var singleLetters = function($words) {
  $words.each(function() {
    var word = $(this),
      letters = word.text().split(''),
      selected = word.hasClass('is-visible');
    for (i in letters) {
      if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
      letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
    }
    var newLetters = letters.join('');
    word.html(newLetters).css('opacity', 1);
  });
};

var animateHeadline = function($headlines) {
  var options = Meteor.AnimatedHeadlines.options;
  var duration = options.animationDelay;
  $headlines.each(function() {
    var headline = $(this);

    if (headline.hasClass('loading-bar')) {
      duration = Meteor.AnimatedHeadlines.options.barAnimationDelay;
      setTimeout(function() {
        headline.find('.cd-words-wrapper').addClass('is-loading')
      }, options.barWaiting);
    } else if (headline.hasClass('clip')) {
      var spanWrapper = headline.find('.cd-words-wrapper'),
        newWidth = spanWrapper.width() + 10
      spanWrapper.css('width', newWidth);
    } else if (!headline.hasClass('type')) {
      //assign to .cd-words-wrapper the width of its longest word
      var words = headline.find('.cd-words-wrapper b'),
        width = 0;
      words.each(function() {
        var wordWidth = $(this).width();
        if (wordWidth > width) width = wordWidth;
      });
      headline.find('.cd-words-wrapper').css('width', width);
    };

    //trigger animation
    setTimeout(function() {
      hideWord(headline.find('.is-visible').eq(0))
    }, duration);
  });
};

var hideWord = function($word) {
  var options = Meteor.AnimatedHeadlines.options;
  var nextWord = takeNext($word);

  if ($word.parents('.cd-headline').hasClass('type')) {
    var parentSpan = $word.parent('.cd-words-wrapper');
    parentSpan.addClass('selected').removeClass('waiting');
    setTimeout(function() {
      parentSpan.removeClass('selected');
      $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
    }, options.selectionDuration);
    setTimeout(function() {
      showWord(nextWord, options.typeLettersDelay)
    }, options.typeAnimationDelay);

  } else if ($word.parents('.cd-headline').hasClass('letters')) {
    var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
    hideLetter($word.find('i').eq(0), $word, bool, options.lettersDelay);
    showLetter(nextWord.find('i').eq(0), nextWord, bool, options.lettersDelay);

  } else if ($word.parents('.cd-headline').hasClass('clip')) {
    $word.parents('.cd-words-wrapper').animate({
      width: '2px'
    }, options.revealDuration, function() {
      switchWord($word, nextWord);
      showWord(nextWord);
    });

  } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
    $word.parents('.cd-words-wrapper').removeClass('is-loading');
    switchWord($word, nextWord);
    setTimeout(function() {
      hideWord(nextWord)
    }, options.barAnimationDelay);
    setTimeout(function() {
      $word.parents('.cd-words-wrapper').addClass('is-loading')
    }, options.barWaiting);

  } else {
    switchWord($word, nextWord);
    setTimeout(function() {
      hideWord(nextWord)
    }, options.animationDelay);
  }
};

var showWord = function($word, $duration) {
  if ($word.parents('.cd-headline').hasClass('type')) {
    showLetter($word.find('i').eq(0), $word, false, $duration);
    $word.addClass('is-visible').removeClass('is-hidden');

  } else if ($word.parents('.cd-headline').hasClass('clip')) {
    $word.parents('.cd-words-wrapper').animate({
      'width': $word.width() + 10
    }, options.revealDuration, function() {
      setTimeout(function() {
        hideWord($word)
      }, options.revealAnimationDelay);
    });
  }
};

var hideLetter = function($letter, $word, $bool, $duration) {
  var options = Meteor.AnimatedHeadlines.options;
  $letter.removeClass('in').addClass('out');

  if (!$letter.is(':last-child')) {
    setTimeout(function() {
      hideLetter($letter.next(), $word, $bool, $duration);
    }, $duration);
  } else if ($bool) {
    setTimeout(function() {
      hideWord(takeNext($word))
    }, options.animationDelay);
  }

  if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
    var nextWord = takeNext($word);
    switchWord($word, nextWord);
  }
};

var showLetter = function($letter, $word, $bool, $duration) {
  var options = Meteor.AnimatedHeadlines.options;
  $letter.addClass('in').removeClass('out');

  if (!$letter.is(':last-child')) {
    setTimeout(function() {
      showLetter($letter.next(), $word, $bool, $duration);
    }, $duration);
  } else {
    if ($word.parents('.cd-headline').hasClass('type')) {
      setTimeout(function() {
        $word.parents('.cd-words-wrapper').addClass('waiting');
      }, 200);
    }
    if (!$bool) {
      setTimeout(function() {
        hideWord($word)
      }, options.animationDelay)
    }
  }
};

var takeNext = function($word) {
  return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
};

var takePrev = function($word) {
  return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
};

var switchWord = function($oldWord, $newWord) {
  $oldWord.removeClass('is-visible').addClass('is-hidden');
  $newWord.removeClass('is-hidden').addClass('is-visible');
};

Template.animatedHeadlines.created = function() {

};

Template.animatedHeadlines.rendered = function() {
  singleLetters($('.cd-headline.letters').find('b'));
  animateHeadline($('.cd-headline'));
};