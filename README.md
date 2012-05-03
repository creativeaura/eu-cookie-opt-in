EU - Cookie Opt in-out
================
This is cookie opt in-out library as per  the new EU law released on the 26th May.


### Usage ####

Simple include the cookie javascript file on your page and initilize cookie manage on page load.

```html
  <html>
    <head>
    </head>
    <body>
        <h1>Cookie Manager</h1>
        	<ul>
          <li><a href='javascript:HUK.CookiePreferenceUI.show();void(0);'>Show panel</a></li>
          <li><a href='javascript:HUK.CookiePreferenceUI.hide();void(0);'>Hide panel</a></li>
        </ul>
          <script type="text/javascript" src='eu-cookie.debug.min.js'></script>
          <script type="text/javascript">
            window.onload = init;
    
    		function init() {
              Gauravity.CookieManager.init({
              	expires: 20,
              	cookie_prefix: 'Gauravity_',
              	optin_cookie_name: 'OPTIN',
              	test:false
              });
    		}
    	</script>
    </body>
  </html>
```

### Check subscription ####

You can use Gauravity.Cookie.hasSubscribed(); method to check if the user has enabled cookies.

```html
    <script type="text/javascript">
        if (Gauravity.Cookie.hasSubscribed()) {
            /**
                Google Analytics Code Here or any other tracking code.
            **/    
        }
    </script>
```