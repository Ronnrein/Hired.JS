namespace Hiredjs.Models {

    public class GameData {
        public Assignment[] Assignments { get; set; }
        public Worker[] Workers { get; set; }

        public class Assignment {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Title { get; set; }
            public string Summary { get; set; }
            public string Solution { get; set; }
            public string Template { get; set; }
            public Message[] Messages { get; set; }
            public Test[] Tests { get; set; }

            public class Message {
                public int Author { get; set; }
                public string Text { get; set; }
            }
            public class Test {
                public string[] Arguments { get; set; }
                public string Result { get; set; }
            }
        }

        public class Worker {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Position { get; set; }
        }
    }

}