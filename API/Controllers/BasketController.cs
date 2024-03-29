using API.Context;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly DataBaseContext _context;
        public BasketController(DataBaseContext context)
        {
            _context = context;
        }
        private async Task<Basket> RetriveBasket()
        {
            return await _context.Baskets.Include(i => i.Items).ThenInclude(p => p.Product).FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }
        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
        private BasketDto ReturnBasketDto(Basket basket)
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
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetriveBasket();

            if (basket == null) return NotFound();

            return ReturnBasketDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(Guid productId, int quantity)
        {
            var basket = await RetriveBasket();

            if(basket == null) basket = CreateBasket();

            var product = await _context.Products.FindAsync(productId);
            
            if(product == null) return NotFound();

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetBasket", ReturnBasketDto(basket));

            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(Guid productId, int quantity)
        {
            var basket = await RetriveBasket();

            if(basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok();
            
            return BadRequest(new ProblemDetails{Title="Problem removing item from the basket"});
        }
    }
}