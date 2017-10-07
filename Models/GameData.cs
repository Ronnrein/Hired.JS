using System;
using System.Collections.Generic;
using System.Globalization;
using Hiredjs.ViewModels.Script;
using Microsoft.AspNetCore.NodeServices;

namespace Hiredjs.Models {

    public class GameData {
        public IEnumerable<Thread> Threads { get; set; }
        public IEnumerable<Worker> Workers { get; set; }

        public class Worker {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Position { get; set; }
        }

        public class Thread {
            public int Id { get; set; }
            public string Title { get; set; }
            public IEnumerable<int> Precursors { get; set; }
            public IEnumerable<Message> Messages { get; set; }
            public IEnumerable<Message> CompletedMessages { get; set; }
            public DateTime ReceivedOn { get; set; }
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
            public int Score { get; set; }
            public AssignmentCompletion Completion { get; set; }
            public IEnumerable<int> ReadOnlyLines { get; set; }
            public IEnumerable<Argument> Arguments { get; set; }
            public IEnumerable<Test> Tests { get; set; }

            public async void CalculateAssignmentScore(INodeServices node) {
                Score = (int) double.Parse((await node.InvokeAsync<string>(
                    "Scripts/CalculateScore.js",
                    Solution
                )).Replace('.', ','));
            }
        }

        public class Message {
            public int AuthorId { get; set; }
            public Worker Author { get; set; }
            public int Delay { get; set; }
            public string Text { get; set; }
            public string Image { get; set; }
        }

        public class Argument {
            public string Description { get; set; }
            public string Example { get; set; }
        }

        public class Test {
            public IEnumerable<string> Arguments { get; set; }
            public string Result { get; set; }
        }

    }

}
