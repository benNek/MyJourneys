using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyJourneys.Models;

namespace MyJourneys.Data
{
    public class TravelContext : IdentityDbContext<User>
    {
        
        public TravelContext()
        {

        }

        public TravelContext(DbContextOptions options) : base(options)
        {

        }
        
    }
}