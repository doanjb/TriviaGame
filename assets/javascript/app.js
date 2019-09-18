const dict = [];
let correctAnswers, incorrectAnswers, noAnswers, totalQuestions; // counters for player score
let questionTime, questionInterval, breakTime, breakInterval;
const MAX_QUESTION_TIME = 5; // max time for the questionTime
const MAX_BREAK_TIME = 5; // max time for the breakTime

/**
 * function to create and render the question
 * @param {object} parentElement the element to append the question to
 * @param {object} qstn the question to append to the html
 */
const renderQuestion = (parentElement, qstn) => {
  // create the elements
  const time = $('<h3>', { id: 'time' }).text('Time Remaining: 30 Seconds');
  const question = $('<h5>', { id: 'question' }).text(qstn);
  const msg = $('<div>', { id: 'msg' });
  const row = $('<div>', { class: 'row' });

  // append the elements to the html
  parentElement.append(time, question, msg, row);
};

/**
 * function to create and render the answers
 * @param {object} parentElement the element to append the question to
 * @param {number} num the identifier assigned to the element
 * @param {string} answr the answer for a question
 */
const renderAnswers = (parentElement, num, answr) => {
  //create the elements
  const col = $('<col>', { class: 'col-12 mt-3' });
  const answers = $('<button>', {
    class: 'btn btn-primary',
    id: 'answers-' + num
  }).text(answr);

  // append the elements to the html
  col.append(answers);
  parentElement.append(col);
};

/**
 * function to randomly select a question: answer set, render them and check for game logic
 * @param {object} problem a random object containing an answer with an array of answers
 */
const loadQstn = (problem = dict[Math.floor(Math.random() * dict.length)]) => {
  // timer countdown for each question
  questionInterval = setInterval(timeForCurrentQuestion, 1000);

  // clear previous question (if any)
  $('#answersWrap').empty();

  // renders the question
  renderQuestion($('#answersWrap'), problem.question);

  // create a mutable copy of problem.answers
  const copyOfAnswers = [...problem.answers];

  // render the answers
  for (let i = 0; i < 4; i++) {
    // grab a random answer
    const randomizedAnswer =
      copyOfAnswers[Math.floor(Math.random() * copyOfAnswers.length)];

    // render a button with the random answer as text
    renderAnswers($('.row'), i, randomizedAnswer);

    // remove the answer from the array
    copyOfAnswers.splice(copyOfAnswers.indexOf(randomizedAnswer), 1); // remove the random answer

    // attach a click listener to the button and check the answer
    $('#answers-' + i).click(() => {
      // if the answer is correct
      if (randomizedAnswer === problem.answers[0]) {
        correctAnswers++;
        console.log('true');
        nextQuestionCountdown();
        // disable button clicks
        // update the html to show the player got the question right
      }
      // if the answer is incorrect
      else if (randomizedAnswer !== problem.answers[0]) {
        incorrectAnswers++;
        console.log('nope');
        nextQuestionCountdown();
        // disable button clicks
        // update html to show player got the question wrong and display the correct answer
      }
    });
  }
};

/**
 * function to decrement the questionTime, and calls the nextQuestionCountdown
 * when the questionTime reaches 0, function also handles incrementing noAnswers counter
 */
const timeForCurrentQuestion = () => {
  questionTime--; // decrement time
  $('#time').text('Time Remaining: ' + questionTime + ' Seconds'); // render the countdown

  // when the questionTime reaches 0
  if (questionTime === 0) {
    noAnswers++;
    nextQuestionCountdown();
  }
};

/**
 * function to decrement the breakTime, and loads the next question when
 * breaktime reaches 0.
 */
const timeNextQuestion = () => {
  breakTime--; // decrement time

  // when the breakTime reaches 0
  if (breakTime === 0) {
    clearInterval(breakInterval); // stop the countdown
    breakTime = MAX_BREAK_TIME; // reset the time
    loadQstn();
  }
};

/**
 * function to clear the questionTime countdown, reset it, and start the breakTime countdown
 */
const nextQuestionCountdown = () => {
  clearInterval(questionInterval); // stop the countdown
  questionTime = MAX_QUESTION_TIME; // reset the time
  breakInterval = setInterval(timeNextQuestion, 1000); // start the countdown for the next question
};

const initDictionary = () => {
  dict.push(
    {
      question: 'What is the diameter of Earth?',
      answers: ['8,000 miles', '9,300 miles', '7,800 miles', '10,680 miles']
    },
    {
      question: 'Great Whites and Hammerheads are what type of animals?',
      answers: ['Sharks', 'Dolphins', 'Mammals', 'Reptiles']
    },
    {
      question:
        'Which famous nurse was known as “The Lady Of The Lamp” during the crimean war?',
      answers: [
        'Florence Nightingale',
        'Abigail Williams',
        'Napoleon Bonaparte',
        'Yugi Moto'
      ]
    }
  );
};

const init = () => {
  // initialize variables
  correctAnswers = 0;
  incorrectAnswers = 0;
  noAnswers = 0;
  totalQuestions = 0;
  questionTime = MAX_QUESTION_TIME;
  breakTime = MAX_BREAK_TIME;

  $('#startWrap').hide(); // hide start screen

  initDictionary(); // fill the dictionary with triva questions

  loadQstn(); // load the first question
};

window.onload = () => {
  $('#play-button').click(init);
};
