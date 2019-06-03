using System;

namespace TechTaskWG2.ViewModels
{
    public class Order
    {
        public int Number { get; set; }
        public int OrderCode { get; set; }
        public DateTime DeliveryDate { get; set; }
        public decimal Discount { get; set; }
        public decimal OrderPrice { get; set; }
    }
}
