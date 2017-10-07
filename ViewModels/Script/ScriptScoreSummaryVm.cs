using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Hiredjs.ViewModels.Script {

    public class ScriptScoreSummaryVm {
        public ScriptVm Script { get; }
        public int SolutionScore { get; }
        public IEnumerable<int> Scores { get; }
        public int Lowest { get; }
        public int Highest { get; }
        public IEnumerable<string> Labels { get; }

        public ScriptScoreSummaryVm(ScriptVm script, IEnumerable<int> scores, int solutionScore) {
            int highest = new[] {scores.Any() ? scores.Max() : int.MinValue, script.Score, solutionScore}.Max() + 20;
            int lowest = new[] { scores.Any() ? scores.Min() : int.MaxValue, script.Score, solutionScore }.Min() - 20;
            List<int> steps = new List<int>();
            List<string> labels = new List<string>();
            double step = (highest - lowest) / 10.0;
            for (double i = highest; i >= lowest; i-=step) {
                labels.Add(((int)(1000.0-i)).ToString(CultureInfo.InvariantCulture));
                steps.Add(scores.Count(s => s >= i - step / 2 && s < i + step / 2));
            }
            Highest = 1000 - lowest;
            Lowest = 1000 - highest;
            Script = script;
            Script.Score = 1000 - Script.Score;
            SolutionScore = 1000 - solutionScore;
            Scores = steps;
            Labels = labels;
        }
    }
}
