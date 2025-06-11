**A clean, API‑driven To‑Do list app** with a Django REST Framework backend and a JavaScript frontend using fetch

## Features
- Full CRUD via API:
  - Create tasks
  - View task list (newest first)
  - Update tasks (mark complete/incomplete)
  - Delete tasks
- Fetch frontend for dynamic UI without page reloads
- CSRF-safe and validated endpoints
- Ready for enhancements: user auth, due dates, filtering, frontend frameworks
  
---

## Tech Stack

- **Backend**: Python, Django, Django REST Framework
- **Frontend**: HTML + CSS + JavaScript `fetch` 
- **Database**: SQLite (default), easy to switch to PostgreSQL

---

## Install app on your local host

### 1. Clone the repository
```bash
git clone https://github.com/Gameel-ali1/DRF-full-stack-todo-list-application.git
cd DRF-full-stack-todo-list-application
```

### 2. Set up a virtual environment
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Apply database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Run the development server
```bash
python manage.py runserver
```

Frontend files are served from `index.html` from the `frontend/` folder in your browser.

### 6. Try it out
Open index.html in your browser

## Project Structure

```
taskapi/                    # Django project root
├── taskapi/               # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── tasks/                 # Django app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
└── manage.py

frontend/                  # Frontend files
├── index.html
├── styles/
│   └── main.css
└── scripts/
    └── main.js
```

---

## 🌟 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file.


