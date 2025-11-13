from flask import Flask, render_template, jsonify
import json, random

app = Flask(__name__)

def load_questions():
    with open("questions.json", "r", encoding="utf-8") as f:
        return json.load(f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/questions")
def get_questions():
    all_questions = load_questions()
    random_questions = random.sample(all_questions, min(10, len(all_questions)))  # 10 random questions
    return jsonify(random_questions)

if __name__ == "__main__":
    app.run(debug=True)
