using Hiredjs.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Hiredjs.Data {
    public class HiredjsDbContext : IdentityDbContext<User> {

        public virtual DbSet<Script> Scripts { get; set; }

        public HiredjsDbContext(DbContextOptions options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder builder) {
            base.OnModelCreating(builder);
            builder.Entity<User>()
                .Ignore(u => u.Email)
                .Ignore(u => u.EmailConfirmed)
                .Ignore(u => u.NormalizedEmail)
                .Ignore(u => u.PhoneNumber)
                .Ignore(u => u.PhoneNumberConfirmed)
                .Ignore(u => u.PasswordHash)
                .Ignore(u => u.TwoFactorEnabled)
                .Ignore(u => u.AccessFailedCount)
                .Ignore(u => u.LockoutEnabled)
                .Ignore(u => u.LockoutEnd);
            builder.Entity<User>().ToTable("users");
        }
    }
}
