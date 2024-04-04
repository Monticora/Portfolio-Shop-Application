using API.Context;
using API.DTOs;
using API.Extensions;
using API.Models;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly DataBaseContext _context;
        private readonly IMapper _mapper;
        public ProductsController(DataBaseContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _context.Products
                        .Sort(productParams.OrderBy)
                        .Search(productParams.Search)
                        .Filter(productParams.Brands, productParams.Types)
                        .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }
        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product == null) return NotFound();

            return product;
        }
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
           var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
           var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

           return Ok(new {brands, types});
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto createProductDto)
        {
            var product = _mapper.Map<Product>(createProductDto);

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetProduct", new {Id = product.Id}, product);

            return BadRequest(new ProblemDetails{Title = "Problem creating new product"});
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await _context.Products.FindAsync(updateProductDto.Id);

            if(product == null) return NotFound();

            _mapper.Map(updateProductDto, product);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return NoContent();

            return BadRequest(new ProblemDetails{Title = "Problem updating product"});
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            var produt = await _context.Products.FindAsync(id);

            if(produt == null) return NotFound();

            _context.Products.Remove(produt);
            
            var result = await _context.SaveChangesAsync() > 0;

             if(result) return NoContent();

            return BadRequest(new ProblemDetails{Title = "Problem deleting product"});
        }
    }
}