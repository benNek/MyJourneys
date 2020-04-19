using System.Linq;
using System.Net;
using MyJourneys.Models;
using Newtonsoft.Json.Linq;

namespace MyJourneys.Data
{
    public class CountriesSeed
    {
        private TravelContext _context;

        public CountriesSeed()
        {
            _context = new TravelContext();
        }

        public void Seed()
        {
            if (_context.Countries.Any())
            {
                return;
            }

            using (var webClient = new WebClient())
            {
                var json = webClient.DownloadString("https://restcountries.eu/rest/v2/all");
                var countries = JArray.Parse(json);
                foreach (var jsonCountry in countries)
                {
                    var country = (JObject) jsonCountry;
                    var name = (string) country["name"];
                    var alpha2 = (string) country["alpha2Code"];
                    var alpha3 = (string) country["alpha3Code"];
                    _context.Countries.Add(new Country(name, alpha2, alpha3));
                }

                _context.SaveChanges();
            }
        }
    }
}