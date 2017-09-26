using System.Collections.Generic;
using System.Linq;
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
    public class AssignmentController : Controller{

        private readonly GameData _gameData;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly HiredjsDbContext _db;

        public AssignmentController(
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
            IEnumerable<GameData.Assignment> assignments = _gameData.Assignments.Where(
                a => a.Precursors.All(p => completions.Select(c => c.AssignmentId).Contains(p))
            );
            IEnumerable<AssignmentVm> assignmentVms = _mapper.Map<IEnumerable<GameData.Assignment>, IEnumerable<AssignmentVm>>(assignments);
            assignmentVms = assignmentVms.Select(a => {
                AssignmentCompletion completion = completions.SingleOrDefault(c => c.AssignmentId == a.Id);
                if (completion != null) {
                    a.CompletedOn = completion.CompletedOn;
                }
                return a;
            });
            return Json(assignmentVms);
        }

        [HttpGet]
        public IActionResult Scripts(int id) {
            GameData.Assignment assignment = _gameData.Assignments.SingleOrDefault(t => t.Id == id);
            if (assignment == null) {
                return NotFound();
            }
            IEnumerable<Script> scripts = _db.Scripts.Where(
                s => s.UserId == _userManager.GetUserId(User) && s.AssignmentId == id
            );
            return Json(_mapper.Map<IEnumerable<Script>, IEnumerable<ScriptVm>>(scripts));
        }

    }
}
