var navigation = false;




// Handle next button
document.getElementById('next-step').addEventListener('click', async function () {
    // Disable all visible buttons (next-step, refresh-captcha buttons)
    document.getElementById('next-step').disabled = true;
    document.getElementById('refresh-captcha').disabled = true;

    // Start loading animation
    document.getElementById('text-1').classList.add('hidden');
    document.getElementById('loading-spinner-1').classList.remove('hidden');

    // Get the aadhaar number and captcha text
    const aadhaarNum = document.getElementById('aadhaar-number').value;
    const captchaVal = document.getElementById('captcha-text').value;
    const data = {
        aadhaarNum: aadhaarNum,
        captchaVal: captchaVal,
    };

    // Trigger and send the details to default route's POST method
    await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(!response.ok){
            alert(`Error while refreshing captcha . . . . !
                Try Refreshing the Page . . . .`);
            document.getElementById('loading-spinner-1').classList.add('hidden');
            document.getElementById('text-1').classList.remove('hidden');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(resData => {
        if(resData.status == 'success'){
            document.getElementById('form-step-2').classList.remove('hidden');
            alert("OTP Sent Successfully . . . .");
        }
        else if(resData.status == 'failed'){
            alert("Enter Correct captcha . . . . ");
            // Enable buttons
            document.getElementById('next-step').disabled = false;
            document.getElementById('refresh-captcha').disabled = false;

            // Stop Loading animation to refresh-captcha button
            document.getElementById('loading-spinner-1').classList.add('hidden');
            document.getElementById('text-1').classList.remove('hidden');
        }
        else{
            alert(`Error while refreshing captcha . . . . !
                Try Refreshing the Page . . . .`);
            // Enable buttons
            document.getElementById('next-step').disabled = false;
            document.getElementById('refresh-captcha').disabled = false;
            // Stop Loading animation to refresh-captcha button
            document.getElementById('loading-spinner-1').classList.add('hidden');
            document.getElementById('text-1').classList.remove('hidden');
        }
    })
    .catch(error => {
        alert(`Error while refreshing captcha . . . . !
            Try Refreshing the Page . . . .`);
        // Enable buttons
        document.getElementById('next-step').disabled = false;
        document.getElementById('refresh-captcha').disabled = false;
        // Stop Loading animation to refresh-captcha button
        document.getElementById('loading-spinner-1').classList.add('hidden');
        document.getElementById('text-1').classList.remove('hidden');
    });
});




// Handle Captcha Refresh Button
document.getElementById('refresh-captcha').addEventListener('click', async function () {
    // Disable all visible buttons (next-step, refresh-captcha buttons)
    document.getElementById('next-step').disabled = true;
    document.getElementById('refresh-captcha').disabled = true;

    // Start Loading Animation
    document.getElementById('refresh').classList.add('hidden');
    document.getElementById('refresh-spinner').classList.remove('hidden');

    // Trigger the /refresh_captcha route using POST method
    await fetch('/refresh_captcha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if(!response.ok){
            alert(`Response is not ok . . . . !
                Try Refreshing the Page . . . .`);
            document.getElementById('refresh-spinner').classList.add('hidden');
            document.getElementById('refresh').classList.remove('hidden');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(resData => {
        if(resData.status == 'success'){
            // Set up the fresh captcha
            imageElement = document.getElementById("captcha");
            imageElement.src = '../static/'+resData.folder_id+'/captcha/aadhaar_captcha_img.png' + '?t=' + new Date().getTime(); // Add timestamp to prevent caching

            new Promise(resolve => setTimeout(resolve, 2000));

            // Enable refresh-captcha and next-step buttons
            document.getElementById('refresh-captcha').disabled = false;
            document.getElementById('next-step').disabled = false;
        }
        else{
            alert(`Problem while refreshing captcha . . . . !
                Try Refreshing the Page . . . .`);
            // Enable refresh-captcha and next-step buttons
            document.getElementById('refresh-captcha').disabled = false;
            document.getElementById('next-step').disabled = false;
        }
    })
    .catch(error => {
        alert(`Error while refreshing captcha . . . . !
            Try Refreshing the Page . . . .`);
        // Enable refresh-captcha and next-step buttons
        document.getElementById('refresh-captcha').disabled = false;
        document.getElementById('next-step').disabled = false;
        console.error('Error:', error);
    });

    // Stop Loading animation
    document.getElementById('refresh-spinner').classList.add('hidden');
    document.getElementById('refresh').classList.remove('hidden');
});




// Handle OTP Verify button
document.getElementById('verify-otp').addEventListener('click', async function () {
    // Disable verify-otp button
    document.getElementById('verify-otp').disabled = true;

    // Start Loading animation
    document.getElementById('text-2').classList.add('hidden');
    document.getElementById('loading-spinner-2').classList.remove('hidden');

    // Get the otp
    const otp = document.getElementById('otp').value;
    const data = {
        otp: otp,
    };

    // Trigger the /verify_otp route and send data using POST method
    await fetch('/verify_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(!response.ok){
            alert(`Response is not ok . . . . !
                Try Refreshing the Page . . . .`);
            // Disable verify-otp button
            document.getElementById('verify-otp').disabled = true;
            document.getElementById('loading-spinner-2').classList.add('hidden');
            document.getElementById('text-2').classList.remove('hidden');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(resData => {
        console.log(resData);
        console.log(resData.status);
        console.log(resData.message);
        if(resData.status == 'success'){
            alert('OTP verified Successfully . . . .');
            document.getElementById('popup-container').classList.remove('hidden');
        }
        else{
            alert(`Aadhaar not downloaded . . . . !
                Try Refreshing the Page . . . .`);
            // Disable verify-otp button
            document.getElementById('verify-otp').disabled = true;
            // document.getElementById('loading-spinner-2').classList.add('hidden');
            // document.getElementById('text-2').classList.remove('hidden');
            document.getElementById('popup-container').classList.remove('hidden');
        }
    })
    .catch(error => {
        alert(`Error while verifying OTP . . . . !
            Try Refreshing the Page . . . .`);
        // Disable verify-otp button
        document.getElementById('verify-otp').disabled = true;
        document.getElementById('loading-spinner-2').classList.add('hidden');
        document.getElementById('text-2').classList.remove('hidden');
        console.error('Error:', error);
    });
});




// Handle popup submittion button
document.getElementById('submit-popup').addEventListener('click', async function () {
    // Diable submit-popup button
    document.getElementById('submit-popup').disabled = true;

    // Start loading animation
    document.getElementById('text-3').classList.add('hidden');
    document.getElementById('loading-spinner-3').classList.remove('hidden');

    // Get the detials
    const fullName = document.getElementById('name').value;
    const yob = document.getElementById('yob').value;
    const data = {
        fullName: fullName,
        yob: yob,
    };

    // Trigger /face_verification path and send the details using POST method
    await fetch('/face_verification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(!response.ok){
            alert(`Response is not ok . . . . !
                Try Refreshing the Page . . . .`);
            document.getElementById('loading-spinner-3').classList.add('hidden');
            document.getElementById('text-3').classList.remove('hidden');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(resData => {
        if(resData.status == 'success'){
            alert('Image Extracted Successfully . . . .');
            // document.getElementById('popup-container').classList.remove('hidden');
            // alert('You can proceed for live face capture and face matching for face authentication. . . .');
            navigation = true;
            window.location.href = '/face_auth';
        }
        else if(resData.message == 'Authentication Failed'){
            alert(`Authentication Failed . . . . !
                Close the tab . . . .`);
        }
        else{
            alert(resData.message + ` . . . . !
                Try Refreshing the Page . . . .`);
            document.getElementById('loading-spinner-3').classList.add('hidden');
            document.getElementById('text-3').classList.remove('hidden');
        }
    })
    .catch(error => {
        alert(`Error while Authentication . . . . !
            Try Refreshing the Page . . . .`);
        document.getElementById('loading-spinner-3').classList.add('hidden');
        document.getElementById('text-3').classList.remove('hidden');
        console.error('Error:', error);
    });
});




// Detect page unload or tab closure
window.addEventListener('beforeunload', async function (event) {
    // console.log(navigation);
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // alert("Navigation =", navigation);
    if(navigation == false){
        await fetch('/close_session', { method: 'POST', credentials: 'include'})
            .then(response => response.json())
            .then(data => console.log('Session closed:', data))
            .catch(err => console.error('Error closing session:', err));
        // alert("You are closing the window/tab");
    }
});
