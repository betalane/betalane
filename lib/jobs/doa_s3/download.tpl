<!doctype html>
<html lang="en" class="no-js">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="Seaflux - Beta Apps">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            height: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            overflow: hidden;
        }

        .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
        }

        .background-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: float 6s ease-in-out infinite;
        }

        .shape:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }

        .shape:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 60%;
            right: 10%;
            animation-delay: 2s;
        }

        .shape:nth-child(3) {
            width: 60px;
            height: 60px;
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        .card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 48px;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 480px;
            width: 100%;
            position: relative;
            z-index: 1;
            animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 32px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .logo img {
            width: 80px;
            height: auto;
            filter: brightness(0) invert(1);
        }

        .brand-name {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .app-info {
            margin-bottom: 32px;
        }

        .app-name {
            font-size: 24px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        .platform-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .platform-icon {
            width: 16px;
            height: 16px;
        }

        .version {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 400;
            margin-bottom: 16px;
        }

        .description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            max-width: 320px;
            margin: 0 auto;
        }

        .download-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .download-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .download-btn:hover::before {
            left: 100%;
        }

        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(79, 172, 254, 0.6);
        }

        .download-btn:active {
            transform: translateY(0);
        }

        .download-icon {
            width: 20px;
            height: 20px;
        }

        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(34, 197, 94, 0.95);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
        }

        .alert.show {
            transform: translateX(0);
            opacity: 1;
            pointer-events: auto;
        }

        .alert-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            vertical-align: middle;
        }

        .desktop-instructions {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            margin-top: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .desktop-instructions h3 {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            text-align: center;
        }

        .desktop-instructions p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
            text-align: center;
        }

        .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
        }

        .qr-code {
            background: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .qr-instructions {
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 500;
        }

        .iphone-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            vertical-align: middle;
        }

        .mobile-only {
            display: block;
        }

        .desktop-only {
            display: none;
        }

        @media (min-width: 769px) {
            .mobile-only {
                display: none;
            }
            
            .desktop-only {
                display: block;
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .card {
                padding: 32px 24px;
            }
            
            .brand-name {
                font-size: 28px;
            }
            
            .app-name {
                font-size: 20px;
                flex-direction: column;
                gap: 8px;
            }
            
            .download-btn {
                padding: 14px 28px;
                font-size: 15px;
            }
            
            .alert {
                top: 10px;
                right: 10px;
                left: 10px;
                transform: translateY(-100px);
            }
            
            .alert.show {
                transform: translateY(0);
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="background-shapes">
            <div class="shape"></div>
            <div class="shape"></div>
            <div class="shape"></div>
        </div>
        
        <div class="card">
            <div class="logo">
                <img src="https://www.seaflux.tech/assets/img/logo-white.svg" alt="Seaflux" />
            </div>
            
            <div class="app-info">
                <div class="app-name">
                    <span>{{appName}}</span>
                    <div class="platform-badge">
                        <svg class="platform-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        iOS
                    </div>
                </div>
                <div class="version">v{{versionNumber}}</div>
                <div class="description">{{description}}</div>
            </div>
            
            <!-- Mobile Download Button -->
            <a href="{{downloadLink}}" class="download-btn mobile-only" id="downloadBtn">
                <svg class="download-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download
            </a>

            <!-- Desktop Instructions -->
            <div class="desktop-only">
                <div class="desktop-instructions">
                    <h3>
                        <svg class="iphone-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
                        </svg>
                        Open this URL on your iPhone
                    </h3>
                    <p>To download this iOS app, please open this page on your iPhone or scan the QR code below.</p>
                    
                    <div class="qr-container">
                        <div class="qr-code" id="qrCode"></div>
                        <div class="qr-instructions">
                            Scan with your iPhone camera
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alert" id="downloadAlert">
        <svg class="alert-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Download started in background! You can start testing the app as it gets installed.
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <!-- Fallback QR code library -->
    <script src="https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.umd.min.js"></script>
    <script>
        // Generate QR code for desktop users
        function generateQRCode() {
            const qrContainer = document.getElementById('qrCode');
            if (!qrContainer) {
                console.error('QR code container not found');
                return;
            }

            const currentUrl = window.location.href;
            console.log('Generating QR code for URL:', currentUrl);

            // Clear container first
            qrContainer.innerHTML = '';

            // Method 1: Try QRCode.js library
            if (typeof QRCode !== 'undefined') {
                try {
                    const canvas = document.createElement('canvas');
                    qrContainer.appendChild(canvas);

                    QRCode.toCanvas(canvas, currentUrl, {
                        width: 200,
                        height: 200,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        },
                        margin: 2,
                        errorCorrectionLevel: 'M'
                    }, function (error) {
                        if (error) {
                            console.error('QRCode.js failed:', error);
                            tryFallbackQRCode(qrContainer, currentUrl);
                        } else {
                            console.log('QR Code generated successfully with QRCode.js');
                        }
                    });
                    return;
                } catch (error) {
                    console.error('QRCode.js error:', error);
                    tryFallbackQRCode(qrContainer, currentUrl);
                    return;
                }
            }

            // If QRCode.js is not available, try fallback
            console.log('QRCode.js not available, trying fallback');
            tryFallbackQRCode(qrContainer, currentUrl);
        }

        // Fallback QR code generation using API
        function tryFallbackQRCode(container, url) {
            console.log('Trying fallback QR code generation');
            
            // Create a simple fallback using QR Server API
            const qrImage = document.createElement('img');
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
            qrImage.alt = 'QR Code';
            qrImage.style.width = '200px';
            qrImage.style.height = '200px';
            qrImage.style.display = 'block';
            qrImage.style.margin = '0 auto';
            
            qrImage.onload = function() {
                console.log('Fallback QR code loaded successfully');
                container.innerHTML = '';
                container.appendChild(qrImage);
            };
            
            qrImage.onerror = function() {
                console.error('Fallback QR code failed to load');
                container.innerHTML = '<div style="color: #666; padding: 20px; text-align: center; font-size: 14px;">QR Code unavailable<br><small>Please copy the URL manually</small></div>';
            };
            
            container.appendChild(qrImage);
        }

        // Mobile download functionality
        function setupMobileDownload() {
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Show alert
                    const alert = document.getElementById('downloadAlert');
                    alert.classList.add('show');
                    
                    // Hide alert after 4 seconds
                    setTimeout(() => {
                        alert.classList.remove('show');
                    }, 4000);
                    
                    // Start download after a short delay
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 500);
                });
            }
        }

        // Detect if device is mobile
        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
        }

        // Initialize based on device type
        function initializePage() {
            console.log('Initializing page, is mobile:', isMobileDevice());
            
            if (isMobileDevice()) {
                setupMobileDownload();
            } else {
                // Desktop - generate QR code
                console.log('Setting up desktop view');
                generateQRCode();
            }
        }

        // Wait for DOM and QRCode library to load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, QRCode available:', typeof QRCode !== 'undefined');
            
            // Try multiple times to ensure QRCode library is loaded
            let attempts = 0;
            const maxAttempts = 10;
            
            function tryInitialize() {
                attempts++;
                if (typeof QRCode !== 'undefined') {
                    initializePage();
                } else if (attempts < maxAttempts) {
                    console.log(`QRCode library not ready, attempt ${attempts}/${maxAttempts}`);
                    setTimeout(tryInitialize, 200);
                } else {
                    console.error('QRCode library failed to load after maximum attempts');
                    initializePage(); // Still initialize for mobile users
                }
            }
            
            tryInitialize();
        });

        // Also try when window loads as backup
        window.addEventListener('load', function() {
            if (!isMobileDevice() && document.getElementById('qrCode').children.length === 0) {
                console.log('Window loaded, retrying QR code generation');
                setTimeout(generateQRCode, 500);
            }
        });
    </script>
</body>

</html>