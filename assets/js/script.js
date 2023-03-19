let activeGame = false;

// Ця функція повертає рандомне число
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Ця функція заповнює #pieceContainer пазликами у рандомному порядку
function Shuffle() {
  window.activeGame = false;
  let pieces = getPieces()
  $('#pieceContainer').empty()
  const coors = [
    [0,0  ], [100,0  ], [200,0  ], [300,0  ],
    [0,100], [100,100], [200,100], [300,100],
    [0,200], [100,200], [200,200], [300,200],
    [0,300], [100,300], [200,300], [300,300],
  ]
  $(pieces).each(function (index, img) {
    const rand = randomNumber(0, pieces.length);
    let piece = pieces[rand]
    piece.css('position', 'absolute')
    piece.css('left', `${coors[index][0]}px`)
    piece.css('top', `${coors[index][1]}px`)
    $('#pieceContainer').append(piece)
    pieces.splice(rand, 1) // Видаляємо його зі списку
  })
}

// Ця функція повертає список в якому знаходяться 16 пазликів
function getPieces() {
  const rows = 4;
  const cols = 4;
  let pieces = [];
  for (let i=0,order=0; i<rows; i++) {
    for (let j=0; j<cols; j++, order++) {
      let piece = $(`<div data-order=${order}></div>`)
      piece.addClass('piece')
      piece.css('background-position', `${-100*i}px ${-100*j}px`)
      piece.draggable({
        revert: "invalid",
        start: function() {
          if($(this).hasClass("droppedPiece")) {
            $(this).removeClass("droppedPiece")
            $(this).parent().removeClass("piecePresent")
          }
        }
      })
      pieces.push(piece)
    }
  }
  return pieces
}


// Ця функція перевіряє чи пазл зібраний
function getGameResult() {
  if ($("#puzzleContainer .droppedPiece").length != 16){
    return false
  }

  correct = [0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15]
  for (let k=0; k<16;k++){
    let item = $(`#puzzleContainer .droppedPiece:eq(${k})`)
    let order = item.data("order")
    if (correct[k] != order) {
      return false
    }
  }
  return true
}


// Ця функція збиває правий квадрат
function resetDroppable() {
  $('#puzzleContainer').empty()
  for (let i=0; i<16; i++) {
    let droppable = $('<div></div>')
    droppable.addClass('droppable')
    droppable.droppable({
      hoverClass: 'drop-hover-shadow',
      accept: function() {
        return !$(this).hasClass('piecePresent')
      },
      drop: function(evennt, ui) {
        let draggableElement = ui.draggable
        let droppedOn = $(this)
        droppedOn.addClass('piecePresent')
        $(draggableElement).addClass('droppedPiece').css({
          top: 0,
          left: 0,
          position: "relative"
        }).appendTo(droppedOn)

        if (!window.activeGame) {
          $("#button-start").click()
        }

        if (getGameResult()) {
          $('#check').click()
          $('#button-check-result').click()
        }
      }
    })
    $('#puzzleContainer').append(droppable)
  }
}


// Ця функція виконується автотматично коли сторінка загрузиться
$(document).ready(function() {
  Shuffle()
  resetDroppable()

  $("#button-start").click(function() {
    console.log('Start Game')
    window.activeGame = true;
    let min = '01';
    let sec = '00';
    $("#button-start").attr('disabled', 'disabled');
    $("#button-check-result").removeAttr('disabled');

    // Reset Modal
    $('.popup-message').html("You still have time, you sure?");
    $('#check').removeClass('hidden');
    $('#timer-popup').removeClass('hidden');

    timer = setInterval(function () {
      if (sec == '00') {
        min--;
        sec = 60;
        if (min < 10) min = '0' + min;
      }
      sec--;
      if (sec < 10) sec = '0' + sec;

      if (sec == "00" && min == 0) {
        clearInterval(timer);
        $('#popup').addClass('open-popup');
        $('#back').addClass('open-back');
        $('.popup-message').html("It's a pity, but you lost");
        $('#check').addClass('hidden');
        $('#button-check-result').attr('disabled', 'disabled');
      }

      $('.timer-display').html(`${min}:${sec}`);
    }, 1000)
  });

  // Button Check Result
  $('#button-check-result').on('click', function (event) {
    event.preventDefault()
    $('#popup').addClass('open-popup');
    $('#back').addClass('open-back');
  })

  // Button Close
  $('#close').on('click', function (event) {
    event.preventDefault()
    $('#popup').removeClass('open-popup');
    $('#back').removeClass('open-back');
  })

  // Modal Check Button
  $('#check').on('click', function () {
    $('#timer-popup').addClass('hidden');
    if (getGameResult()) {
      clearInterval(timer);
      $('.popup-message').text('Woohoo, well done, you did it!');
      $('#check').addClass('hidden');
      $('#button-check-result').attr('disabled', 'disabled');
    } else {
      clearInterval(timer);
      $('.popup-message').html("It's a pity, but you lost");
      $('#check').addClass('hidden');
      $('#button-check-result').attr('disabled', 'disabled');
    }
  })

  $('#button-new-game').click(function() {
    if (window.activeGame) clearInterval(timer);
    window.activeGame = false;

    Shuffle()
    resetDroppable()

    $('.timer-display').html('01:00');
    $("#button-start").removeAttr('disabled');
    $("#button-check-result").attr('disabled', 'disabled');
  })


})