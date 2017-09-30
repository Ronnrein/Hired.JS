using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.Script;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.EntityFrameworkCore;

namespace Hiredjs.Controllers {

    [Authorize]
    public class ScriptController : Controller {

        private readonly INodeServices _nodeServices;
        private readonly GameData _gameData;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly HiredjsDbContext _db;

        public ScriptController(
            INodeServices nodeServices,
            GameData gameData,
            IMapper mapper,
            UserManager<User> userManager,
            HiredjsDbContext db
        ) {
            _nodeServices = nodeServices;
            _gameData = gameData;
            _mapper = mapper;
            _userManager = userManager;
            _db = db;
        }

        [HttpGet]
        public IActionResult Assignment(int id) {
            Console.Write("LOL");
            GameData.Assignment assignment = _gameData.Threads.SingleOrDefault(t => t.AssignmentId == id)?.Assignment;
            if (assignment == null) {
                return NotFound();
            }
            IEnumerable<Script> scripts = _db.Scripts.Where(
                s => s.UserId == _userManager.GetUserId(User) && s.AssignmentId == id
            );
            return Json(_mapper.Map<IEnumerable<Script>, IEnumerable<ScriptVm>>(scripts));
        }

        [HttpPost]
        public async Task<IActionResult> Run([FromBody] ScriptRunVm model) {
            GameData.Assignment assignment = _gameData.Threads.SingleOrDefault(t => t.AssignmentId == model.Script.AssignmentId)?.Assignment;
            if (model.Script.AssignmentId == 0) {
                assignment = new GameData.Assignment { Solution = null };
            }
            else if (assignment == null) {
                return NotFound();
            }
            ScriptRunResultVm results = await _nodeServices.InvokeAsync<ScriptRunResultVm>(
                "Scripts/Run.js",
                model.Script.Text,
                assignment.Solution,
                model.Arguments
            );
            return Json(results);
        }

        [HttpPost]
        public async Task<IActionResult> Verify([FromBody] ScriptRunVm model) {
            GameData.Assignment assignment = _gameData.Threads.SingleOrDefault(t => t.AssignmentId == model.Script.AssignmentId)?.Assignment;
            Script script = await _db.Scripts.SingleOrDefaultAsync(s => s.Id == model.Script.Id);
            string userId = _userManager.GetUserId(User);
            if (assignment == null || script == null) {
                return NotFound();
            }
            if (script.UserId != userId) {
                return Forbid();
            }
            // TODO: Add check for precursors
            ScriptVerificationResultVm results = await _nodeServices.InvokeAsync<ScriptVerificationResultVm>(
                "Scripts/Verify.js",
                model.Script.Text,
                assignment.Solution,
                assignment.Tests
            );
            if (results.Completed == results.Tests) {
                AssignmentCompletion completion = _db.AssignmentCompletions.SingleOrDefault(
                    ac => ac.UserId == userId && ac.AssignmentId == assignment.Id
                );
                if (completion == null) {
                    _db.AssignmentCompletions.Add(new AssignmentCompletion { UserId = userId, AssignmentId = assignment.Id });
                }
                script.Text = model.Script.Text;
                script.VerifiedOn = DateTime.Now;
                script.ModifiedOn = DateTime.Now;
                _db.Scripts.Update(script);
                await _db.SaveChangesAsync();
                results.Script = _mapper.Map<Script, ScriptVm>(script);
            }
            return Json(results);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ScriptVm scriptVm) {
            GameData.Assignment assignment = _gameData.Threads.SingleOrDefault(t => t.AssignmentId == scriptVm.AssignmentId)?.Assignment;
            if (assignment == null) {
                return NotFound();
            }
            Script script = new Script {
                UserId = _userManager.GetUserId(User),
                AssignmentId = assignment.Id,
                ModifiedOn = DateTime.Now,
                Name = scriptVm.Name,
                Text = assignment.Template
            };
            await _db.Scripts.AddAsync(script);
            await _db.SaveChangesAsync();
            return Json(_mapper.Map<Script, ScriptVm>(script));
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id) {
            Script script = await _db.Scripts.SingleOrDefaultAsync(s => s.Id == id);
            if (script == null) {
                return NotFound();
            }
            if (script.UserId != _userManager.GetUserId(User)) {
                return Forbid();
            }
            _db.Scripts.Remove(script);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Save(int id, [FromBody] ScriptVm scriptVm) {
            Script script = await _db.Scripts.SingleOrDefaultAsync(s => s.Id == id);
            if (script == null) {
                return NotFound();
            }
            if (script.UserId != _userManager.GetUserId(User)) {
                return Forbid();
            }
            script.Text = scriptVm.Text;
            script.ModifiedOn = DateTime.Now;
            script.VerifiedOn = null;
            await _db.SaveChangesAsync();
            return Json(_mapper.Map<Script, ScriptVm>(script));
        }

    }
}
