window.onload = function() {
  const start = document.querySelector('.start');
  const reset = document.querySelector('.reset');
  const stop = document.querySelector('.stop');
  const levelBoard = document.querySelector('#level');
  const winTable = document.querySelector('#win');
  const scoreBoard = document.querySelector('#score');
  const holes = document.querySelectorAll('.hole');
  const moles = document.querySelectorAll('.mole');
  const audio = document.querySelectorAll('audio');
  const storage = window.localStorage;

  storage.setItem('score', `${storage.score}`);
  storage.setItem('level', `${storage.level}`);

  if (storage.score == 'undefined') storage.score = 0;
  if (storage.level == 'undefined') storage.level = 1;

  scoreBoard.textContent = `${storage.score}`;
  levelBoard.textContent = `${storage.level}`;

  let lastHole;
  let isStop = true;
  let isClicked = false;

  function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];

    if (hole === lastHole) return randomHole(holes);

    lastHole = hole;
    return hole;
  }

  function peep() {
    const level = +storage.level;
    const time = randomTime(410 - 10 * `${level}`, 1280 - 80 * `${level}`);
    const hole = randomHole(holes);
    hole.classList.add('up');
    isClicked = false;

    setTimeout(() => {
      hole.classList.remove('up');
      if (!isStop) peep();
    }, time)
  }

  function startGame() {
    if (!isStop) return;
    if (+storage.score === 50) return;
    if (+storage.score === 0) {
      audio[0].currentTime = 0;
      audio[0].play();
    } else {
      audio[2].currentTime = 0;
      audio[2].play();
    }
    isStop = false;

    peep();
  }

  function bonk() {
    if (!event.isTrusted) {
      alert('Cheater!');
      return;
    }
    if (isClicked) {
      return;
    } else {
      +storage.score++;
      isClicked = true;
      audio[1].currentTime = 0;
      audio[1].play();

      if (+storage.score % 5 === 0) {
        +storage.level++;
        levelBoard.textContent = storage.level;
      }

      this.parentElement.classList.remove('up');
      scoreBoard.textContent = storage.score;

      if (+storage.score === 50) {
        winTable.textContent = 'you win!';
        levelBoard.textContent = '10';
        audio[3].currentTime = 0;
        audio[3].play();
        isStop = true;
      }
    }
  }

  function resetGame() {
    storage.score = 0;
    scoreBoard.textContent = storage.score;
    storage.level = 1;
    levelBoard.textContent = storage.level;
    winTable.textContent = '';
    isStop = true;
    audio[2].currentTime = 0;
    audio[2].play();
  }

  function stopGame() {
    isStop = true;
    audio[2].currentTime = 0;
    audio[2].play();
  }

  moles.forEach(mole => mole.addEventListener('click', bonk));
  start.addEventListener('click', startGame);
  reset.addEventListener('click', resetGame);
  stop.addEventListener('click', stopGame);
}
