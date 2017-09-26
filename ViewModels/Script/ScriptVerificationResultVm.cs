namespace Hiredjs.ViewModels.Script {
    public class ScriptVerificationResultVm {
        public int Tests { get; set; }
        public int Completed { get; set; }
        public ScriptRunResultVm Failed { get; set; }
        public ScriptVm Script { get; set; }
    }
}
