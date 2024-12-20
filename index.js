// Task Management Class
class TaskManager {
    constructor() {
        this.todoList = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todo-input');
        this.addButton = document.getElementById('add-button');
        this.deleteAllButton = document.getElementById('delete-all');
        this.deleteSelectedButton = document.getElementById('delete-selected');
        this.todosList = document.getElementById('all-todos');
        this.filterButtons = document.querySelectorAll('.nav-item');
    }

    bindEvents() {
        this.addButton.addEventListener('click', () => this.addTask());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.deleteAllButton.addEventListener('click', () => this.deleteAllTasks());
        this.deleteSelectedButton.addEventListener('click', () => this.deleteCompletedTasks());
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    addTask() {
        const taskText = this.todoInput.value.trim();
        if (!taskText) {
            this.showNotification('Please enter a task!', 'error');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        this.todoList.unshift(newTask);
        this.todoInput.value = '';
        this.saveAndRender();
        this.showNotification('Task added successfully!', 'success');
    }

    toggleTask(id) {
        const task = this.todoList.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveAndRender();
        }
    }

    deleteTask(id) {
        this.todoList = this.todoList.filter(task => task.id !== id);
        this.saveAndRender();
        this.showNotification('Task deleted!', 'success');
    }

    deleteAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.todoList = [];
            this.saveAndRender();
            this.showNotification('All tasks deleted!', 'success');
        }
    }

    deleteCompletedTasks() {
        this.todoList = this.todoList.filter(task => !task.completed);
        this.saveAndRender();
        this.showNotification('Completed tasks cleared!', 'success');
    }

    handleFilter(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todoList.filter(task => task.completed);
            case 'pending':
                return this.todoList.filter(task => !task.completed);
            default:
                return this.todoList;
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.todosList.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-list-ul'></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }

        this.todosList.innerHTML = filteredTasks.map(task => `
            <li class="todo-item" data-id="${task.id}">
                <div class="todo-content">
                    <div class="todo-checkbox ${task.completed ? 'checked' : ''}"
                         onclick="taskManager.toggleTask('${task.id}')">
                        ${task.completed ? '<i class="bx bx-check"></i>' : ''}
                    </div>
                    <span class="todo-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <div class="todo-actions">
                    <button class="btn btn-outline" onclick="taskManager.deleteTask('${task.id}')">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </li>
        `).join('');

        this.updateStats();
    }

    updateStats() {
        document.getElementById('r-count').textContent = this.todoList.length;
        document.getElementById('c-count').textContent = 
            this.todoList.filter(task => task.completed).length;
    }

    saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(this.todoList));
        this.render();
    }

    showNotification(message, type) {
        // Implementation of notification system
        // You can use a library like toastify-js or create your own
        alert(message);
    }
}

// Initialize the Task Manager
const taskManager = new TaskManager();