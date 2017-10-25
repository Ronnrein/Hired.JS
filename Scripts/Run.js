const { VM } = require("vm2");

module.exports = function(callback, script, solution, args) {
    const o = {
        logs: [],
        success: false,
        error: null,
        result: 0,
        correct: null
    };

    // Initialize the VM
    let vm = new VM({
        sandbox: {
            console: {
                log: function(str) { o.logs.push(str); }
            }
        }
    });

    try {
        o.result = vm.run(`(${script})(${args.join(", ")})`).toString();
    } catch (e) {

        // Something went wrong in the users code
        o.error = `${e.name}: ${e.message}`;
    }
    if (o.error === null && solution !== null) {
        try {
            o.correct = vm.run(`(${solution})(${args.join(", ")})`).toString();
        } catch(e) {

            // Should not happen, if it does something is wrong in the task template
            o.error = "Task error, please report to developer";
        }
    }

    // Finally check if the two results match or not
    o.success = o.error === null && (
        solution === null || (o.correct !== null && o.result.toString() === o.correct.toString())
    );

    callback(null, o);
}
