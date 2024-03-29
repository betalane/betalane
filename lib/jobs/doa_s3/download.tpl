<!doctype html>
<html lang="en" class="no-js">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="Seaflux - Beta Apps">
    <style>
        html,
        body {
            height: 100%;
            color: #fff;
        }

        body {
            margin: 0;
        }

        .flex-container {
            height: 100%;
            padding: 0;
            margin: 0;
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .row {
            width: auto;
        }

        .flex-item {
            width: auto;
            height: auto;
            color: white;
            font-weight: bold;
            font-size: 2em;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .btn {
            cursor: pointer;
            display: inline-block;
            padding: 0.3em 1.2em;
            margin: 0 0.3em 0.3em 0;
            border-radius: 2em;
            box-sizing: border-box;
            text-decoration: none;
            font-family: 'Roboto', sans-serif;
            font-weight: 300;
            color: #FFFFFF;
            background-color: #4eb5f1;
            text-align: center;
            transition: all 0.2s;
            font-size: 1em;
        }

        .btn:hover {
            background-color: #4095c6;
        }

        @media all and (max-width:30em) {
            .btn {
                display: block;
                margin: 0.2em auto;
            }
        }
    </style>
</head>

<body style="background-color: #00848A">
    <div class="flex-container">
        <div class="row">
            <div class="flex-item">
                <img src="https://www.seaflux.tech/assets/img/logo-white.svg" alt="Solution Analysts" />
            </div>
            <div class="flex-item" style="max-width: 320px;overflow-wrap: anywhere;">
                <h3>{{appName}} - v{{versionNumber}}</h3>
                <div style="font-size: 12px;font-weight: normal;text-align: left;">{{description}}</div>
                <a class="btn" type="button"
                    href="{{downloadLink}}">Download</a>
            </div>
        </div>
    </div>
</body>

</html>