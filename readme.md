# 🌟 TaskFlow — Your Simple Task Manager

TaskFlow is a lightweight, responsive task management app built using plain HTML, CSS (Tailwind), and JavaScript. It helps you manage your tasks efficiently with features like filtering, search, priority levels, data export/import, and keyboard shortcuts.

---

## ✨ Features

✅ Add, complete, archive,tasks  
✅ Priority levels: High, Medium, Low  
✅ Search and filter tasks by title and priority  
✅ Task counters for each tab (Todo, Completed, Archived)  
✅ Export tasks to `.json` file  
✅ Import tasks from `.json` file  
✅ Responsive and mobile-friendly UI  
✅ Smooth toast notifications  
✅ Keyboard shortcuts for quick navigation  
✅ Simple user authentication (Name & DOB)

---

## 🚀 How to Run

1. Clone or download the repository
2. Open `index.html` in your browser
3. Enter your name and date of birth to verify
4. Manage your tasks on `app.html`

---

## 🎨 Tech Stack

- **HTML5**
- **Tailwind CSS**
- **Vanilla JavaScript**
- **Local Storage** for data persistence

---

## 🎛 Keyboard Shortcuts

| Shortcut   | Action                                          |
| ---------- | ----------------------------------------------- |
| `Ctrl + 1` | Go to **Todo** tab                              |
| `Ctrl + 2` | Go to **Completed** tab                         |
| `Ctrl + 3` | Go to **Archived** tab                          |
| `Enter`    | Quickly add a task (when focused on task input) |

---

## 📦 File Structure

```
├── index.html       // Login/Verification page
├── app.html         // Main Task Manager
├── output.css       // Tailwind CSS output
├── output.css       //  styling CSS
├── app.js           // Main app logic
├── script.js        // Login page logic
```

---

## 📝 Notes

- All data is stored locally in your browser using Local Storage.
- Refreshing the page will retain tasks.
- You can export and import your tasks manually as backup.
- Age validation ensures only users older than 10 can access the app.
