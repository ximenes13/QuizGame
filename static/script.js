let questions = [];
let currentIndex = 0;
let userAnswers = [];
let wrongCount = 0;
const maxWrongs = 3;
let skippedQuestions = [];

// Load quiz questions
async function loadQuiz() {
  try {
    const res = await fetch("/api/questions");
    questions = await res.json();
    showQuestion(currentIndex);
  } catch (err) {
    console.error("Failed to load quiz:", err);
    document.getElementById("quiz-container").textContent = "Error loading quiz. Please try again later.";
  }
}

// Show a single question
function showQuestion(index) {
  const q = questions[index];
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  const qDiv = document.createElement("div");
  qDiv.classList.add("question");

  const h3 = document.createElement("h3");
  h3.textContent = `${index + 1}. ${q.question}`;
  qDiv.appendChild(h3);

  q.choices.forEach((choice, j) => {
    const label = document.createElement("label");
    label.classList.add("quiz-choice-label");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index}`;
    input.value = j;
    if (userAnswers[index] === j) input.checked = true;

    input.addEventListener("change", () => {
      userAnswers[index] = j;
      updateChoiceHighlight(index);
      checkAnswer(q.answer, j);
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(choice));
    qDiv.appendChild(label);
  });

  quizContainer.appendChild(qDiv);
  updateChoiceHighlight(index);
  updateProgressBar();
  toggleButtons();
}

// Highlight the selected label and check Next state
function updateChoiceHighlight(index) {
  const labels = document.querySelectorAll(`#quiz-container .question label`);
  labels.forEach((label, j) => {
    label.classList.remove("selected-choice", "unselected-choice", "eliminated-choice");
    if (userAnswers[index] === j) {
      label.classList.add("selected-choice");
    } else {
      label.classList.add("unselected-choice");
    }
  });
  // Enable Next only if selected
  document.getElementById('next-btn').disabled = userAnswers[index] == null;
}

// Hint Button logic (eliminate a wrong choice, only once per question)
document.getElementById("hint-btn").addEventListener("click", () => {
  const q = questions[currentIndex];
  const correctIndex = q.answer;
  const labels = document.querySelectorAll(`#quiz-container .question label`);
  const toEliminate = [];
  labels.forEach((label, i) => {
    if (i !== correctIndex && i !== userAnswers[currentIndex]) toEliminate.push(i);
  });
  if(toEliminate.length > 0) {
    const eliminate = toEliminate[Math.floor(Math.random() * toEliminate.length)];
    labels[eliminate].classList.add("eliminated-choice");
  }
});

// Skip Button logic
document.getElementById("skip-btn").addEventListener("click", () => {
  if (!skippedQuestions.includes(currentIndex)) {
    skippedQuestions.push(currentIndex);
  }
  saveAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
  }
});

// Next button logic
document.getElementById("next-btn").addEventListener("click", () => {
  saveAnswer();
  if (userAnswers[currentIndex] != null && currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  saveAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion(currentIndex);
  }
});

// Show "Review Skipped" button if needed
function toggleButtons() {
  document.getElementById("prev-btn").classList.toggle("hidden", currentIndex === 0);
  document.getElementById("next-btn").classList.toggle("hidden", currentIndex === questions.length - 1);
  document.getElementById("submit-btn").classList.toggle("hidden", currentIndex !== questions.length - 1);

  let reviewBtn = document.getElementById("review-btn");
  if (!reviewBtn && skippedQuestions.length > 0 && currentIndex === questions.length - 1) {
    reviewBtn = document.createElement("button");
    reviewBtn.id = "review-btn";
    reviewBtn.textContent = "Review Skipped";
    reviewBtn.classList.add("review-btn");
    reviewBtn.onclick = reviewSkippedQuestions;
    document.querySelector(".buttons").appendChild(reviewBtn);
  } else if (reviewBtn && (skippedQuestions.length == 0 || currentIndex !== questions.length - 1)) {
    reviewBtn.remove();
  }
}

// Review Skipped logic
function reviewSkippedQuestions() {
  if (skippedQuestions.length > 0) {
    currentIndex = skippedQuestions.shift();
    showQuestion(currentIndex);
  }
}

// Progress bar update
function updateProgressBar() {
  const percent = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

// Submit button handler
document.getElementById("submit-btn").addEventListener("click", () => {
  if (skippedQuestions.length > 0) {
    alert("Please review all skipped questions before submitting.");
    return;
  }
  saveAnswer();
  endQuiz();
});

// Save selected answer
function saveAnswer() {
  const selected = document.querySelector(`input[name="q${currentIndex}"]:checked`);
  userAnswers[currentIndex] = selected ? Number(selected.value) : null;
}

// Check answer and handle wrong attempts
function checkAnswer(correct, selected) {
  if (selected !== correct) {
    wrongCount++;
    alert("Wrong answer!");
    if (wrongCount >= maxWrongs) {
      alert("You have reached the maximum wrong answers. Quiz ends!");
      endQuiz();
    }
  }
}

// End the quiz
function endQuiz() {
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<p>You scored ${score} out of ${questions.length}</p>`;

  // Show redo button
  const redoBtn = document.createElement("button");
  redoBtn.id = "redo-btn";
  redoBtn.textContent = "Redo Quiz";
  redoBtn.addEventListener("click", redoQuiz);
  resultDiv.appendChild(redoBtn);

  resultDiv.classList.remove("hidden");

  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("prev-btn").classList.add("hidden");
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("submit-btn").classList.add("hidden");

  // Hide hint and skip buttons
  document.getElementById("hint-btn").classList.add("hidden");
  document.getElementById("skip-btn").classList.add("hidden");

  let reviewBtn = document.getElementById("review-btn");
  if (reviewBtn) reviewBtn.remove();
}

// Redo quiz function
function redoQuiz() {
  currentIndex = 0;
  userAnswers = [];
  wrongCount = 0;
  skippedQuestions = [];
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  // Remove redo button if present
  const redoBtn = document.getElementById("redo-btn");
  if (redoBtn) redoBtn.remove();

  // Restore visibility for all core buttons
  document.getElementById("hint-btn").classList.remove("hidden");
  document.getElementById("skip-btn").classList.remove("hidden");
  document.getElementById("prev-btn").classList.remove("hidden");
  document.getElementById("next-btn").classList.remove("hidden");
  document.getElementById("submit-btn").classList.remove("hidden");

  // Remove the Review Skipped button in case it's present
  let reviewBtn = document.getElementById("review-btn");
  if (reviewBtn) reviewBtn.remove();

  loadQuiz();
}

// Start the quiz
loadQuiz();
