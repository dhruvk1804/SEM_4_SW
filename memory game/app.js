document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' },
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' }
  ];

  // Timer variables
  let startTime;
  let timerInterval;
  const bestTime = localStorage.getItem('bestTime') || Infinity;

  cardArray.sort(() => 0.5 - Math.random());

  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];

  function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = elapsed;
  }

  function createBoard() {
    // Reset timer
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    grid.innerHTML = '';
    for (let i = 0; i < cardArray.length; i++) {
      const card = document.createElement('img');
      card.setAttribute('src', 'images/blank.png');
      card.setAttribute('data-id', i);
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
    }
  }

  function checkForMatch() {
    const cards = document.querySelectorAll('img');
    const [optionOneId, optionTwoId] = cardsChosenId;

    if(optionOneId === optionTwoId) {
      cards[optionOneId].setAttribute('src', 'images/blank.png');
      alert('You clicked the same card!');
    }
    else if (cardsChosen[0] === cardsChosen[1]) {
      alert('Match found!');
      cards[optionOneId].setAttribute('src', 'images/white.png');
      cards[optionTwoId].setAttribute('src', 'images/white.png');
      cards[optionOneId].removeEventListener('click', flipCard);
      cards[optionTwoId].removeEventListener('click', flipCard);
      cardsWon.push(cardsChosen);
    } else {
      cards[optionOneId].setAttribute('src', 'images/blank.png');
      cards[optionTwoId].setAttribute('src', 'images/blank.png');
      alert('Try again!');
    }

    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === cardArray.length/2) {
      clearInterval(timerInterval);
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      
      if (finalTime < bestTime) {
        localStorage.setItem('bestTime', finalTime);
      }
      
      resultDisplay.textContent = `Congratulations! Time: ${finalTime}s | Best: ${localStorage.getItem('bestTime')}s`;
    }
  }

  function flipCard() {
    const cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    
    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }

  createBoard();
});