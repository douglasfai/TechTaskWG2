using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TechTaskWG2.Data;
using TechTaskWG2.Models;

namespace TechTaskWG2.Controllers
{
    public class OrderController : Controller
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Order
        public async Task<IActionResult> Index()
        {
            return View(await _context.Orders.ToListAsync());
        }

        // GET: Order/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var order = await _context.Orders
                .Include(s => s.Items)
                .ThenInclude(e => e.Product)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // GET: Order/Create
        public IActionResult Create()
        {
            //ViewBag.Products = new SelectList(_context.Products.ToList(), "Id", "Name");
            ViewBag.Products = _context.Products.ToList();
            return View();
        }

        // POST: Order/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Order order)
        {
            bool status = false;
            string message = "";

            order.Discount /= 100;
            foreach (var item in order.Items)
                item.Price /= 100;
            

            try
            {
                if (ModelState.IsValid)
                {
                    _context.Add(order);
                    await _context.SaveChangesAsync();
                    status = true;
                    message = "Saved successfully";
                }
                else
                {
                    message = "Problem saving. Please check the fields and try again...";
                }
            }
            catch (DbUpdateException exception)
            {
                //ModelState.AddModelError("", "Problem saving: " + exception.Message);
                message = "Problem saving: " + exception.Message;
            }

            //return View(order);            
            return Json(new { status = status, message = message });
        }

        // GET: Order/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return View(order);
        }

        // POST: Order/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost, ActionName("Edit")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditPost(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var updateOrder = await _context.Orders.SingleOrDefaultAsync(s => s.Id == id);
            if (await TryUpdateModelAsync<Order>(updateOrder, "", s => s.DeliveryDate, s => s.Discount))
            {
                try
                {
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateException exception)
                {
                    ModelState.AddModelError("", "Problem updating: " + exception.Message);
                }
            }

            return View(updateOrder);
        }

        // GET: Order/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError = false, string errorMessage = "")
        {
            if (id == null)
            {
                return NotFound();
            }

            var order = await _context.Orders
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            if (saveChangesError.GetValueOrDefault())
            {
                ViewData["ErrorMessage"] = string.Format("Deletion failed ({0}). Try again?", errorMessage);
            }

            return View(order);
        }

        // POST: Order/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var order = await _context.Orders
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (order == null)
            {
                return RedirectToAction("Index");
            }

            try
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateException exception)
            {
                return RedirectToAction("Delete", new { id = id, saveChangesError = true, errorMessage = exception.Message });
            }
        }

        public async Task<IActionResult> Report()
        {
            var reportViewModel = new ViewModels.Report();
            
            var orders = await _context.Orders
                .Include(s => s.Items)
                .AsNoTracking()
                .ToListAsync();

            decimal orderPrice;
            decimal total = 0;
            int numberOfOrders = 1;

            foreach(var order in orders)
            {
                //orderPrice = 0;
                //foreach (var item in order.Items)
                //{
                //    orderPrice += item.Price * item.Amount;
                //}

                orderPrice = order.Items.Where(x => x.OrderId == order.Id).Sum(x => x.Price * x.Amount);
                orderPrice -= order.Discount;
                total += orderPrice;

                var orderViewModel = new ViewModels.Order()
                {
                    Number = numberOfOrders++,
                    OrderCode = order.Id,
                    DeliveryDate = order.DeliveryDate,
                    Discount = order.Discount,
                    OrderPrice = orderPrice
                };
                
                reportViewModel.Orders.Add(orderViewModel);
            }

            reportViewModel.Total = total;
            reportViewModel.NumberOfOrders = --numberOfOrders;

            return View(reportViewModel);
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
