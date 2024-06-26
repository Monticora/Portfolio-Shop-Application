using Microsoft.EntityFrameworkCore;

namespace API.Models.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered
    {
        public Guid ProductId {get;set;}
        public string Name {get;set;}
        public string PictureUrl {get;set;}
    }
}