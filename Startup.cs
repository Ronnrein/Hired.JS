using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.User;
using Hiredjs.ViewModels.Assignment;
using Hiredjs.ViewModels.Script;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Hiredjs {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddMvc();

            // Sessions
            services.AddDistributedMemoryCache();
            services.AddSession(o => {
                o.IdleTimeout = TimeSpan.FromSeconds(10);
                o.Cookie.HttpOnly = true;
            });

            // Add database
            services.AddDbContext<HiredjsDbContext>(o => o.UseMySql(Configuration.GetConnectionString("DefaultConnection")));
            services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<HiredjsDbContext>();

            // Only return 401 code without redirect on unauthorized
            services.ConfigureApplicationCookie(o => {
                o.Events.OnRedirectToLogin = (c) => {
                    c.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
                o.Events.OnRedirectToAccessDenied = (c) => {
                    c.Response.StatusCode = 403;
                    return Task.CompletedTask;
                };
                o.ExpireTimeSpan = TimeSpan.FromDays(365);
            });

            // Add node services to allow us to run JavaScript
            services.AddNodeServices();

            // Use lower case urls for controllers and actions
            services.AddRouting(o => o.LowercaseUrls = true);

            // Add tasks from JSON as a singleton
            GameData gameData = JsonConvert.DeserializeObject<GameData>(File.ReadAllText("Scripts/GameData.json"));
            services.AddSingleton(gameData);

            // Add automapper
            MapperConfiguration config = new MapperConfiguration(o => {
                o.CreateMap<GameData.Assignment, AssignmentVm>()
                    .AfterMap((a, avm) => avm.Messages.All(m => {
                        m.Text = m.Text.Replace("|sum|", a.Summary);
                        return true;
                    }));
                o.CreateMap<GameData.Assignment.Message, AssignmentVm.Message>()
                    .ForMember(d => d.Author, opt => opt.MapFrom(s => gameData.Workers.Single(w => w.Id == s.Author)));
                o.CreateMap<User, UserVm>()
                    .ForMember(d => d.IsPasswordEnabled, opt => opt.MapFrom(s => !string.IsNullOrEmpty(s.PasswordHash)));
                o.CreateMap<Script, ScriptVm>();
            });
            IMapper mapper = config.CreateMapper();
            services.AddSingleton(mapper);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseSession();
            app.UseMvc(routes => {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
                routes.MapRoute(
                    name: "api",
                    template: "api/{controller=Home}/{action=Index}/{id?}");
            });

            // Workaround for SPA letting requests under /api return 404
            app.MapWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder => {
                builder.UseMvc(routes => {
                    routes.MapSpaFallbackRoute(
                        name: "spa-fallback",
                        defaults: new { controller = "Home", action = "Index" });
                });
            });
        }
    }
}
