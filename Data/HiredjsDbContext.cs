using Hiredjs.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Hiredjs.Data {
    public class HiredjsDbContext : IdentityDbContext<User> {

        // Link models here

        public HiredjsDbContext(DbContextOptions options) : base(options) {}

    }
}
