namespace API.DTOs
{
    public class BasketDto
    {
        public Guid id {get;set;}
        public string BuyerId {get;set;}
        public List<BasketItemDto> Items {get;set;} = new List<BasketItemDto>();
    }
}