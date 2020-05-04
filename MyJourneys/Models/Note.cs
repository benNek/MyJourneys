using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public int JourneyId { get; set; }
        
        [ForeignKey("JourneyId")] public virtual Journey Journey { get; set; }
    }
}