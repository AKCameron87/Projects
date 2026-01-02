const TaskManager = require("./TaskManager");
const Menu = require("./Menu");

async function main() {
    const manager = new TaskManager();
    const menu = new Menu(manager);
    await menu.start();
}

main();