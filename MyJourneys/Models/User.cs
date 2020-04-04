using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace MyJourneys.Models
{
    public class User : IdentityUser
    {
        public ICollection<Blog> Blogs { get; set; }
        public ICollection<Journey> Journeys { get; set; }
        public ICollection<EventItem> EventItems { get; set; }
        public ICollection<FlightItem> FlightItems { get; set; }
        public ICollection<HotelItem> HotelItems { get; set; }
        public ICollection<ReservationItem> ReservationItems { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<Place> Places { get; set; }
    }
}