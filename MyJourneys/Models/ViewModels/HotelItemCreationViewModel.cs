using System;

namespace MyJourneys.Models.ViewModels
{
    public class HotelItemCreationViewModel
    {
        public int JourneyId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public DateTime Date { get; set; }
    }
}