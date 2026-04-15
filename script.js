class TodoApp {
    constructor() {
        this.loadTasks();
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push({ text: task, completed: false });
        this.saveTasks();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
    }

    toggleComplete(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}