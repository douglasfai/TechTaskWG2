using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechTaskWG2.Models
{
    public class Order
    {
        public int Id { get; set; }
        [Required]
        public DateTime DeliveryDate { get; set; }
        [Column(TypeName = "decimal(8, 2)")]
        public decimal Discount { get; set; }
        public ICollection<Item> Items { get; set; }
    }
}