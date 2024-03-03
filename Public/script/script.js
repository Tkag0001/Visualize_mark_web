const login = async (acc) => {
    let responseData;
    await fetch('https://odd-ruby-trout-cap.cyclic.app/api/v1/auth/login', {
        method: 'POST',
        headers: {
            Accept: 'application/form-data',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(acc),
    }).then((response) => response.json()).then((data) => responseData = data)

    if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        const expirationTime = 2 * 60 * 1000
        const timeout = new Date().getTime() + expirationTime
        localStorage.setItem('auth-token-timeout', timeout)
        window.location.replace("/home");
    }
    else {
        swal("Login fail!", "Invalid username or password!", "error");
    }
}

$(document).ready(async function () {
    $('#sign-in-HCMOU-SSO').click(function () {
        Swal.fire({
            title: 'Login',
            html:
                '<input id="username" class="swal2-input" placeholder="Username">' +
                '<input type="password" id="password" class="swal2-input" placeholder="Password">',
            focusConfirm: false,
            preConfirm: () => {
                const username = Swal.getPopup().querySelector('#username').value;
                const password = Swal.getPopup().querySelector('#password').value;
                return { username: username, password: password };
            }
        }).then((result) => {
            // Login with username, password from result
            login(result.value)
        })

    })
})