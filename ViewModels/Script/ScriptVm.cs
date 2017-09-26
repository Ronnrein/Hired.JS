using System;

namespace Hiredjs.ViewModels.Script {
    public class ScriptVm {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public DateTime? VerifiedOn { get; set; }
        public bool IsVerified => VerifiedOn != null;
        public DateTime ModifiedOn { get; set; }
    }
}
