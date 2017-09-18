using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hiredjs.Models {

    public class Script {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public DateTime? Verified { get; set; }

        [NotMapped]
        public GameData.Assignment Assignment { get; set; }
        public int AssignmentId { get; set; }
        
        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

    }
}
