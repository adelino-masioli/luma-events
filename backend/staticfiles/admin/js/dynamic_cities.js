(function($) {
    $(document).ready(function() {
        // Function to update city options based on selected state
        function updateCityOptions() {
            const stateSelect = $('#id_state');
            const citySelect = $('#id_city');
            const selectedState = stateSelect.val();
            
            if (selectedState) {
                // Store the current selected city to try to restore it after filtering
                const currentCity = citySelect.val();
                
                // Disable the city field while loading
                citySelect.prop('disabled', true);
                
                // Make an AJAX request to get cities for the selected state
                $.ajax({
                    url: '/admin/events/city/?state=' + selectedState,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        // Clear existing options except the empty one
                        citySelect.find('option:not(:first)').remove();
                        
                        // Add new options based on the response
                        $.each(data, function(index, city) {
                            citySelect.append($('<option></option>')
                                .attr('value', city.id)
                                .text(city.name));
                        });
                        
                        // Try to restore the previously selected city if it's still available
                        if (currentCity) {
                            citySelect.val(currentCity);
                        }
                        
                        // Re-enable the city field
                        citySelect.prop('disabled', false);
                    },
                    error: function() {
                        console.error('Failed to fetch cities for the selected state');
                        citySelect.prop('disabled', false);
                    }
                });
            } else {
                // If no state is selected, clear city options except the empty one
                citySelect.find('option:not(:first)').remove();
            }
        }
        
        // Attach event listener to state select field
        $('#id_state').on('change', updateCityOptions);
        
        // Call the function on page load if a state is already selected
        if ($('#id_state').val()) {
            updateCityOptions();
        }
    });
})(django.jQuery);