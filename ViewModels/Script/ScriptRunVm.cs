using System.Collections.Generic;

namespace Hiredjs.ViewModels.Script {
    public class ScriptRunVm {
        public ScriptVm Script { get; set; }
        public IEnumerable<string> Arguments { get; set; }
    }
}
