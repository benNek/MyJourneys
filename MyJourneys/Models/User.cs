using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace MyJourneys.Models
{
    public class User : IdentityUser
    {
        public ICollection<Article> Articles { get; set; }
        public ICollection<Journey> Journeys { get; set; }
        public ICollection<ArticleLikes> ArticleLikes { get; set; }
        public ICollection<OverviewJourney> OverviewJourneys { get; set; }
    }
}