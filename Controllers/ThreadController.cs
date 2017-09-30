using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.Assignment;
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
        public IActionResult Index() {
            IEnumerable<AssignmentCompletion> completions = _db.AssignmentCompletions.Where(
                ac => ac.UserId == _userManager.GetUserId(User)
            );
            IEnumerable<GameData.Thread> threads = _gameData.Threads.Where(
                a => a.Precursors.All(p => completions.Select(c => c.AssignmentId).Contains(p))
            );
            IEnumerable<ThreadVm> threadVms = _mapper.Map<IEnumerable<GameData.Thread>, IEnumerable<ThreadVm>>(threads);
            threadVms = threadVms.Select(t => {
                if (t.Assignment != null) {
                    AssignmentCompletion completion = completions.SingleOrDefault(c => c.AssignmentId == t.Assignment.Id);
                    if (completion != null) {
                        t.Assignment.CompletedOn = completion.CompletedOn;
                    }
                }
                return t;
            });
            return Json(threadVms);
        }

    }
}
