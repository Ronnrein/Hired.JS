using System;
using Hiredjs.Models;

namespace Hiredjs.ViewModels.Assignment {

    public class ThreadVm {
        public int Id { get; set; }
        public string Title { get; set; }
        public MessageVm[] Messages { get; set; }
        public MessageVm[] CompletedMessages { get; set; }
        public AssignmentVm Assignment { get; set; }

        public class AssignmentVm {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Function { get; set; }
            public string Summary { get; set; }
            public string Template { get; set; }
            public DateTime? CompletedOn { get; set; }
            public bool Completed => CompletedOn != null;
            public int[] ReadOnlyLines { get; set; }
            public GameData.Argument[] Arguments { get; set; }
        }

        public class MessageVm {
            public GameData.Worker Author { get; set; }
            public string Text { get; set; }
            public string Image { get; set; }
        }
    }

}
