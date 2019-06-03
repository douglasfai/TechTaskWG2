// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var items = [];

function stringToNumber(valor) {
    return isNaN(valor) == false ? parseFloat(valor) : parseFloat(valor.replace('.', '').replace(',', '.'));
}

function numberToString(n, c, d, t) {
    c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function InsertPrice() {
    var unitPrice = $('#product option:selected').data('price');    
    $('#unitPrice').val(unitPrice);
}

function AddItem() {
    var productId = $('#product').val();
    var unitPrice = stringToNumber($('#unitPrice').val());
    var amount = $('#amount').val();
    var errorMessage = '';

    if (productId < 1)
        errorMessage += "Product is required. ";
    if (!(parseInt(amount) > 0))
        errorMessage += "Invalid amount. ";
    //if (!(parseFloat(unitPrice) >= 0))
    //    errorMessage += "Invalid price. ";

    if (errorMessage != '') {
        $('#errorMessage').html('<p class="alert alert-danger text-center">' + errorMessage + '</p>');
        return false;
    } else {
        items.push({ ProductId: productId, productName: $('#product option:selected').text(), Amount: amount, Price: unitPrice });
        ListItems();
        ClearItemFields();
    }
}

function ListItems() {
    var partialPrice;
    var itemsLength = items.length;
    var itemsTable = '';

    if (itemsLength > 0) {
        for (var i = 0; i < itemsLength; i++) {
            partialPrice = items[i].Amount * items[i].Price;
            itemsTable += '<tr><td>' + items[i].productName + '</td><td class="text-right">' + numberToString(items[i].Price) + '</td><td class="text-right">' + items[i].Amount + '</td><td class="text-right">' + numberToString(partialPrice) + '</td><td class="text-center"><a class="btn btn-danger" onclick="RemoveItem(' + i + ')"><span class="glyphicon glyphicon-remove"></span> Remove</a></td></tr>'
        }
    }
    $('#items tbody').html(itemsTable);
    CalculateTotalPrice();

    $('#buttonSave').attr('disabled', itemsLength == 0);
}

function RemoveItem(i) {
    if (confirm("Confirma remoção do item?")) {
        items.splice(i, 1);
        ListItems();
    }
}

function ClearItemFields() {
    $('#product').val(0);
    $('#unitPrice').val('');
    $('#amount').val('');
    $('#product').focus();
}

function ClearOrderFields() {
    $('#errorMessage').empty();
    $('#deliveryDate').val('');
    $('#discount').val('0,00');
    $('#totalPrice').val('0,00');
    ClearItemFields();
    $('#items tbody').empty();
    $('#deliveryDate').focus();
}

function CalculateTotalPrice() {
    $('#errorMessage').html('');
    var partialPrice;
    var totalPrice = 0;
    var discount = stringToNumber($("#discount").val());
    //$('#discount').val(discount);

    var itemsLength = items.length;

    if (itemsLength > 0) {
        for (i = 0; i < itemsLength; i++) {
            partialPrice = items[i].Amount * items[i].Price;
            totalPrice += partialPrice;
        }
    }

    if (!(discount >= 0)) {
        //$('#errorMessage').html('<p class="alert alert-danger text-center">Discount is not valid!</p>');
        $('#discount').val('0,00');
        $('#totalPrice').val(numberToString(totalPrice));
        return false;
    }

    if (totalPrice < discount) {
        alert("O desconto será retirado para que seu valor não seja maior do que o valor total do pedido!");
        discount = 0;
        $('#discount').val(numberToString(discount));
    }

    $('#totalPrice').val(numberToString((totalPrice - discount)));
}

function Save() {
    var errorMessage = "";
    var deliveryDate = $('#deliveryDate').val();
    var discount = stringToNumber($('#discount').val());

    if (deliveryDate == null || deliveryDate == "")
        errorMessage += "Delivery date required";

    if (errorMessage == "") {
        var token = $('input[name="__RequestVerificationToken"]').val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;

        var itemsLength = items.length;
        if (itemsLength > 0) {
            for (i = 0; i < itemsLength; i++) {
                items[i].Price *= 100;
            }
        }

        var data = {
            DeliveryDate: deliveryDate,
            Discount: discount * 100,
            Items: items,
            __RequestVerificationToken: token
        };
        console.log(data);
        $.ajax({
            type: 'POST',
            datatype: 'json',
            headers: headers,
            url: '/Order/Create',
            data: data,
            success: function (result) {
                if (result.status) {
                    ClearOrderFields();
                    alert(result.message);
                } else {
                    $('#errorMessage').html('<p class="alert alert-danger text-center">' + result.message + '</p>');
                }                
            },
            error: function (result) {
                $('#errorMessage').html('<p class="alert alert-danger text-center">' + result.message + '</p>');
            }
        });        
    } else {
        $('#errorMessage').html('<p class="alert alert-danger text-center">' + errorMessage + '</p>');
    }
}