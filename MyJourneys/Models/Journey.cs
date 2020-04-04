using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class Journey
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [ForeignKey("UserId")] public virtual User User { get; set; }

        public ICollection<EventItem> EventItems { get; set; }
        public ICollection<FlightItem> FlightItems { get; set; }
        public ICollection<HotelItem> HotelItems { get; set; }
        public ICollection<ReservationItem> ReservationItems { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<Place> Places { get; set; }
    }
}