const logoImg = document.querySelector('.logo img');
const original = document.getElementById('original');
const originalIcons = document.querySelectorAll('.second .icon');
const originalContainer = document.querySelector('.original-container');
const bonus = document.getElementById('bonus');
const bonusIcons = document.querySelectorAll('.icon-bonus');
const bonusContainer = document.querySelector(".bonus-container");
const startGameContainer = document.querySelector(".start-game");
const playerCardImage = document.querySelector("#player-card-image");
const playerCard = document.querySelector("#player-card");
const blankCard = document.querySelector("#blank");
const houseCard = document.querySelector("#house-card");
const houseCardImage = document.querySelector("#house-card-image");
const gradientContainer = document.querySelector('.gradient');
const playAgainBtn = document.querySelector("#play-again");
const playAgainTitle = document.querySelector(".play-again__h2");
const scoreDisplay = document.querySelector('.score h1');
const rules = document.querySelector(".rules");
const rulesImg = document.querySelector('#rules-image');
const rulesBtn = document.querySelector(".rules-btn");
const rulesHide = document.querySelector(".rules-hide");
const shot = new Audio('./audio/shot_gun.mp3');
const applause =  new Audio('./audio/applause_short.mp3');
const boo = new Audio('./audio/boo_short.mp3');
const coin = new Audio('./audio/coin_short.mp3');
const paper = 'paper', rock =  'rock', scissors = 'scissors', spock = 'spock', lizard = 'lizard',
    equal = 'equal', lose = 'lose', win = 'win', messageEqual = 'E q u a l', messageWin = 'Y o u &nbsp W i n',
    messageLose = 'Y o u &nbsp L o s e';

const rulesOfGame = {
  paper: [rock, spock],
  rock: [lizard, scissors],
  lizard: [spock, paper],
  spock: [scissors, rock],
  scissors: [paper, lizard]
}
let score  = JSON.parse(localStorage.getItem('score')) || 0;
scoreDisplay.innerHTML = score;

function onLoad(){
  (localStorage.getItem('mode') == 3)? originalGame(): localStorage.setItem('mode', 5)  
}

function showRules(){
    rules.style.display = "inherit";
  }
  function hideRules(){
    rules.style.display = "none";
  }

/**Start Change mode */

  function bonusGame(){
    localStorage.setItem('mode', 5);
      playAgain();    
      logoImg.src = './images/logo-bonus.svg';
      rulesImg.src = './images/image-rules-bonus.svg';  
      bonus.style.display = 'none';
      original.style.display = 'initial';
      originalContainer.style.display = 'none';
      bonusContainer.style.display = 'flex';
      playAgainBtn.addEventListener('click', playAgain);
  }
  
  function originalGame(){
    localStorage.setItem('mode',3)
     playAgain();    
      logoImg.src = './images/logo.svg';
      rulesImg.src = './images/image-rules.svg';
      bonus.style.display = 'initial';
      original.style.display = 'none';
      bonusContainer.style.display = "none";
      playAgainBtn.removeEventListener('click', playAgainBonus);
  }

  function playAgain(){
    originalContainer.style.display = "flex";
    playAgainBtn.style.display = "none";
    playAgainTitle.classList.remove("animation-linear");
    gradientContainer.style.display = "none";
    gradientContainer.className = "gradient";
    houseCard.style.display = "none";
    blankCard.style.display = "flex";
    startGameContainer.style.display = "none";
    playerCardImage.classList.remove('animation-equal');
    houseCardImage.classList.remove("animation-equal");
}

function playAgainBonus(){    
  playAgain();
  bonusContainer.style.display = "flex";
  originalContainer.style.display = 'none';    
}

  /**END Change Mode */

/**Start Game */

function iconClickHandler(){
  const mode = JSON.parse(localStorage.getItem("mode"))*1;    
    shot.play();
    playerPickedCard((this.id).split('-')[1], mode);
}

function showCard(image, player,card) {
  image.src = './images/icon-'+ card +'.svg';
  player.className = 'icon ' + card;
}

function playerPickedCard(player, mode){
  bonusContainer.style.display = 'none';
  originalContainer.style.display = 'none';
  startGameContainer.style.display = 'block';
  showCard(playerCardImage,playerCard, player)

  let myPromise = new Promise(function(myResolve) {
      setTimeout(function() { myResolve(housePickedCard(mode)); }, 1500);
    });

    myPromise.then(function(house) {
      calculateResult(player, house, mode);
    });
}

function showHouseCard(mode){
  let randomNumber = Math.floor((Math.random() * mode) + 1);    
  let card = "";
  switch(randomNumber){
    case 1: card = 'paper'; break;
    case 2: card = 'scissors'; break;
    case 3: card = 'rock'; break;
    case 4: card = 'spock'; break;
    case 5: card = 'lizard'; break;  
  }
  return card;    
}

function housePickedCard(mode){
  blankCard.style.display = "none";
  houseCard.style.display = "flex";
  let house = showHouseCard(mode);
  showCard(houseCardImage, houseCard, house);
  return house;
}

function gameLogic(playerCard, houseCard) {
  let key = rulesOfGame[playerCard]

  if(playerCard === houseCard){
      return equal;
    }  
  for(let i = 0; i < key.length; i++ ){        
      if(key[i] == houseCard ){        
       return  win;        
      }
    } 
    return lose;  
  }

function calculateResult(player, house, mode){
  let result = gameLogic(player, house);
  let tempScore = JSON.parse(localStorage.getItem('score') || 0)*1;
 switch(result){
      case win: tempScore++;
      showResult(win, messageWin, tempScore, applause, mode); 
      break;
      case lose: tempScore--;
         showResult(lose, messageLose, tempScore, boo, mode); 
      break;
      default: showResult(equal, messageEqual, tempScore, coin, mode); 
      break;
  }
}

function showResult(result, message, score, audioFile, mode){
  audioFile.play();
  playAgainBtn.style.display = "flex";
  (mode === 5)? playAgainBtn.addEventListener("click", playAgainBonus): playAgainBtn.addEventListener("click", playAgain)
  if(result !== equal){    
    gradientContainer.classList.add(result);
    gradientContainer.style.display = 'initial';
    if(result === win) gradientContainer.classList.add('animation-linear');
  }else{
    playerCardImage.classList.add("animation-equal");
    houseCardImage.classList.add("animation-equal");
  }
  scoreDisplay.innerHTML = score;
  localStorage.setItem("score", score);
  playAgainTitle.innerHTML = message;
}

/**End Game */

function addListenerToCollection(icons){
  icons.forEach(icon =>{
    icon.addEventListener('click', iconClickHandler);

})
}
addListenerToCollection(bonusIcons);
addListenerToCollection(originalIcons);

rulesBtn.addEventListener("click", showRules);
rulesHide.addEventListener("click", hideRules);
original.addEventListener("click", originalGame);
bonus.addEventListener("click", bonusGame);