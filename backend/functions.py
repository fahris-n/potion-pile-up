from flask import session, redirect
from functools import wraps
import re

# Create login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

# Create bad_words list from bad_words.txt file
def load_bad_words(filename):
    file = open('badwords.txt', 'r')
    bad_words = [line.strip() for line in file]
    return bad_words

# Create username profanity checker function
def is_profane(username, bad_words):
    if username.lower() in bad_words:
        return False
    
    return True

# Create username checker function
def is_username_valid(username):
    pattern = r'[!@#$%^&*(),.?":{}|<>-]'
    if len(username) > 18:
        return False
    if ' ' in username:
        return False 
    if re.search(pattern, username):
        return False
  
    return True

# Create password checker function
def is_valid_password(password):
    pattern = r"^(?=.{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).*"
    return bool(re.match(pattern, password))