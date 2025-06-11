class TaskManager {
    constructor() {
        this.apiUrl = 'http://127.0.0.1:8000/api/tasks/';
        this.currentFilter = 'all';
        this.tasks = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadTasks();
    }
    
    bindEvents() {
        // Form submission
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
        
        // Filter buttons
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Clear completed button
        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompleted();
        });
    }
    
    async loadTasks() {
        try {
            this.showLoading(true);
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.tasks = await response.json();
            this.renderTasks();
        } catch (error) {
            this.showError('Failed to load tasks. Please try again.');
            console.error('Error loading tasks:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    async addTask() {
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        
        if (!title) {
            this.showError('Please enter a task title');
            return;
        }
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    description: description
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newTask = await response.json();
            this.tasks.unshift(newTask);
            
            // Clear form
            titleInput.value = '';
            descriptionInput.value = '';
            
            this.renderTasks();
            this.hideError();
        } catch (error) {
            this.showError('Failed to add task. Please try again.');
            console.error('Error adding task:', error);
        }
    }
    
    async toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        try {
            const response = await fetch(`${this.apiUrl}${taskId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: !task.completed
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedTask = await response.json();
            const taskIndex = this.tasks.findIndex(t => t.id === taskId);
            this.tasks[taskIndex] = updatedTask;
            
            this.renderTasks();
        } catch (error) {
            this.showError('Failed to update task. Please try again.');
            console.error('Error updating task:', error);
        }
    }
    
    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}${taskId}/`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
        } catch (error) {
            this.showError('Failed to delete task. Please try again.');
            console.error('Error deleting task:', error);
        }
    }
    
    async clearCompleted() {
        const completedTasks = this.tasks.filter(t => t.completed);
        if (completedTasks.length === 0) {
            this.showError('No completed tasks to clear');
            return;
        }
        
        if (!confirm(`Delete ${completedTasks.length} completed tasks?`)) {
            return;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}clear_completed/`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.tasks = this.tasks.filter(t => !t.completed);
            this.renderTasks();
        } catch (error) {
            this.showError('Failed to clear completed tasks. Please try again.');
            console.error('Error clearing completed tasks:', error);
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }
    
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(t => t.completed);
            case 'pending':
                return this.tasks.filter(t => !t.completed);
            default:
                return this.tasks;
        }
    }
    
    renderTasks() {
        const tasksList = document.getElementById('tasks-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        tasksList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="taskManager.toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </li>
        `).join('');
    }
    
    showLoading(show) {
        document.getElementById('loading').classList.toggle('hidden', !show);
    }
    
    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => this.hideError(), 5000);
    }
    
    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});