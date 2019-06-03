using System.Collections.Generic;

namespace TechTaskWG2.ViewModels
{
    public class Report
    {
        public decimal Total { get; set; }
        public int NumberOfOrders { get; set; }
        public List<Order> Orders { get; set; }

        public Report()
        {
            Orders = new List<Order>();
        }
    }
}
