from flask import Flask, render_template, request, jsonify
import sqlite3
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return User(user['id'], user['username'])

class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

# Function to connect to SQLite database
def get_db_connection():
    conn = sqlite3.connect('finance.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database
def init_db():
    with get_db_connection() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT NOT NULL UNIQUE,
                            password TEXT NOT NULL
                        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS budgets (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            amount REAL NOT NULL
                        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS expenses (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            category TEXT NOT NULL,
                            amount REAL NOT NULL
                        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS savings (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            goal REAL NOT NULL
                        )''')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set_budget', methods=['POST'])
def set_budget():
    amount = request.json['amount']
    with get_db_connection() as conn:
        conn.execute('INSERT INTO budgets (amount) VALUES (?)', (amount,))
    return jsonify({'message': 'Budget set successfully!', 'amount': amount})

@app.route('/add_expense', methods=['POST'])
def add_expense():
    category = request.json['category']
    amount = request.json['amount']
    with get_db_connection() as conn:
        conn.execute('INSERT INTO expenses (category, amount) VALUES (?, ?)', (category, amount))
    return jsonify({'message': 'Expense added successfully!', 'category': category, 'amount': amount})

@app.route('/set_savings', methods=['POST'])
def set_savings():
    goal = request.json['goal']
    with get_db_connection() as conn:
        conn.execute('INSERT INTO savings (goal) VALUES (?)', (goal,))
    return jsonify({'message': 'Savings goal set successfully!', 'goal': goal})

@app.route('/get_data', methods=['GET'])
def get_data():
    with get_db_connection() as conn:
        budget = conn.execute('SELECT * FROM budgets ORDER BY id DESC LIMIT 1').fetchone()
        expenses = conn.execute('SELECT * FROM expenses').fetchall()
        savings = conn.execute('SELECT * FROM savings ORDER BY id DESC LIMIT 1').fetchone()
        
    return jsonify({
        'budget': budget['amount'] if budget else 0,
        'expenses': [dict(expense) for expense in expenses],
        'savings': savings['goal'] if savings else 0
    })

if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(debug=True)
