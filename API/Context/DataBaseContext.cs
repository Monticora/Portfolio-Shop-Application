using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Context
{
    public class DataBaseContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Product> Products {get;set;}
        public DbSet<Basket> Baskets {get;set;}
    }
}