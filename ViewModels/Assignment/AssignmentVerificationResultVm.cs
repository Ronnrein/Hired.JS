namespace Hiredjs.ViewModels.Assignment {
    public class AssignmentVerificationResultVm {
        public int Tests { get; set; }
        public int Completed { get; set; }
        public AssignmentRunResultVm Failed { get; set; }
    }
}
