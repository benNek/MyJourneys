using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using MyJourneys.Models;

namespace MyJourneys.Data
{
    public class TravelContext : IdentityDbContext<User>
    {

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Journey> Journeys { get; set; }
        public DbSet<FlightItem> FlightItems { get; set; }
        public DbSet<HotelItem> HotelItems { get; set; }
        public DbSet<ReservationItem> ReservationItems { get; set; }
        public DbSet<EventItem> EventItems { get; set; }
        public DbSet<Note> Notes { get; set; }

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