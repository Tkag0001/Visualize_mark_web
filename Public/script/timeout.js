function setTimeOut() {

    // Time to out
    const expectedTime = localStorage.getItem('auth-token-timeout'); // 60000ms = 1 phút
    if (expectedTime != null) {
        // Set interval to out 
        const intervalId = setInterval(function () {
            // Get current time
            const now = new Date().getTime();
            // Compare current time with the expectedtime
            if (now >= expectedTime) {
                console.log("Log out");
                localStorage.removeItem('auth-token-timeout')
                localStorage.removeItem('auth-token')

                //Stop interval
                clearInterval(intervalId);
                //Back to login
                swal("Login timed out!", "Please login again to use service.", "warning")
                    .then(() => { window.location.replace("/login"); })

            }
        }, 1000);

    }
}

setTimeOut();