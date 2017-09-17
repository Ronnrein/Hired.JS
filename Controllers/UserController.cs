using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Hiredjs.Controllers {

    public class UserController : Controller {

        private readonly IMapper _mapper;

        public UserController(IMapper mapper) {
            _mapper = mapper;
        }

        [HttpPost]
        public IActionResult Login(string id) {
            return StatusCode(200);
        }

        [HttpPost]
        public string Register() {
            return "account key";
        }

        [HttpPost]
        public IActionResult Delete() {
            return StatusCode(200);
        }

    }
}
