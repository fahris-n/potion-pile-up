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
    if len(username) > 18:
        return False
    if ' ' in username:
        return False 
    if r'[!@#$%^&*(),.?":{}|<>-]' in username:
        return False
  
    return True

# Create password checker function
def is_valid_password(password):
    if len(password) < 8 or len(password) > 20:
        return False
    
    # Define regular expression pattern
    special_char = r'[!@#$%^&*(),.?":{}|<>]'

    # Check if password contains at least one of the special characters from the pattern
    if not re.search(special_char, password):
        return False
    
    return True