using Hiredjs.Models;

namespace Hiredjs.ViewModels {

    public class AssignmentVm {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Function { get; set; }
        public string Summary { get; set; }
        public string Template { get; set; }
        public Message[] Messages { get; set; }
        public GameData.Assignment.Argument[] Arguments { get; set; }

        public class Message {
            public GameData.Worker Author { get; set; }
            public string Text { get; set; }
            public string Image { get; set; }
        }
    }

}
