using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MyJourneys.Models;

namespace MyJourneys.Data
{
    public class TravelContext : IdentityDbContext<User>
    {
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<Article> Articles { get; set; }
        public virtual DbSet<ArticleTags> ArticleTags { get; set; }
        public virtual DbSet<ArticleLikes> ArticleLikes { get; set; }
        public virtual DbSet<Journey> Journeys { get; set; }
        public virtual DbSet<JourneyItem> JourneyItems { get; set; }
        // public virtual DbSet<FlightItem> FlightItems { get; set; }
        // public virtual DbSet<HotelItem> HotelItems { get; set; }
        // public virtual DbSet<ReservationItem> ReservationItems { get; set; }
        // public virtual DbSet<EventItem> EventItems { get; set; }
        public virtual DbSet<Note> Notes { get; set; }
        public virtual DbSet<Place> Places { get; set; }
        public virtual DbSet<OverviewJourney> OverviewJourneys { get; set; }
        public virtual DbSet<LocationPhoto> LocationPhotos { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<OverviewJourneysCountries> OverviewJourneysCountries { get; set; }

        public TravelContext()
        {
        }

        public TravelContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json",
                        optional: false,
                        reloadOnChange: true)
                    .AddJsonFile($"appsettings.{Environments.Development}.json", optional: true)
                    .AddJsonFile($"appsettings.{Environments.Production}.json", optional: true)
                    .AddEnvironmentVariables()
                    .Build();
                string connectionString = configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}