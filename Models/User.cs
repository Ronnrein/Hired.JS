using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Hiredjs.Models {

    public class User : IdentityUser {
        public IEnumerable<Script> Scripts { get; set; }
        public IEnumerable<AssignmentCompletion> AssignmentCompletions { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
