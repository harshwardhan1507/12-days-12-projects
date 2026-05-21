# 🔢 Scientific Calculator

A responsive, glassmorphism-styled **scientific calculator** built with plain HTML, CSS and JavaScript. It supports both basic and scientific operations, a calculation history (saved to Local Storage), and keyboard input.

---

## 🚀 Features

- Basic arithmetic: + − × ÷
- Scientific functions: sin, cos, tan, log, ln, √, x^y
- Toggle between Basic and Scientific modes
- Calculation history persisted in Local Storage
- Keyboard support for numbers and common operators
- Responsive layout with clean glass-style UI

---

## 🛠️ Tech Stack

- HTML – Semantic structure
- CSS – Styling (glassmorphism + responsive)
- JavaScript – Calculator logic, event handling, Local Storage

---

## 🎯 Purpose

This project strengthens DOM manipulation, event handling, and working with numeric input and math functions. It is Day 05 of the *12 Days – 12 Projects* challenge.

---

## 📁 Project Structure

```text
calculator/
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## ⚙️ How It Works

1. Button clicks and keyboard events are handled by JavaScript listeners.
2. The input expression is validated and evaluated using a safe parsing routine.
3. Results and previous calculations are stored in a history array and saved to Local Storage.
4. UI updates show current input, result, and an optional history panel.

---

## 🧠 Concepts Practiced

- Event-driven programming (click + keyboard)
- Parsing and evaluating mathematical expressions
- Local Storage for simple persistence
- Responsive UI and accessibility considerations

---

## 📌 Future Enhancements

- Add parentheses-aware expression parsing (full infix parser)
- Improve keyboard shortcuts and scientific key mappings
- Add export/import for history
- Add unit tests for the parsing/evaluation logic

---

## 👤 Author

**Harsh Wardhan**

- GitHub: https://github.com/Haruto-x-Okura
- LinkedIn: https://www.linkedin.com/in/harsh-wardhan-singh-cse/

---

## 📄 License

Open-source for learning and personal use.
