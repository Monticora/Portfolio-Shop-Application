using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Context
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Product> Products {get;set;}
    }
}