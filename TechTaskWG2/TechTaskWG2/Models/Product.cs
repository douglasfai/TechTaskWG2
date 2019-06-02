using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechTaskWG2.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "varchar(60)")]
        public string Name { get; set; }
        [Column(TypeName = "varchar(200)")]
        public string Description { get; set; }
        [Required]
        [Column(TypeName = "decimal(8, 2)")]
        public decimal Price { get; set; }
        public ICollection<Item> Items { get; set; }
    }
}
