jQuery(document).ready(function($) {
    $('#vehicle-lookup-form').on('submit', function(e) {
        e.preventDefault();
        
        const regNumber = $('#regNumber').val().trim();
        const resultsDiv = $('#vehicle-lookup-results');
        const errorDiv = $('#vehicle-lookup-error');
        
        // Hide previous results/errors
        resultsDiv.hide();
        errorDiv.hide();
        
        // Validate Norwegian registration number
        if (!regNumber || !/^[A-Z]{2}[0-9]{4,5}$/.test(regNumber)) {
            errorDiv.html('Please enter a valid Norwegian registration number (e.g., AB12345)').show();
            return;
        }
        
        // Show loading state
        $(this).find('button').prop('disabled', true).text('Looking up...');
        
        // Make AJAX request
        $.ajax({
            url: vehicleLookupAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'vehicle_lookup',
                nonce: vehicleLookupAjax.nonce,
                regNumber: regNumber
            },
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            success: function(response) {
                if (response.success && response.data) {
                    const data = response.data;
                    let html = '<table class="vehicle-info-table">';
                    
                    // Display vehicle information
                    for (const [key, value] of Object.entries(data)) {
                        if (value && typeof value !== 'object') {
                            html += `<tr>
                                <th>${key.replace(/_/g, ' ').toUpperCase()}</th>
                                <td>${value}</td>
                            </tr>`;
                        }
                    }
                    
                    html += '</table>';
                    resultsDiv.find('.results-content').html(html);
                    resultsDiv.show();
                } else {
                    errorDiv.html('Failed to retrieve vehicle information').show();
                }
            },
            error: function() {
                errorDiv.html('Error connecting to the server').show();
            },
            complete: function() {
                // Reset button state
                $('#vehicle-lookup-form button')
                    .prop('disabled', false)
                    .text('Look Up Vehicle');
            }
        });
    });
});
