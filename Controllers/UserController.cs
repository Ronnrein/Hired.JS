using System.Threading.Tasks;
using AutoMapper;
using CodenameGenerator;
using Hiredjs.Data;
using Hiredjs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Hiredjs.Controllers {

    public class UserController : Controller {

        private readonly IMapper _mapper;
        private readonly GameData _gameData;
        private readonly HiredjsDbContext _db;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public UserController(
            IMapper mapper,
            GameData gameData,
            HiredjsDbContext db,
            UserManager<User> userManager,
            SignInManager<User> signInManager
        ) {
            _mapper = mapper;
            _gameData = gameData;
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost]
        public async Task<IActionResult> Login(string id) {
            User user = await _userManager.FindByNameAsync(id);
            if (user == null) {
                return StatusCode(404);
            }
            await _signInManager.SignInAsync(user, true);
            return StatusCode(200);
        }

        [HttpPost]
        public async Task<string> Register() {
            Generator g = new Generator {
                Casing = Casing.PascalCase,
                Separator = ""
            };

            // Generate a random username and check if it exists in db
            string userName = "";
            User existingUser = new User();
            while (existingUser != null) {
                userName = g.Generate();
                existingUser = await _userManager.FindByNameAsync(userName);
            }

            User user = new User {UserName = userName};
            await _userManager.CreateAsync(user);
            return user.UserName;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Logout() {
            await _signInManager.SignOutAsync();
            return StatusCode(200);
        }

        [HttpPost]
        [Authorize]
        public IActionResult Delete() {
            return StatusCode(200);
        }

        [HttpPost]
        [Authorize]
        public string Test() {
            return "AUTHORIZED";
        }

    }
}
