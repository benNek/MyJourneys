using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class JourneyItem
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int JourneyId { get; set; }

        [ForeignKey("JourneyId")] public virtual Journey Journey { get; set; }
    }
}