using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Models;
using Hiredjs.ViewModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

            app.UseMvc(routes => {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
                routes.MapRoute(
                    name: "api",
                    template: "api/{controller}/{action}/{id?}");
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
