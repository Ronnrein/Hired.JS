namespace Hiredjs.ViewModels.Script {
    public class ScriptRunResultVm {
        public string[] Logs { get; set; }
        public string[] Arguments { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }
        public string Result { get; set; }
        public string Correct { get; set; }
    }
}
