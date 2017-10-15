using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.Assignment;
using Hiredjs.ViewModels.Script;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Hiredjs.Controllers {

    [Authorize]
    public class ThreadController : Controller{

        private readonly GameData _gameData;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly HiredjsDbContext _db;

        public ThreadController(
            GameData gameData,
            IMapper mapper,
            UserManager<User> userManager,
            HiredjsDbContext db
        ) {
            _gameData = gameData;
            _mapper = mapper;
            _userManager = userManager;
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Index() {
            User user = await _userManager.GetUserAsync(User);
            IEnumerable<AssignmentCompletion> completions = _db.AssignmentCompletions.Where(
                ac => ac.UserId == user.Id
            );
            completions.Append(new AssignmentCompletion {
                CompletedOn = user.CreatedOn,
                AssignmentId = 0
            });
            List<GameData.Thread> threads = _gameData.Threads.Where(
                a => a.Precursors.All(p => completions.Select(c => c.AssignmentId).Contains(p))
            ).ToList();

            // Assign completion and received dates
            foreach (GameData.Thread thread in threads) {
                if (thread.Assignment != null) {
                    thread.Assignment.Completion = completions.SingleOrDefault(c => c.AssignmentId == thread.AssignmentId);
                }
                thread.ReceivedOn =
                    (completions.SingleOrDefault(c => c.AssignmentId == thread.Precursors.FirstOrDefault())?.CompletedOn ??
                    user.CreatedOn) + TimeSpan.FromSeconds(thread.Messages.First().Delay);
            }

            // Assign verified scripts
            IEnumerable<ThreadVm> threadVms = _mapper.Map<IEnumerable<GameData.Thread>, IEnumerable<ThreadVm>>(threads);
            threadVms.Where(t => t.Assignment != null && t.Assignment.Completed).Select(t => t.Assignment).ToList().ForEach(a => {
                IEnumerable<Script> scripts = _db.Scripts.Where(s => s.VerifiedOn != null && s.AssignmentId == a.Id);
                a.ScoreSummary = new ScriptScoreSummaryVm(
                    _mapper.Map<Script, ScriptVm>(scripts.Where(s => s.UserId == user.Id).OrderBy(s => s.Score).First()),
                    scripts.Select(s => s.Score),
                    a.Score
                );
            });
            return Json(threadVms);
        }

    }
}
