# 🎮 Interactive Quiz Game (Flask + JavaScript)

This project is a fully interactive web-based quiz application built using Python (Flask) for the backend and HTML/CSS/JavaScript for the frontend. It dynamically loads random questions, tracks user answers, supports hints, skipping questions, reviewing skipped items, and ends the quiz automatically after too many wrong attempts. The UI is modern, colorful, and responsive.

---

## 🚀 Features

- 🧠 10 random questions loaded dynamically from `questions.json`
- 💡 Hint system that eliminates one wrong answer
- ⏭️ Skip questions and review skipped ones later
- 🔙 Previous / Next navigation
- 📊 Smooth progress bar that updates per question
- ❌ Auto-end quiz after 3 wrong answers
- 📝 Submit only when all questions (including skipped ones) are answered
- 🔄 Redo Quiz button resets everything
- 🎨 Modern UI with neumorphic styling (custom CSS)
- 🧩 Fully front-end driven logic with clean separation from Flask backend

---

## 🖥️ Technologies Used

- Python 3.x  
- Flask (serves HTML + API route for quiz data)  
- HTML5  
- CSS3 (custom neumorphic theme)  
- Vanilla JavaScript  
- Works in all modern browsers (Chrome, Firefox, Edge, Safari)

---

## 📂 Project Structure

- **app.py** – Flask backend  
  - 🚀 Serves `index.html`  
  - 🎲 Provides `/api/questions` with 10 random questions  
  - 🧩 Manages backend routes  
  - 🔧 Runs in debug mode  

- **questions.json** – Question bank  
  - 🧠 Stores questions, choices, and correct answers  
  - 🎯 Simple and editable JSON  
  - 🔄 Randomized per session  

- **templates/index.html** – Main UI  
  - 🏗️ Page structure  
  - 🎛️ Buttons, progress bar, layout  
  - 🔗 Neumorphic custom CSS  
  - ⚡ Works with `script.js`  

- **static/style.css** – Styling  
  - 🎨 Neumorphic theme  
  - ✨ Choice animations  
  - 📊 Progress bar design  
  - 🎛️ Button effects  

- **static/script.js** – Quiz logic  
  - 📥 Loads questions from Flask API  
  - 🔄 Handles navigation (Next, Previous, Skip, Review)  
  - 💡 Implements hint system  
  - ❌ Auto-ends quiz after 3 wrong answers  
  - 🧮 Calculates the score  
  - 🔄 “Redo Quiz” functionality  
  - 🧠 Tracks answers, skipped questions, and wrong count  

---

## 🛠️ Setup

### Step 1: Clone the Repository

`git clone https://github.com/your-username/QuizGame.git`

### Step 2: Dependencies

Make sure you have Python 3.x installed. You can check your version with:

`python3 --version`

Make sure to install Flask with:

`pip install flask`

### Step 3: Run the project

Start the Flask server:

`python3 app.py`

Then open in your browser:

`http://127.0.0.1:5000`

--- 

## ✏️ Editing / Adding Questions

All questions are stored in questions.json using this format:

`{
  "question": "What is 2 + 2?",
  "choices": ["2", "3", "4", "5"],
  "answer": "4"
}
`

To add questions:
  - Open `questions.json`
  - Add new objects following the same structure
  - Save and restart the Flask server

The app will automatically pull new random questions.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project, feel free to:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Submit a pull request.

If you find bugs or have feature requests, please [open an issue](https://github.com/ximenes13/QuizGame/issues).

