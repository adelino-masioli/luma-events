(function($) {
    $(document).ready(function() {
        // Function to update city options based on selected state
        function updateCityOptions() {
            const stateSelect = $('#id_state');
            const citySelect = $('#id_city');
            const selectedState = stateSelect.val().trim();

            //console.log(`Estado selecionado: ${selectedState}`);
 
            if (selectedState.length > 0) {
                // Store the current selected city to try to restore it after filtering
                const currentCity = citySelect.val();
                // Disable the city field while loading
                citySelect.prop('disabled', true);

                // Make an AJAX request to get cities for the selected state
                $.ajax({
                    url: '/api/cities/?state=' + selectedState,  // Alterado para a nova URL
                    type: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    dataType: 'json',
                    success: function(data) {

                        // Clear current city options (except the first "choose" option)
                        citySelect.find('option:not(:first)').remove();

                        // If there are cities in the response, add them to the select
                        if (data.length > 0) {
                            data.forEach(function(city) {
                                citySelect.append(new Option(city.name, city.id));
                            });

                            // Re-enable the city select after loading cities
                            citySelect.prop('disabled', false);
                            
                            // Restore the previously selected city, if possible
                            if (currentCity && citySelect.find('option[value="' + currentCity + '"]').length) {
                                citySelect.val(currentCity);
                            }
                        } else {
                            // No cities found, just keep the disabled state
                            citySelect.prop('disabled', true);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Erro na requisição AJAX:", status, error);
                        console.error("Resposta completa:", xhr.responseText);  // Mostra o que o backend está retornando
                    }
                });
            } else {
                // If no state is selected, clear city options except the empty one and disable it
                citySelect.find('option:not(:first)').remove();
                citySelect.prop('disabled', true);
            }
        }
        
        // Attach event listener to state select field
        $('#id_state').on('change', updateCityOptions);
        
        // Call the function on page load if a state is already selected
        if ($('#id_state').val()) {
            updateCityOptions();
        }

        //generate token 
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.startsWith(name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    });
})(jQuery);
