$(document).ready(function () {
    $('#items tbody tr').each(function () {
        var item = {ProductId: 0, productName: '', Price: 0, Amount: 0};

        var td = $(this).find('td');

        item.ProductId = parseInt(td[0].textContent);
        item.productName = td[1].textContent; 
        item.Price = stringToNumber(td[2].textContent); 
        item.Amount = parseInt(td[3].textContent); 

        items.push(item);        
    });
    ListItems();
});