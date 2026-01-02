const Task = require("./Task");
const fs = require("fs");

class TaskManager {
    constructor() {
        this.tasks = [];
        this.settings = this.loadSettings();
    }

    loadSettings() {
        try {
            const data = fs.readFileSync("settings.json", "utf8");
            return JSON.parse(data);
        } catch (err) {
            return { autoRemove: true };
        }
    }

    saveSettings() {
        fs.writeFileSync("settings.json", JSON.stringify(this.settings, null, 2));
    }

    toggleAutoRemove() {
        this.settings.autoRemove = !this.settings.autoRemove;
        this.saveSettings();
        return this.settings.autoRemove;
    }

    addTask(text) {
        this.tasks.push(new Task(text));
    }

    viewTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks yet.");
            return;
        }

        console.log("\nYour Tasks:");
        this.tasks.forEach((task, index) => {
            const status = task.completed ? "[✔]" : "[ ]";
            console.log(`${index + 1}. ${status} ${task.text}`);
        });
    }

    updateTask(index, newText) {
        if (!this.tasks[index]) return false;
        this.tasks[index].update(newText);
        return true;
    }

    completeTask(index) {
        if (!this.tasks[index]) return false;

        this.tasks[index].markCompleted();

        if (this.settings.autoRemove) {
            this.tasks.splice(index, 1);
        }

        return true;
    }

    removeCompleted() {
        const before = this.tasks.length;
        this.tasks = this.tasks.filter(task => !task.completed);
        return before - this.tasks.length;
    }
}

module.exports = TaskManager;