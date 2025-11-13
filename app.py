import os
import logging
from flask import Flask, render_template, jsonify
import json
import random

app = Flask(__name__)

# Suppress Werkzeug/Flask info logs except errors
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

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
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        print("Open your browser and go to: http://127.0.0.1:5000")
    app.run(debug=True)
