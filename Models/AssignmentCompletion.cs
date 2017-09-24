using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hiredjs.Models {

    public class AssignmentCompletion {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public DateTime CompletedOn { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

        public AssignmentCompletion() {
            CompletedOn = DateTime.Now;
        }
    }
}
