// Display error message display the message on the webpage
// and make the error box visible so the user can read it
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};

// Send a POST request to the server with the provided data and handle the response
const sendPost = async (url, data, handler) => {

    // Send a POST request to the server with the provided data and handle the response
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // wait for the response and parse it as JSON
    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');

    // check result, is it redirecting or is it an error? 
    // If it's redirecting, change the window location to the redirect URL. 
    // If it's an error, display the error message. 
    // If there's a handler function provided, call it with the result.
    if (result.redirect) {
        window.location = result.redirect;
    }
    if (result.error) {
        handleError(result.error);
    }
    if (handler) {
        handler(result);
    }
};

// Hide the error message box by adding the 'hidden' class to it, css will handle the rest
const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError,
};