const { VM } = require("vm2");
const escomplex = require("escomplex");

module.exports = function(callback, script, solution, tests) {

    let i = 0;
    let o;

    // Initialize the VM
    let vm = new VM({
        sandbox: {
            console: {
                log: function(str) { o.logs.push(str); }
            }
        }
    });

    // Go through the argument list
    for (let test of tests) {
        o = {
            logs: [],
            arguments: test.arguments,
            success: false,
            error: null,
            result: "",
            correct: test.result,
            time: 0
        };
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
        if (o.correct === null) {
            try {
                o.correct = vm.run(`(${solution})(${test.arguments.join(", ")})`);
            } catch (e) {

                // Should not happen, if it does something is wrong in the task template
                o.error = "Task error, please report to developer";
            }
        }
        if (o.error !== null) {

            // If there has been an error, do not continue
            break;
        }

        // Finally check if the two results match or not
        o.success = o.result.toString() === o.correct.toString();

        if (!o.success) {

            // If theres an incorrect answer, dot not continue
            break;
        }
        i++;
    }

    callback(null, {
        failed: o.error !== null || !o.success ? o : null,
        tests: tests.length,
        completed: i,
        score: i === tests.length ? parseInt(escomplex.analyse(script, {}).aggregate.halstead.volume) : 0
    });
}
