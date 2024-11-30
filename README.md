# Potion Pile Up

Potion Pile Up is a Flask-based web application that integrates a simple JavaScript game with user account creation and high score tracking features. Users can sign up, play the game, and track their best scores. However, due to the app using a private database URI and secret key, users cannot run it locally without access to those credentials.

## Features
- **Account Creation:** Users can sign up with an account to save their high scores.
- **High Score Tracking:** Tracks and displays players' best scores.
- **Simple JavaScript Game:** A fun, casual game built using pure JavaScript.

## Requirements

To run this application locally, you would need:
- Access to the private database URI and secret key.
- A Python environment to run the Flask app.

## Installation (for Developers with Credentials)

If you have the necessary credentials, follow these steps to set up the app locally:

1. Clone this repository:
   
   ```bash
   git clone https://github.com/fahris-n/potion-pile-up.git

2. Naviagte to the project directory:

   ```bash
   cd potion-pile-up

3. Create a .env file in the root directory and add the following environment variables

   ```bash
   DATABASE_URI=your_database_uri_here
   SECRET_KEY=your_secret_key_here

4. Install the required Python packages

   ```bash
   pip install -r requirements.txt

5. Run the flask app

   ```bash
   flask run

6. Access the webapp at http://127.0.0.1:5000

## Limitations
- The app cannot be run locally without access to the private database URI and secret key.
- Please contact the repository owner for access to these credentials or consider deploying the app on a public server where it can be accessed remotely.

## Contributing
Feel free to fork this project, create pull requests, or open issues if you find bugs or have ideas for new features. However, please be aware that access to the app's private database is required to run the app locally.

## License
This project is open-source and available under the MIT License
