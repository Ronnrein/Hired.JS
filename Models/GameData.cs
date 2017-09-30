namespace Hiredjs.Models {

    public class GameData {
        public Thread[] Threads { get; set; }
        public Worker[] Workers { get; set; }

        public class Worker {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Position { get; set; }
        }

        public class Thread {
            public int Id { get; set; }
            public string Title { get; set; }
            public int[] Precursors { get; set; }
            public Message[] Messages { get; set; }
            public Message[] CompletedMessages { get; set; }
            public Assignment Assignment { get; set; }
            public int AssignmentId => Assignment?.Id ?? 0;
        }

        public class Assignment {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Function { get; set; }
            public string Summary { get; set; }
            public string Solution { get; set; }
            public string Template { get; set; }
            public int[] ReadOnlyLines { get; set; }
            public Argument[] Arguments { get; set; }
            public Test[] Tests { get; set; }
        }

        public class Message {
            public int AuthorId { get; set; }
            public Worker Author { get; set; }
            public string Text { get; set; }
            public string Image { get; set; }
        }

        public class Argument {
            public string Description { get; set; }
            public string Example { get; set; }
        }

        public class Test {
            public string[] Arguments { get; set; }
            public string Result { get; set; }
        }

    }

}
