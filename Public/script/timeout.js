function setTimeOut() {

    // Time to out
    const expectedTime = localStorage.getItem('auth-token-timeout'); // 60000ms = 1 phút
    console.log(expectedTime)
    if (expectedTime != null) {
        // Set interval to out 
        const intervalId = setInterval(function () {
            // Lấy thời gian hiện tại trong mỗi lần gọi hàm
            const now = new Date().getTime();
            console.log('Current time: ', now)
            // So sánh thời gian hiện tại với thời gian dự kiến
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