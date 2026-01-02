//Create the Task class
class Task {
    constructor(text) {
        this.text = text;
        this.completed = false;
    }

    update(text) {
        this.text = text;
    }

    markCompleted() {
        this.completed = true; //mark task completed
    }

}

module.exports = Task;