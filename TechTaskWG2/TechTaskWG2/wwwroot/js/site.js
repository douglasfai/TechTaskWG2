// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var items = [];

function AddItem() {
    var productId = $('#product').val();
    var price = $('#price').val();
    var amount = $('#amount').val();
    var errorMessage = '';

    if (productId < 1)
        errorMessage += "Produto é obrigatório. ";
    if (!(parseInt(amount) > 0))
        errorMessage += "Quantidade inválida. ";
    if (!(parseFloat(price) >= 0))
        errorMessage += "Preço inválido. ";

    if (errorMessage != '') {
        $('#errorMessage').html('<p class="text-danger text-center">' + errorMessage + '</p>');
        return false;
    } else {
        items.push({ ProductId: productId, productName: $('#product option:selected').text(), Amount: amount, Price: price });
        ListItems();
        ClearItemFields();
    }
}

function ListItems() {
    var partialPrice;
    var itemsLength = items.length;
    var itemsTable = '<table><tr><th>Produto</th><th>Preço unitário</th><th>Quantidade</th><th>Preço parcial</th><th>Excluir</th></tr>';

    if (itemsLength > 0) {
        for (i = 0; i < itemsLength; i++) {
            partialPrice = items[i].Amount * items[i].Price;
            itemsTable += '<tr><td>' + items[i].productName + '</td><td>' + items[i].Amount + '</td><td>' + items[i].Price + '</td><td>' + partialPrice + '</td><td><a href="#" onclick="RemoveItem(' + i + ')">Remover</a></td></tr>'
        }
    }

    itemsTable += '</table>';
    $('#items').html(itemsTable);
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
    $('#product').focus();
    $('#price').val('');
    $('#amount').val('');
}

function ClearOrderFields() {
    $('#deliveryDate').val('');
    $('#discount').val('');
    ClearItemFields();
}

function CalculateTotalPrice() {
    $('#errorMessage').html('');
    var totalPrice = 0;
    var discount = $("#discount").val();
    var itemsLength = items.length;

    if (itemsLength > 0) {
        for (i = 0; i < itemsLength; i++) {
            partialPrice = items[i].Amount * items[i].Price;
            totalPrice += partialPrice;
        }
    }

    if (!(parseFloat(discount) >= 0)) {
        $('#errorMessage').html('<p class="text-danger text-center">Discount is not valid!</p>');
        return false;
    }

    if (totalPrice < discount) {
        alert("O desconto será retirado para que seu valor não seja maior do que o valor total do pedido!");
        discount = 0;
        $('#discount').val(0);
    }

    $('#totalPrice').val(totalPrice - discount);
}

function Save() {
    var token = $('input[name="__RequestVerificationToken"]').val();
    var headers = {};
    headers['__RequestVerificationToken'] = token;

    var data = {
        DeliveryDate: $('#deliveryDate').val(),
        Discount: $('#discount').val(),
        Items: items,
        __RequestVerificationToken: token
    };

    $.ajax({
        type: 'POST',
        datatype: 'json',
        headers: headers,
        url: '/Order/Create',
        data: data,
        success: function (result) {
            debugger;
            resp = result;
            alert(resp);
            ClearOrderFields();
        },
        error: function (result) {
            debugger;
            console.log('Erro: ' + JSON.stringify(result));
        }
    });
    return resp;
}