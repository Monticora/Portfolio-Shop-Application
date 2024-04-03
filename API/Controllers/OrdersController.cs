using API.Context;
using API.DTOs;
using API.Extensions;
using API.Models;
using API.Models.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly DataBaseContext _context;
        public OrdersController(DataBaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders.ProjectOrderToOrderDto()
                                        .Where(x => x.BuyerId == User.Identity.Name)
                                        .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(Guid id)
        {
            return await _context.Orders.ProjectOrderToOrderDto()
                                        .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                                        .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if(basket == null) return BadRequest(new ProblemDetails{Title="Could not locate basket"});

            var items = new List<OrderItem>();

            foreach(var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var ItemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = ItemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var delivaryFee = subtotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = delivaryFee
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if(orderDto.SaveAddress)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                user.Address = new Address
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country
                };
                _context.Update(user);
            }
            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

            return BadRequest("Problem creating order");
        }
    }
}