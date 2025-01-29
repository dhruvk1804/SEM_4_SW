const userChoiceDisplay = document.createElement('h1');
const computerChoiceDisplay = document.createElement('h1');
const resultDisplay = document.createElement('h1');
const scoreDisplay = document.createElement('h2');
const gameGrid = document.getElementById('game');
gameGrid.append(userChoiceDisplay, computerChoiceDisplay, resultDisplay, scoreDisplay);

const choices = ['rock', 'paper', 'scissors'];
let userChoice;
let computerChoice;
let wins = 0, losses = 0, ties = 0;

const handleClick = (e) => {
  userChoice = e.target.id;
  userChoiceDisplay.innerHTML = 'User choice: ' + userChoice;
  generateComputerChoice();
  getResult();
};

const generateComputerChoice = () => {
  const randomChoice = choices[Math.floor(Math.random() * choices.length)];
  computerChoice = randomChoice;
  computerChoiceDisplay.innerHTML = 'Computer choice: ' + computerChoice;
};

for (let i = 0; i < choices.length; i++) {
  const button = document.createElement('button');
  button.id = choices[i];
  button.innerHTML = choices[i];
  button.addEventListener('click', handleClick);
  gameGrid.appendChild(button);
}

const getResult = () => {
  switch (userChoice + computerChoice) {
    case 'scissorspaper':
    case 'rockscissors':
    case 'paperrock':
      resultDisplay.innerHTML = "YOU WIN!";
      wins++;
      break;
    case 'paperscissors':
    case 'scissorsrock':
    case 'rockpaper':
      resultDisplay.innerHTML = "YOU LOSE!";
      losses++;
      break;
    case 'paperpaper':
    case 'scissorsscissors':
    case 'rockrock':
      resultDisplay.innerHTML = "ITS A DRAW!";
      ties++;
      break;
  }
  scoreDisplay.innerHTML = `Wins: ${wins} | Losses: ${losses} | Ties: ${ties}`;
};