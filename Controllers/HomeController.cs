using System.Linq;
using Hiredjs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hiredjs.Controllers {
    public class HomeController : Controller {

        private readonly GameData _gameData;

        public HomeController(GameData gameData) {
            _gameData = gameData;
        }

        public IActionResult Index() {
            return View();
        }

        [HttpGet]
        [Authorize]
        public IActionResult Documentation() {
            return Json(_gameData.Documentations.OrderBy(d => d.Title));
        }
    }
}
