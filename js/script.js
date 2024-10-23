// script.js

document.addEventListener('DOMContentLoaded', function() {
    const addItemButton = document.getElementById('add-item');
    const itemsBody = document.getElementById('items-body');
    const invoiceForm = document.getElementById('invoice-form');

    // Add new item
    addItemButton.addEventListener('click', function() {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="text" name="produit[]" required></td>
            <td><input type="number" name="quantite[]" min="1" value="1" required></td>
            <td><input type="number" name="prix-ht[]" min="0" step="0.01" value="0.00" required></td>
            <td><input type="number" name="total-ht[]" readonly></td>
            <td><input type="number" name="total-ttc[]" readonly></td>
            <td><button type="button" class="remove-item">Delete</button></td>
        `;

        itemsBody.appendChild(newRow);
    });

    // Remove item
    itemsBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-item')) {
            e.target.closest('tr').remove();
            calculateTotals();
        }
    });

    // Calculate totals on input change
    itemsBody.addEventListener('input', function(e) {
        const row = e.target.closest('tr');
        if (row) {
            const quantite = parseFloat(row.querySelector('input[name="quantite[]"]').value) || 0;
            const prixHt = parseFloat(row.querySelector('input[name="prix-ht[]"]').value) || 0;
            const totalHt = quantite * prixHt;
            const totalTtc = totalHt * 1.2; // VAT 20%

            row.querySelector('input[name="total-ht[]"]').value = totalHt.toFixed(2);
            row.querySelector('input[name="total-ttc[]"]').value = totalTtc.toFixed(2);
        }
        calculateTotals();
    });

    // Calculate overall totals
    function calculateTotals() {
        let totalHtSum = 0;
        let totalTtcSum = 0;

        const totalHtInputs = document.querySelectorAll('input[name="total-ht[]"]');
        const totalTtcInputs = document.querySelectorAll('input[name="total-ttc[]"]');

        totalHtInputs.forEach(input => {
            totalHtSum += parseFloat(input.value) || 0;
        });

        totalTtcInputs.forEach(input => {
            totalTtcSum += parseFloat(input.value) || 0;
        });

        const tva = totalHtSum * 0.2;
        const totalDeboursTtc = totalTtcSum; // Can be adjusted as needed
        const grandTotalTtc = totalTtcSum + tva;

        document.getElementById('tva').innerText = tva.toFixed(2);
        document.getElementById('total-debours').innerText = totalDeboursTtc.toFixed(2);
        document.getElementById('total-ttc').innerText = grandTotalTtc.toFixed(2);
    }

    // Calculate totals on page load
    calculateTotals();

    // Prevent form submission to show results in console
    invoiceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Invoice created successfully!');
        // Additional functionalities can be added here like sending data to server or generating PDF
    });
});
