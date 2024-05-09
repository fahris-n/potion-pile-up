import os
from datetime import datetime, timedelta
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

# Importing necessary config settings and functions
from secret import DATABASE_URI, SECRET_KEY
from functions import login_required, is_valid_password, is_profane, is_username_valid, load_bad_words
from models import db, users, highscores

# Load bad words from file for username checking
bad_words = load_bad_words('badwords.txt')

# Configure Flask application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30)
Session(app)

# Connect to MySQL database hosted on railway
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# Initialize SQLAlchemy with application
db.init_app(app)

# Set secret key
app.config['SECRET_KEY'] = SECRET_KEY


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            flash('Please enter both username and password')
            return render_template('login.html')

        # Query users table for username
        user = users.query.filter_by(username=username).first()

        # If username doesn't exist or the password hash stored in table doesn't match to password hash being attempted at login, flash error message and re-render login template
        if not user or not check_password_hash(user.password, password):
            flash('Invalid username or password')
            return render_template('login.html')
        else:
            session['user_id'] = user.id
            return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":

        username = request.form.get('username')
        password = request.form.get('password')
        confirmation_password = request.form.get('confirmation')

        if not all ([username, password, confirmation_password]):
            flash('Missing required fields')
            return render_template('register.html')
        
        if not is_profane(username, bad_words):
            flash('Username has been deemed profane and was not accepted')
            return render_template('register.html')

        if not is_username_valid(username):
            flash('Username must be 18 or less characters and not contain spaces or special characters')
            return render_template('register.html')

        if not is_valid_password(password):
            flash('Password must be between 8 and 20 characters in length and contain at least one special character')
            return render_template('register.html')

        if password != confirmation_password:
            flash('Passwords do not match')
            return render_template('register.html')
        
        # Check if user already exists
        existing_user = users.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already in use')
            return render_template('register.html')

        # Create new user in table if username does not exist and all other reqs are met
        new_user = users(username=username, password=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()
    
        # Return user to landing page
        flash('Registration successful!')
        return redirect("/login")
    
    else:
        return render_template("register.html")


@app.route("/acknowledgements", methods=["GET"])
def acknowledgements():
    return render_template("acknowledgements.html")

if __name__ == "__main__":
    app.run(debug=True)