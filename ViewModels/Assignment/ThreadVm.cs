using System;
using System.Collections.Generic;
using Hiredjs.Models;
using Hiredjs.ViewModels.Script;

namespace Hiredjs.ViewModels.Assignment {

    public class ThreadVm {
        public int Id { get; set; }
        public string Title { get; set; }
        public IEnumerable<MessageVm> Messages { get; set; }
        public AssignmentVm Assignment { get; set; }

        public class AssignmentVm {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Function { get; set; }
            public string Summary { get; set; }
            public string Template { get; set; }
            public int Score { get; set; }
            public DateTime? CompletedOn { get; set; }
            public bool Completed => CompletedOn != null;
            public ScriptScoreSummaryVm ScoreSummary { get; set; }
            public IEnumerable<int> ReadOnlyLines { get; set; }
            public IEnumerable<GameData.Argument> Arguments { get; set; }
        }

        public class MessageVm {
            public GameData.Worker Author { get; set; }
            public DateTime ReceivedOn { get; set; }
            public int Delay { get; set; }
            public string Text { get; set; }
            public string Image { get; set; }
        }
    }

}
