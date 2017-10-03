using System;
using System.Threading.Tasks;
using AutoMapper;
using CodenameGenerator;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Hiredjs.Controllers {

    [Authorize]
    public class UserController : Controller {

        private readonly IMapper _mapper;
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
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        public async Task<IActionResult> Index() {
            return Json(_mapper.Map<User, UserVm>(await _userManager.GetUserAsync(User)));
        } 

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginVm login) {
            User user = await _userManager.FindByNameAsync(login.UserName);
            if (user == null) {
                return NotFound();
            }
            if (string.IsNullOrEmpty(user.PasswordHash)) {
                await _signInManager.SignInAsync(user, true);
                return Json(_mapper.Map<User, UserVm>(user));
            }
            if (string.IsNullOrEmpty(login.Password)) {
                return Forbid();
            }
            SignInResult result = await _signInManager.PasswordSignInAsync(user, login.Password, true, false);
            if (!result.Succeeded) {
                return Unauthorized();
            }
            return Json(_mapper.Map<User, UserVm>(user));
        }

        [HttpPost]
        [AllowAnonymous]
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
            User user = new User {
                UserName = userName,
                CreatedOn = DateTime.Now
            };
            await _userManager.CreateAsync(user);
            await _signInManager.SignInAsync(user, true);
            return Json(_mapper.Map<User, UserVm>(user));
        }

        [HttpPost]
        public async Task<IActionResult> Logout() {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateUserName([FromBody] UserLoginVm newInfo) {
            User user = await _userManager.GetUserAsync(User);
            if (await _userManager.FindByNameAsync(newInfo.UserName) != null) {
                return StatusCode(409);
            }
            user.UserName = newInfo.UserName;
            await _userManager.UpdateAsync(user);
            return Json(_mapper.Map<User, UserVm>(user));
        }

        [HttpPost]
        public async Task<IActionResult> UpdatePassword([FromBody] UserLoginVm newInfo) {
            User user = await _userManager.GetUserAsync(User);
            if (newInfo.Password == null) {
                user.PasswordHash = null;
            }
            else {
                PasswordHasher<User> hasher = new PasswordHasher<User>();
                user.PasswordHash = hasher.HashPassword(user, newInfo.Password);
            }
            await _userManager.UpdateAsync(user);
            return Json(_mapper.Map<User, UserVm>(user));
        }

    }
}
