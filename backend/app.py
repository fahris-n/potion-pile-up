import os
from datetime import datetime, timedelta
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import secrets

# Importing necessary config settings and utility functions
from secret import DATABASE_URI, SECRET_KEY
from functions import login_required, is_valid_password, is_profane, is_username_valid, load_bad_words
from models import db, users, highscores

# Configure Flask application
app = Flask(__name__)

# Load bad words from file for username validation
try:
    bad_words = load_bad_words('badwords.txt')
except Exception as e:
    print(f"Error loading bad words: {e}")
    bad_words = []

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set session idle timeout period
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30)

# Configure database URI for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# Initialize SQLAlchemy with Flask application
db.init_app(app)

# Set secret key for session management and CSRF protection
app.config['SECRET_KEY'] = SECRET_KEY

# Generate CSRF token in the session before handling each request
@app.before_request
def before_request():
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(16)


# Ensure responses are not cached to avoid serving stale data
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Route for game page. Requires users to be logged in
@app.route("/")
@login_required
def index():
    return render_template("index.html")


# Route for user login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        csrf_token_clientside = request.form.get("csrf_token")

        # Validate form inputs for non-empty values
        if not username or not password:
            flash('Please enter both username and password')
            return render_template('login.html')

        # Validate CSRF token
        if csrf_token_clientside != session['csrf_token']:
            flash('CSRF Token Invalid')
            return render_template('login.html')

        # Query database for the user
        try:
            user = users.query.filter_by(username=username).first()
        except Exception as e:
            print(f"An error occured while querying the database: {e}")
            return render_template("login.html")

        # Validate user credentials.
        if not user or not check_password_hash(user.password, password):
            flash('Invalid username or password')
            return render_template('login.html')
        else:
            session['user_id'] = user.id
            return redirect("/")

    # Render login template with CSRF token for GET requests
    else:
        return render_template("login.html", csrf_token=session['csrf_token'])


# Route for user logout
@app.route("/logout")
def logout():
    # Clear the session to log the user out
    session.clear()
    # Redirect user to logged out form
    return render_template("logout.html")


# Route for user registration
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        confirmation_password = request.form.get('confirmation')
        csrf_token_clientside = request.form.get('csrf_token')

        # Validate registration form inputs
        if not all ([username, password, confirmation_password]):
            flash('Missing required fields')
            return render_template('register.html')
        
        # Check for profanity in username
        if not is_profane(username, bad_words):
            flash('Username has been deemed profane and was not accepted')
            return render_template('register.html')

        # Validate username and password according to policy
        if not is_username_valid(username):
            flash('Username must be 18 or less characters and not contain spaces or special characters')
            return render_template('register.html')

        if not is_valid_password(password):
            flash('Password must be between 8 and 20 characters, include a special character, an upper and lowercase letter, and a digit')
            return render_template('register.html')

        # Ensure password and confirmation match
        if password != confirmation_password:
            flash('Passwords do not match')
            return render_template('register.html')
        
        # Check if username is already taken
        try:
            existing_user = users.query.filter_by(username=username).first()
        except Exception as e:
            flash(f"An error occured while checking for existing username: {e}")
            return render_template("register.html")

        if existing_user:
            flash('Username already in use')
            return render_template('register.html')

        # Validate CSRF token
        if csrf_token_clientside != session['csrf_token']:
            flash('CSRF Token Invalid')
            return render_template('login.html')

        # Create and save the new user to the database
        try:
            new_user = users(username=username, password=generate_password_hash(password))
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            flash(f"An error occured during registration: {e}")
            return render_template("register.html")
    
        # Notify user of successful registration
        flash('Registration successful!')
        return render_template("registered.html")
    
    # Render registration template with CSRF token for GET requests
    else:
        return render_template("register.html", csrf_token=session['csrf_token'])


# Route for leaderboard
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    return render_template("leaderboard.html")


# Route for acknowledgements page
@app.route("/acknowledgements", methods=["GET"])
def acknowledgements():
    return render_template("acknowledgements.html")


# Route for admin panel
@app.route("/admin", methods=["GET"])
@login_required
def admin():
    if session["user_id"] == 1:
        # Query all usernames from users table
        try:
            usernames = users.query.with_entities(users.username).all()
            usernames_list = [username[0] for username in usernames]
            total_users = len(usernames_list)
        except Exception as e:
            flash(f"Error occured while fetching user data: {e}")
            return redirect("/")
        
        return render_template("admin.html", usernames_list=usernames_list, total_users=total_users)
    else:
        flash("Admin permissions not found")
        return redirect("/")


# Run the application in debug mode
if __name__ == "__main__":
    app.run(debug=True)
