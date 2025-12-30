(() => {
    'use strict';

    const STATE = {
        username: '',
        password: '',
        otp: '',
        forgot: false,
        otpGenerated: '',
        failCount: 0
    };

    const CONFIG = {
        MAX_FAIL: 2,
        MAIN_PAGE: 'main.html'
    };

    $(init);

    function init() {
        localStorage.clear();
        DevExpress.ui.themes.current('generic.softblue');
        $('#aUsrName').text('User Name');

        createLoginPopup();
    }

    function createLoginPopup() {
        $('#popupContainer').dxPopup({
            width: 400,
            height: 300,
            visible: true,
            showCloseButton: false,
            dragEnabled: true,
            closeOnOutsideClick: false,
            shadingColor: 'rgba(190,190,190,0.9)',
            title: '',
            contentTemplate: renderLoginUI,
            onShown: e => e.component.content().find('input').first().focus()
        });
    }

    function renderLoginUI() {
        const $root = $('<div>');

        $('<div>').attr('id', 'username').appendTo($root);
        $('<div>').attr('id', 'password').appendTo($root);
        $('<div>').attr('id', 'otp').hide().appendTo($root);

        $('<div>').attr('id', 'loginBtn').appendTo($root);
        $('<div>').attr('id', 'forgotBtn').appendTo($root);

        initControls();
        return $root;
    }

    function initControls() {
        $('#username').dxTextBox({
            placeholder: 'Username',
            onValueChanged: e => STATE.username = e.value.toLowerCase()
        });

        $('#password').dxTextBox({
            mode: 'password',
            placeholder: 'Password',
            onValueChanged: e => STATE.password = e.value,
            buttons: [{
                name: 'eye',
                location: 'after',
                options: {
                    icon: 'eye',
                    onClick: e => {
                        const box = e.component;
                        box.option('mode', box.option('mode') === 'password' ? 'text' : 'password');
                    }
                }
            }]
        });

        $('#otp').dxTextBox({
            placeholder: 'OTP',
            onValueChanged: e => STATE.otp = e.value
        });

        $('#loginBtn').dxButton({
            text: 'LOGIN',
            type: 'success',
            onClick: handleLogin
        });

        $('#forgotBtn').dxButton({
            text: 'Forgot password',
            stylingMode: 'text',
            onClick: () => {
                STATE.forgot = true;
                $('#otp').show();
                generateOTP();
            }
        });
    }

    async function handleLogin() {
        try {
            validateInput();

            const result = await loginRequest();
            processLogin(result);

        } catch (err) {
            DevExpress.ui.dialog.alert(err.message);
        }
    }

    function validateInput() {
        if (!STATE.username) throw new Error('Username required');
        if (!STATE.forgot && !STATE.password) throw new Error('Password required');
    }

    async function loginRequest() {
        const payload = {
            user: STATE.username,
            password: STATE.password
        };

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Login failed');
        return res.json();
    }

    function processLogin(data) {
        if (STATE.forgot && STATE.otp !== STATE.otpGenerated) {
            throw new Error('Invalid OTP');
        }

        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = CONFIG.MAIN_PAGE;
    }

    function generateOTP() {
        STATE.otpGenerated = Math.random().toString(36).substring(2, 8).toUpperCase();
        console.log('OTP:', STATE.otpGenerated);
    }

})();
