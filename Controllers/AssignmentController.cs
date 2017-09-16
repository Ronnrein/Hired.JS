using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Models;
using Hiredjs.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;

namespace Hiredjs.Controllers {

    public class AssignmentController : Controller{

        private readonly INodeServices _nodeServices;
        private readonly GameData _gameData;
        private readonly IMapper _mapper;

        public AssignmentController(INodeServices nodeServices, GameData gameData, IMapper mapper) {
            _nodeServices = nodeServices;
            _gameData = gameData;
            _mapper = mapper;
        }

        public IActionResult Get() {
            return Json(_mapper.Map<IEnumerable<GameData.Assignment>, IEnumerable<AssignmentVm>>(_gameData.Assignments));
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id) {
            GameData.Assignment assignment = _gameData.Assignments.SingleOrDefault(t => t.Id == id);
            if (assignment == null) {
                return NotFound();
            }
            return Json(_mapper.Map<GameData.Assignment, AssignmentVm>(assignment));
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
            AssignmentResultVm results = await _nodeServices.InvokeAsync<AssignmentResultVm>(
                "Scripts/Run.js",
                model.Script,
                assignment.Solution,
                assignment.Tests
            );
            return Json(results);
        }

    }
}
