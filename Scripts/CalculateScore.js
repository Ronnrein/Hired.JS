const escomplex = require("escomplex");

module.exports = function(callback, script) {
    callback(null, parseInt(escomplex.analyse(script, {}).aggregate.halstead.volume));
}
