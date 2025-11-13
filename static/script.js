let questions = [];
let currentIndex = 0;
let userAnswers = [];
let wrongCount = 0;
const maxWrongs = 3;

// Load quiz questions
async function loadQuiz() {
  try {
    const res = await fetch("/api/questions");
    questions = await res.json();
    showQuestion(currentIndex);
  } catch (err) {
    console.error("Failed to load quiz:", err);
    document.getElementById("quiz-container").textContent =
      "Error loading quiz. Please try again later.";
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
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index}`;
    input.value = j;
    if (userAnswers[index] === j) input.checked = true;

    const span = document.createElement("span");
    span.textContent = ` ${choice}`;

    input.addEventListener("change", () => {
      userAnswers[index] = j;
      updateChoiceHighlight(index);
      checkAnswer(q.answer, j); // check immediately
    });

    label.appendChild(input);
    label.appendChild(span);
    qDiv.appendChild(label);
  });

  quizContainer.appendChild(qDiv);
  updateProgressBar();
  toggleButtons();
}

// Highlight the selected label
function updateChoiceHighlight(index) {
  const labels = document.querySelectorAll(`input[name="q${index}"]`);
  labels.forEach(input => {
    if (Number(input.value) === userAnswers[index]) {
      input.nextSibling.style.background = "#007bff";
      input.nextSibling.style.color = "#fff";
    } else {
      input.nextSibling.style.background = "#f9f9f9";
      input.nextSibling.style.color = "#000";
    }
  });
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

// Button handling
function toggleButtons() {
  document.getElementById("prev-btn").classList.toggle("hidden", currentIndex === 0);
  document.getElementById("next-btn").classList.toggle("hidden", currentIndex === questions.length - 1);
  document.getElementById("submit-btn").classList.toggle("hidden", currentIndex !== questions.length - 1);
}

// Progress bar
function updateProgressBar() {
  const percent = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

document.getElementById("next-btn").addEventListener("click", () => {
  saveAnswer();
  if (currentIndex < questions.length - 1) {
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

// Submit quiz manually
document.getElementById("submit-btn").addEventListener("click", () => {
  saveAnswer();
  endQuiz();
});

// Save selected answer
function saveAnswer() {
  const selected = document.querySelector(`input[name="q${currentIndex}"]:checked`);
  userAnswers[currentIndex] = selected ? Number(selected.value) : null;
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
}

// Redo quiz function
function redoQuiz() {
  currentIndex = 0;
  userAnswers = [];
  wrongCount = 0;

  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  // Remove the redo button
  const redoBtn = document.getElementById("redo-btn");
  if (redoBtn) redoBtn.remove();

  loadQuiz(); // reload questions
}

// Start quiz
loadQuiz();
