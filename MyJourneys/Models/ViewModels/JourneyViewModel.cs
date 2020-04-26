using System;
using MyJourneys.Enums;

namespace MyJourneys.Models.ViewModels
{
    public class JourneyViewModel
    {
        public int Id { get; set; }
        public string Location { get; set; }
        public string PhotoPath { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool Expired { get; set; }
    }
}