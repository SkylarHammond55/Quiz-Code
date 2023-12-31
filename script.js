// Quiz questions and answers
const quizQuestions = [
  {
    question: "Inside which HTML element do we put the JavaScript?",
    choices: ["<script>", "<scripting>", "<js>", "<javascript>"],
    correctAnswer: 0
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    choices: ["JavaScript", "Python", "Java", "C++"],
    correctAnswer: 0
  },
  {
    question: "Where is the correct place to insert a JavaScript?",
    choices: ["The <head> section  ", "Both the <head> section and the <body> section are correct  ", "The <body> section"],
    correctAnswer: 1
  },
  {
    question: "The external JavaScript file must contain the <script> tag.",
    choices: ["True", "False "],
    correctAnswer: 1
  },
  {
    question: "How do you write Hello World in an alert box?",
    choices: ["alert(Hello World);", "msg(Hello World);", "msgBox(Hello World);", "alertBox(Hello World);"],
    correctAnswer: 0
  },
  {
    question: "How do you create a function in JavaScript?",
    choices: ["function myFunction()  ", "function = myFunction()", "function:myFunction()",],
    correctAnswer: 0
  },
  {
    question: "How do you call a function named myFunction?",
    choices: ["call myFunction()", "myFunction()", "call function myFunction()",],
    correctAnswer: 1
  },
  {
    question: "How to write an IF statement in JavaScript?",
    choices: ["if i = 5 then  ", "if i = 5", "if i == 5 then", "if (i == 5) "],
    correctAnswer: 3
  },
  {
    question: "How can you add a comment in a JavaScript?",
    choices: ["<!--This is a comment-->  ", "//This is a comment  ", "'This is a comment",],
    correctAnswer: 1
  },
  // Add more quiz questions here
];

const startButton = document.getElementById("start-btn");
const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const resultElement = document.getElementById("result");
const timerElement = document.getElementById("time-remaining");
const scoreForm = document.getElementById("score-form");
const initialsInput = document.getElementById("initials");
const scoreList = document.getElementById("score-list");
let currentQuestionIndex = 0;
let timeLeft = 60;
let timerInterval;
let score = 0;

function startQuiz() {
  startButton.disabled = true;
  timerInterval = setInterval(updateTimer, 1000);
  displayQuestion();
  startButton.removeEventListener("click", startQuiz);
}
function displayQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  choicesElement.innerHTML = "";

  for (let i = 0; i < currentQuestion.choices.length; i++) {
    const choice = currentQuestion.choices[i];
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = choice;
    button.addEventListener("click", () => {
      checkAnswer(i);
    });
    li.appendChild(button);
    choicesElement.appendChild(li);
  }
}

function checkAnswer(choiceIndex) {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (choiceIndex === currentQuestion.correctAnswer) {
    resultElement.textContent = "Correct!";
    score += 10; // Add 10 points for correct answer
  } else {
    resultElement.textContent = "Incorrect!";
    timeLeft -= 10; // Deduct 10 seconds from the timer for incorrect answer
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

function updateTimer() {
  timeLeft--;
  timerElement.textContent = timeLeft;

  if (timeLeft <= 0) {
    endQuiz();
  }
}

function calculateScore() {
  // Calculate the final score based on the time left and points earned
  return timeLeft + score;
}


function endQuiz() {
  clearInterval(timerInterval);
  questionElement.textContent = "";
  choicesElement.innerHTML = "";
  timerElement.textContent = "";

  const finalScore = document.createElement("p");
  const totalScore = calculateScore(); // Use the calculateScore function to get the final score
  finalScore.textContent = `Final Score: ${totalScore} (Time Left: ${timeLeft} seconds)`;
  resultElement.textContent = "";
  resultElement.appendChild(finalScore);

  scoreForm.style.display = "block";
  scoreList.style.display = "block";
  startButton.disabled = false;
  startButton.textContent = "Restart Quiz";

  scoreForm.addEventListener("submit", saveScore);

  startButton.addEventListener("click", restartQuiz);
}


function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60; // Reset the timer to its initial value
  resultElement.textContent = "";
  initialsInput.value = "";
  scoreForm.style.display = "none";
  scoreList.innerHTML = "";
  startButton.removeEventListener("click", restartQuiz);
  startQuiz();
}

function saveScore(event) {
  event.preventDefault();
  const initials = initialsInput.value;
  const score = calculateScore(); // Use the calculateScore function to get the final score

  // Save score to local storage
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ initials, score });

  // Sort scores in descending order based on score value
  scores.sort((a, b) => b.score - a.score);

  // Save only the highest scores (up to a certain limit, e.g., 10)
  const highestScores = scores.slice(0, 10);

  localStorage.setItem("scores", JSON.stringify(highestScores));

  scoreForm.style.display = "none";

  // Display saved scores
  displayScores();
}





function displayScores() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scoreList.innerHTML = "";

  scores.forEach((score) => {
    const scoreItem = document.createElement("li");
    scoreItem.textContent = `${score.initials}: ${score.score}`;
    scoreList.appendChild(scoreItem);
  });
}

startButton.addEventListener("click", startQuiz);

// Display saved scores on page load
displayScores();

startButton.addEventListener("click", startQuiz);
