using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hiredjs.Data;
using Hiredjs.Models;
using Hiredjs.ViewModels.Assignment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Hiredjs.Controllers {

    [Authorize]
    public class ThreadController : Controller{

        private readonly GameData _gameData;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly HiredjsDbContext _db;

        public ThreadController(
            GameData gameData,
            IMapper mapper,
            UserManager<User> userManager,
            HiredjsDbContext db
        ) {
            _gameData = gameData;
            _mapper = mapper;
            _userManager = userManager;
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Index() {
            User user = await _userManager.GetUserAsync(User);
            IEnumerable<AssignmentCompletion> completions = _db.AssignmentCompletions.Where(
                ac => ac.UserId == user.Id
            );
            completions.Append(new AssignmentCompletion {
                CompletedOn = user.CreatedOn,
                AssignmentId = 0
            });
            List<GameData.Thread> threads = _gameData.Threads.Where(
                a => a.Precursors.All(p => completions.Select(c => c.AssignmentId).Contains(p))
            ).ToList();

            // Assign completion and received dates
            foreach (GameData.Thread thread in threads) {
                if (thread.Assignment != null) {
                    thread.Assignment.Completion = completions.SingleOrDefault(c => c.AssignmentId == thread.AssignmentId);
                }
                thread.ReceivedOn =
                    (completions.SingleOrDefault(c => c.AssignmentId == thread.Precursors.FirstOrDefault())?.CompletedOn ??
                    user.CreatedOn) + TimeSpan.FromSeconds(thread.Messages.First().Delay);
            }
            return Json(_mapper.Map<IEnumerable<GameData.Thread>, IEnumerable<ThreadVm>>(threads));
        }

        /*private IEnumerable<ThreadVm> MapThreads(
            IReadOnlyCollection<GameData.Thread> threads,
            IReadOnlyCollection<AssignmentCompletion> completions,
            User user
        ) {

            // Store vms
            List<ThreadVm> vms = new List<ThreadVm>();

            foreach (GameData.Thread thread in threads) {

                // Set completed-on for completed assignments
                ThreadVm vm = _mapper.Map<GameData.Thread, ThreadVm>(thread);
                if (vm.Assignment != null) {
                    AssignmentCompletion completion = completions.SingleOrDefault(c => c.AssignmentId == vm.Assignment.Id);
                    if (completion != null) {
                        vm.Assignment.CompletedOn = completion.CompletedOn;
                    }
                }

                // Set date for normal messages
                DateTime time = !thread.Precursors.Any()
                    ? user.CreatedOn
                    : completions.SingleOrDefault(c => c.AssignmentId == thread.Precursors.First()).CompletedOn;
                vm.Messages = vm.Messages.Zip(thread.Messages, (mvm, m) => {
                    mvm.ReceivedOn = time += TimeSpan.FromSeconds(m.Delay ? 2 : 0);
                    return mvm;
                }).ToArray();

                // Set date for assignment and completed messages
                if (vm.Assignment != null) {
                    AssignmentCompletion completion = completions.SingleOrDefault(c => c.AssignmentId == vm.Assignment.Id);
                    if (completion != null) {
                        vm.Assignment.CompletedOn = completion.CompletedOn;
                        time = completion.CompletedOn;
                        vm.CompletedMessages = vm.CompletedMessages.Zip(thread.CompletedMessages, (mvm, m) => {
                            mvm.ReceivedOn = time += TimeSpan.FromSeconds(m.Delay ? 2 : 0);
                            return mvm;
                        }).ToArray();
                    }
                }

                // Add to vms
                vms.Add(vm);
            }

            return vms;
        }*/

    }
}
