using System;
using System.Collections.Generic;
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
using Microsoft.AspNetCore.NodeServices;
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

            // Only return status codes without redirect
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
                o.CreateMap<GameData.Thread, ThreadVm>()
                    .AfterMap((t, tvm, c) => {

                        List<ThreadVm.MessageVm> messages = tvm.Messages.ToList();

                        // Replace summary tag with assignment summary
                        messages.First(m => {
                            m.Text = m.Text.Replace("|sum|", t.Assignment?.Summary ?? "");
                            return true;
                        });

                        // Assign initial date
                        messages.First().ReceivedOn = t.ReceivedOn;

                        // If assignment is completed, add assignment complete message and following messages
                        if (tvm.Assignment?.CompletedOn != null) {
                            int tests = t.Assignment.Tests.Count();
                            messages.Add(new ThreadVm.MessageVm {
                                Text = "Assignment complete! "+tests+" of "+tests+" tests completed.",
                                ReceivedOn = (DateTime) tvm.Assignment.CompletedOn,
                                Author = gameData.Workers.SingleOrDefault(w => w.Id == 0)
                            });
                            List<ThreadVm.MessageVm> mvms = c.Mapper.Map<List<GameData.Message>, List<ThreadVm.MessageVm>>(t.CompletedMessages.ToList());
                            messages.AddRange(mvms);
                        }

                        // Apply delay to messages
                        for(int i = 1; i < messages.Count; i++) {
                            ThreadVm.MessageVm message = messages.ElementAt(i);
                            if (message.ReceivedOn == DateTime.MinValue) {
                                message.ReceivedOn = messages.ElementAt(i - 1).ReceivedOn + TimeSpan.FromSeconds(message.Delay);
                            }
                        }

                        tvm.Messages = messages;

                    });
                o.CreateMap<GameData.Assignment, ThreadVm.AssignmentVm>()
                    .ForMember(d => d.CompletedOn, opt => opt.MapFrom(s => s.Completion.CompletedOn));
                o.CreateMap<GameData.Message, ThreadVm.MessageVm>()
                    .ForMember(d => d.Author, opt => opt.MapFrom(s => gameData.Workers.Single(w => w.Id == s.AuthorId)));
                o.CreateMap<User, UserVm>()
                    .ForMember(d => d.IsPasswordEnabled, opt => opt.MapFrom(s => !string.IsNullOrEmpty(s.PasswordHash)));
                o.CreateMap<Script, ScriptVm>();
            });
            IMapper mapper = config.CreateMapper();
            services.AddSingleton(mapper);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, GameData gameData, INodeServices node) {

            // Calculate score for solution for each assignment
            gameData.Threads.Where(t => t.Assignment != null).Select(t => t.Assignment).ToList().ForEach(a => a.CalculateAssignmentScore(node));

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
