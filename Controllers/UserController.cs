using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using CodenameGenerator;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels;
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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Index() {
            return Json(_mapper.Map<User, UserVm>(await _userManager.GetUserAsync(User)));
        } 

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserLoginVm login) {
            User user = await _userManager.FindByNameAsync(login.UserName);
            if (user == null) {
                return NotFound();
            }
            await _signInManager.SignInAsync(user, true);
            return Json(_mapper.Map<User, UserVm>(user));
        }

        [HttpPost]
        public async Task<IActionResult> Register() {
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
            await _signInManager.SignInAsync(user, true);
            return Json(_mapper.Map<User, UserVm>(user));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Logout() {
            await _signInManager.SignOutAsync();
            return Ok();
        }

    }
}
