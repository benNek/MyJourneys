using System;

namespace MyJourneys.Models
{
    public class Journey
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}