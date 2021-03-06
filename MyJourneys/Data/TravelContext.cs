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
            if (optionsBuilder.IsConfigured) return;
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{Environments.Development}.json", true)
                .AddJsonFile($"appsettings.{Environments.Production}.json", true)
                .AddEnvironmentVariables()
                .Build();
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
}