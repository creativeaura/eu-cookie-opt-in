EU - Cookie Opt in-out
================

This Cookie scripts will give you an user interface where visitors can optin or out to allow your website to user cookies. (An inspiration from BT.com). Once user opts for a level privacy you can load various async scripts.

For example if user don't opt for targeting level you will not load or include your google analytics code. You can define a strict level of cookies required for your website to work and mention it on the functionalList option while initializing the cookie manager code.

An optimized mobile version is also coming soon. If you have any better idea please drop me an email at gaurav@jassal.me

Demo URL

http://jassal.me/demos/cookie/index.html

The Cookie Law is a new piece of privacy legislation that requires websites to obtain consent from visitors to store or retrieve any information on a computer or any other web connected device, like a smartphone or tablet.

It has been designed to protect online privacy, by making consumers aware of how information about them is collected by websites, and enable them to choose whether or not they want to allow it to take place.

It started as an EU Directive that was adopted by all EU countries on May 26th 2011.  At the same time the UK updated its Privacy and Electronic Communications Regulations, which brought the EU Directive it into UK law.

Each EU member state has done or is doing the same thing. Although they all have their own approach and interpretation, the basic requirements of the directive remain the same.


### Usage ####

Simple include the cookie javascript file on your page and initilize cookie manage on page load.

```html
  <html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/cookie_style.css">
    </head>
    <body>
        <h1>Cookie Manager</h1>
        	<ul>
          <li><a href='javascript:EU.CookiePreferenceUI.toggleOptions();void(0);'>Change Settings</a></li>
        </ul>
          <script type="text/javascript" src='cookie.debug.min.js'></script>
          <script type="text/javascript">
            window.onload = init;

        		function init() {
              EU.CookieManager.init({
              expires: 20, // Define the expiry time for the cookie
              cookie_prefix: 'EU_', // prefix for the cookie
              optin_cookie_name: 'OPTIN', // cookie name
              test:false,
              idle:0, // Time in seconds of you want the initial popup to close automatically if user dont intract with it.
              link: 'cookie.html', // Linkf or the page if you want to include a page for cookie information for user
              assosiatedCookies: {
                'strict' : ['a'],
                'functional': ['b', 'c'],
                'targeting': ['d','e', 'f']
              }
            });
        		}
    	</script>
    </body>
  </html>
```

### Check subscription ####

You can use EU.Cookie.hasSubscribed(); method to check if the user has enabled cookies.

```html
    <script type="text/javascript">
        if (EU.Cookie.hasSubscribed()) {
            /**
                Google Analytics Code Here or any other tracking code.
            **/
        }
    </script>
```

### Get selected level ####

You can use getLevel method to retrieve the selected level

```html
    <script type="text/javascript">
        var selectedLevel = EU.Cookie.getLevel();
        if ( selectedLevel === '2') {
          // eg. Include your Chat scripts
        }
    </script>
```

### Set user level ####

You can use getLevel method to retrieve the selected level

```html
    <script type="text/javascript">
        EU.Cookie.setLevel(2);
    </script>
```


### Trash Cookie ####

You can use this function delete a cookie

```html
    <script type="text/javascript">
        EU.Cookie.trach('cookie_name');
        EU.Cookie.trach(['cookie1', 'cookie2']);
    </script>
```