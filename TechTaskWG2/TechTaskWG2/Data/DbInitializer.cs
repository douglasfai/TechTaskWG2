using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechTaskWG2.Models;

namespace TechTaskWG2.Data
{
    public class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Products.Any())
            {
                return;
            }

            for (int i = 1; i < 6; i++)
            {
                context.Orders.Add(new Order { DeliveryDate = DateTime.Parse("2019-06-" + i), Discount = 2.00M });
            }
            context.SaveChanges();

            for (int i = 1; i < 6; i++)
            {
                context.Products.Add(new Product { Name = "Product " + i, Price = i * 0.50M });
            }
            context.SaveChanges();

            for (int i = 1; i < 6; i++)
            {
                context.Items.Add(new Item { OrderId = 6 - i, ProductId = i, Price = 5.00M, Amount = 2 });
            }
            context.SaveChanges();
        }
    }
}
