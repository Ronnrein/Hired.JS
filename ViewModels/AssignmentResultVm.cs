using System.Collections.Generic;
using System.Linq;

namespace Hiredjs.ViewModels {
    public struct AssignmentResultVm {
        public IEnumerable<PlayerTaskRunResultVm> Runs { get; set; }
        public bool Success => Runs.All(r => r.Success);
        public string Error => Runs.Where(r => r.Error != null).Select(r => r.Error).FirstOrDefault();
        public decimal Time => Runs.Sum(r => r.Time);

        public struct PlayerTaskRunResultVm {
            public string[] Logs { get; set; }
            public string[] Arguments { get; set; }
            public bool Success { get; set; }
            public string Error { get; set; }
            public string Result { get; set; }
            public string Correct { get; set; }
            public decimal Time { get; set; }
        }
    }
}