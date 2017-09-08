const { VM } = require("vm2");

module.exports = function(callback, script, solution, tests) {
    const results = [];

    // Define the iteration variable outside loop to use in console.log function
    let i = 0;

    // Initialize the VM
    let vm = new VM({
        sandbox: {
            console: {
                log: function(str) { consoleLog(str); }
            }
        }
    });

    // Go through the argument list
    for (let test of tests) {
        let o = {
            logs: [],
            arguments: test.arguments,
            success: false,
            error: null,
            result: 0,
            correct: test.result,
            time: 0
        };
        results[i] = o;
        try {

            // Start recording time to measure performance
            let t = process.hrtime();
            o.result = vm.run(`(${script})(${test.arguments.join(", ")})`);
            t = process.hrtime(t);
            o.time = t[0] * 1e9 + t[1];
        } catch (e) {

            // Something went wrong in the users code
            o.error = `${e.name}: ${e.message}`;
        }
        if(o.correct === null) {
            try {
                o.correct = vm.run(`(${solution})(${test.arguments.join(", ")})`);
            } catch (e) {

                // Should not happen, if it does something is wrong in the task template
                o.error = "Task error, please report to developer";
            }
        }
        if (results[i].error !== null) {

            // If there has been an error, do not continue
            break;
        }

        // Finally check if the two results match or not
        o.success = o.result.toString() === o.correct.toString();
        i++;
    }

    callback(null, { runs: results });

    // Function to capture console.log statements into results object
    function consoleLog(str) {
        results[i].logs.push(str);
    }
}