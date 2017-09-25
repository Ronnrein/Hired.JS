using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.Script;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hiredjs.Controllers {

    [Authorize]
    public class ScriptController : Controller{

        private readonly GameData _gameData;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly HiredjsDbContext _db;

        public ScriptController(
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ScriptVm scriptVm) {
            GameData.Assignment assignment = _gameData.Assignments.SingleOrDefault(t => t.Id == scriptVm.AssignmentId);
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
                return Unauthorized();
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
                return Unauthorized();
            }
            script.Text = scriptVm.Text;
            script.ModifiedOn = DateTime.Now;
            await _db.SaveChangesAsync();
            return Json(_mapper.Map<Script, ScriptVm>(script));
        }

    }
}
