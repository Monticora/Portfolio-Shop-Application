using API.DTOs;
using API.Models;

namespace API.Extensions
{
    public static class BusketExtentions
    {
        public static BasketDto ReturnBasketDto(this Basket basket)
        {
            return new BasketDto
            {
                id = basket.id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}