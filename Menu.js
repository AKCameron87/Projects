class Menu {
    constructor(taskManager) {
        this.taskManager = taskManager;

        this.rl = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    ask(question) {
        return new Promise(resolve => this.rl.question(question, resolve));
    }

    printMenu() {
        console.log("\n=== TO-DO LIST MENU ===");
        console.log("1. View tasks");
        console.log("2. Add a task");
        console.log("3. Update a task");
        console.log("4. Complete a task");
        //console.log("5. Remove completed tasks"); //Redundent since we auto remove completed tasks
        console.log("5. Settings");
        console.log("6. Exit");
    }

    printSettingsMenu() {
        console.log("\n=== SETTINGS ===");
        console.log(`1. Toggle auto-removal (currently ${this.taskManager.settings.autoRemove ? "ON" : "OFF"})`);
        console.log("2. Back to main menu");
    }

    async handleSettings() {
        let inSettings = true;

        while (inSettings) {
            this.printSettingsMenu();
            const choice = await this.ask("Choose an option: ");

            switch (choice) {
                case "1":
                    const newState = this.taskManager.toggleAutoRemove();
                    console.log(`Auto-removal is now ${newState ? "ON" : "OFF"}.`);
                    break;

                case "2":
                    inSettings = false;
                    break;

                default:
                    console.log("Invalid choice.");
            }
        }
    }

    async handleChoice(choice) {
        switch (choice) {
            case "1":
                this.taskManager.viewTasks();
                break;

            case "2":
                const text = await this.ask("Enter task description: ");
                this.taskManager.addTask(text);
                break;

            case "3":
                this.taskManager.viewTasks();
                const updateIndex = parseInt(await this.ask("Task number to update: ")) - 1;
                const newText = await this.ask("New description: ");
                console.log(this.taskManager.updateTask(updateIndex, newText)
                    ? "Task updated."
                    : "Invalid task number.");
                break;

            case "4":
                this.taskManager.viewTasks();
                const completeIndex = parseInt(await this.ask("Task number to complete: ")) - 1;
                console.log(this.taskManager.completeTask(completeIndex)
                    ? (this.taskManager.settings.autoRemove
                        ? "Congrulations! Task completed and removed."
                        : "Task marked as completed.")
                    : "Invalid task number.");
                break;

            case "5":
                const removed = this.taskManager.removeCompleted();
                console.log(`${removed}  Completed task(s) removed.`);
                break;

            case "6":
                await this.handleSettings();
                break;

            case "7":
                console.log("Goodbye!");
                this.rl.close();
                return false;

            default:
                console.log("Invalid choice.");
        }

        return true;
    }

    async start() {
        let running = true;

        while (running) {
            this.printMenu();
            const choice = await this.ask("Choose an option: ");
            running = await this.handleChoice(choice);
        }
    }
}

module.exports = Menu;