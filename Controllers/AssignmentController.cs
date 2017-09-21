using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Models;
using Hiredjs.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;

namespace Hiredjs.Controllers {

    [Authorize]
    public class AssignmentController : Controller{

        private readonly INodeServices _nodeServices;
        private readonly GameData _gameData;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public AssignmentController(
            INodeServices nodeServices,
            GameData gameData,
            IMapper mapper,
            UserManager<User> userManager
        ) {
            _nodeServices = nodeServices;
            _gameData = gameData;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult Index() {
            // TODO: Hook up progression
            return Json(_mapper.Map<IEnumerable<GameData.Assignment>, IEnumerable<AssignmentVm>>(_gameData.Assignments));
        }

        [HttpPost]
        public async Task<IActionResult> Run(int id, [FromBody] PlayerTaskRunVm model) {
            GameData.Assignment assignment = _gameData.Assignments.SingleOrDefault(t => t.Id == id);
            if (id == 0) {
                assignment = new GameData.Assignment { Solution = null };
            }
            else if (assignment == null) {
                return NotFound();
            }
            AssignmentRunResultVm results = await _nodeServices.InvokeAsync<AssignmentRunResultVm>(
                "Scripts/Run.js",
                model.Script,
                assignment.Solution,
                model.Arguments
            );
            return Json(results);
        }

        [HttpPost]
        public async Task<IActionResult> Verify(int id, [FromBody] PlayerTaskRunVm model) {
            GameData.Assignment assignment = _gameData.Assignments.SingleOrDefault(t => t.Id == id);
            if (assignment == null) {
                return NotFound();
            }
            AssignmentVerificationResultVm results = await _nodeServices.InvokeAsync<AssignmentVerificationResultVm>(
                "Scripts/Verify.js",
                model.Script,
                assignment.Solution,
                assignment.Tests
            );
            return Json(results);
        }

    }
}
