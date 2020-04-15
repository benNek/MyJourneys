using System.Collections.Generic;

namespace MyJourneys.Models
{
    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Alpha2 { get; set; }
        public string Alpha3 { get; set; }

        public Country(string name, string alpha2, string alpha3)
        {
            Name = name;
            Alpha2 = alpha2;
            Alpha3 = alpha3;
        }

        public virtual ICollection<OverviewJourneysCountries> OverviewJourneysCountries { get; set; }
    }
}