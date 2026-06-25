# Event Registration App

This is my project for the Programming course. It is a simple web app where a
user can register for a technology event. I made it with HTML, CSS and
JavaScript.

Author: Murat Turan
Student number: W73124
Course: Programming (instructor: Pawel Janda)

## How to run it

Just open the `index.html` file in a web browser (for example double click on
it). There is nothing to install.

## What the app does

- The user fills in the form: full name, email, age, a technology and the
  terms checkbox.
- When the form is sent, JavaScript reads the values and checks them.
- If something is not correct, it shows a red error message.
- If everything is correct, it shows a green message and the person is added to
  the participant list under the form.

## Extra things I added

- A delete button for each participant.
- A search box to find people by name or email.
- A filter to show only one technology.
- A small statistics box (how many people, how many like JavaScript, the
  average age and the most popular technology).
- The participants are saved in the browser with localStorage, so they are
  still there after I refresh the page.

## Files

- index.html - the page and the form
- style.css - the styles
- script.js - the JavaScript (validation, the list and the extra features)
