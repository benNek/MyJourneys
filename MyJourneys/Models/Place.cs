using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class Place
    {
        public int Id { get; set; }
        public string Location { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string UserId { get; set; }
        public int JourneyId { get; set; }
        
        [ForeignKey("UserId")] public virtual User User { get; set; }
        [ForeignKey("JourneyId")] public virtual Journey Journey { get; set; }
    }
}