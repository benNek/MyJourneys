using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MyJourneys.Models;

namespace MyJourneys.Data
{
    public class TravelContext : IdentityDbContext<User>
    {
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleTags> ArticleTags { get; set; }
        public DbSet<ArticleLikes> ArticleLikes { get; set; }
        public DbSet<Journey> Journeys { get; set; }
        public DbSet<FlightItem> FlightItems { get; set; }
        public DbSet<HotelItem> HotelItems { get; set; }
        public DbSet<ReservationItem> ReservationItems { get; set; }
        public DbSet<EventItem> EventItems { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<OverviewJourney> OverviewJourneys { get; set; }
        public DbSet<LocationPhoto> LocationPhotos { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<OverviewJourneysCountries> OverviewJourneysCountries { get; set; }

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