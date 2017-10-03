using System.Collections.Generic;

namespace Hiredjs.ViewModels.Script {
    public class ScriptRunResultVm {
        public IEnumerable<string> Logs { get; set; }
        public IEnumerable<string> Arguments { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }
        public string Result { get; set; }
        public string Correct { get; set; }
    }
}
