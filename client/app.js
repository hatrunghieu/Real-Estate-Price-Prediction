function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1;
}

function setLoading(isLoading) {
    const container = document.querySelector('.container');
    const submitBtn = document.querySelector('.submit');

    if (isLoading) {
        container.classList.add('loading');
        submitBtn.textContent = 'Calculating...';
    } else {
        container.classList.remove('loading');
        submitBtn.textContent = 'Estimate Price';
    }
}

function showResult(price) {
    const resultDiv = document.getElementById('uiEstimatedPrice');
    const resultH2 = resultDiv.querySelector('h2');
    resultH2.textContent = `₹${price} Lakhs`;
    resultDiv.classList.add('show');
}

function showError(element, message) {
    element.classList.add('error');
    alert(message);
    setTimeout(() => {
        element.classList.remove('error');
    }, 3000);
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Validation
    if (!sqft.value || sqft.value <= 0) {
        showError(sqft, "Please enter a valid area in square feet");
        return;
    }

    if (bhk === -1) {
        alert("Please select number of bedrooms (BHK)");
        return;
    }

    if (bathrooms === -1) {
        alert("Please select number of bathrooms");
        return;
    }

    if (!location.value) {
        showError(location, "Please select a location");
        return;
    }

    // Hide previous result and show loading
    estPrice.classList.remove('show');
    setLoading(true);

    var url = "http://127.0.0.1:5000/predict_home_price";
    // var url = "/api/predict_home_price"; // Use this if using nginx

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }).done(function (data) {
        console.log(data.estimated_price);
        showResult(data.estimated_price);
    }).fail(function () {
        console.log("Error occurred during prediction");
        estPrice.innerHTML = "<h2>Error: Could not get price estimate</h2>";
        estPrice.classList.add('show');
    }).always(function () {
        setLoading(false);
    });
}

function onPageLoad() {
    console.log("document loaded");
    var url = "http://127.0.0.1:5000/get_location_names";
    // var url = "/api/get_location_names"; // Use this if using nginx

    $.get(url, function (data, status) {
        console.log("got response for get_location_names request");
        if (data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();

            $('#uiLocations').append('<option value="" disabled selected>Choose a Location</option>');

            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
}

window.onload = onPageLoad;