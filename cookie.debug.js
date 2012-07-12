(function (exports, $) {
  "use strict";
  /**
   * @class EU
   * @version 0.0.1v
   *
   * JavaScript library to manage cookie optin and optout for users visiting
   * your website. Once we initilize the CookieMange Class
   * the mechanic will check if the user as opted in or out for saving cookies.
   *
   * If they have opted out we will block the loading of third party libraries.
   * If they have not saved any preference yet will will display a perference panel
   * to be able to optin or optout.
   *
   * Sub pacakges
   *
   * - {@link Cookie Cookie Class}
   * - {@link Events Events Class}
   * - {@link CookiePreferenceUI CookiePreferenceUI Class}
   *
   * An embedded live example:
   *     @example
   *
   *     EU.CookieManager.init({
   *      expires: 20
   *     });
   *
   * If you would like to check if user has subscribed to cookie optin or not:
   *     @example
   *
   *     var has_user_subscribed = EU.Cookie.hasSubscribed();
   *
   */
  var EU = {}, AppConfig, idleTimer, hide, show, toggle, idleCallback,
    createOptionPanel, listFeatures, toggleOptions, removeCookies;

  AppConfig = {
    idle: 0,
    level: 0,
    message: 'The cookie settings on this website are set to <strong>\'allow all cookies\'</strong> to give you the very best experience.' +
      ' If you continue without changing these settings you consent to this - but you can change your settings' +
      ' by clicking the <strong>Change settings</strong> link at any time.',
	cancel: 'I agree',
	changeSettings: 'Change settings',
	linkText: 'Find out more about cookies',
    functionalList: {
        'strict': {
          'will' : ['Remember what is in your shopping basket', 'Remember cookie access level.'],
          'willnot': ['Send information to other websites so that advertising is more relevant to you', 'Remember your log-in details', 'Improve overall performance of the website', 'Provide you with live, online chat support']
        },
        'functional': {
          'will' : ['Remember what is in your shopping basket', 'Remember cookie access level.','Remember your log-in details','Make sure the website looks consistent','Offer live chat support'],
          'willnot': ['Allow you to share pages with social networks like Facebook', 'Allow you to comment on blogs', 'Send information to other websites so that advertising is more relevant to you']
        },
        'targeting': {
          'will' : ['Remember what is in your shopping basket', 'Remember cookie access level.','Remember your log-in details','Make sure the website looks consistent','Offer live chat support','Send information to other websites so that advertising is more relevant to you'],
          'willnot': []
        }
      }
  };
  
  /**
   * @class Utility
   * Class contains all utility functions
   * @extends EU
   * @singleton
   */
  EU.Utility = (function () {

    EU.Utility = {};
    /**
     * Function to extend from another object.
     * This function will copy across all imediate properies
     * of the source object to the destination object. 
     *
     * @public
     * @method
    */
    EU.Utility.extend = function (obj, source) {
      var prop;
      if (typeof obj === 'object') {
        for (prop in source) {
          if (source.hasOwnProperty(prop)) {
            obj[prop] = source[prop];
          }
        }
      }
      return obj;
    };

    return EU.Utility;
  }());

  /**
   * @class Events
   * EU.Event wraps the browser's native event-object normalizing cross-browser differences such as 
   * mechanisms to stop event-propagation along with a method to prevent default actions from taking
   * place.
   *
   * @extends EU
   * @singleton
   */
  EU.Events = (function () {

    EU.Events = {};
    /**
     * Function to add event listener to an element
     * @return {Boolean} success
     * @method
    */
    EU.Events.addEvent = function (obj, type, fn) {
      if (obj !== null) {
        if (obj.attachEvent) {
          obj['e' + type + fn] = fn;
          obj[type + fn] = function () { obj['e' + type + fn](window.event); };
          obj.attachEvent('on' + type, obj[type + fn]);
        } else {
          obj.addEventListener(type, fn, false);
        }
      }
    };

   /**
   * Function to remove event listener to an element
   * @return {Boolean} success
   * @method
   */
    EU.Events.removeEvent = function (obj, type, fn) {
      if (obj.detachEvent) {
        obj.detachEvent('on' + type, obj[type + fn]);
        obj[type + fn] = null;
      } else {
        obj.removeEventListener(type, fn, false);
      }
    };

    return EU.Events;
  }());

  /**
   * @class CookiePreferenceUI
   * This class will create UI to manage cookie opt in - out.
   *
   * @extends EU
   * @singleton
   */
  EU.CookiePreferenceUI = (function () {
    var config;
    /**
     * Function to create styles on a HTML dom element
     * @return {Boolean} success
     * @private
     * @method
     */
    function setStyles(el, o) {
      var key;
      for (key in o) {
        if (o.hasOwnProperty(key)) {
          el.style[key] = o[key];
        }
      }
    }
    /**
     * Function will setup panel properties
     * @return {Boolean} success
     * @private
     * @method
     */
    function positionPanel(el) {
      var viewportwidth,
        viewportheight,
        panelWidth = 300;
      if (typeof window.innerWidth !== 'undefined') {
        viewportwidth = window.innerWidth;
        viewportheight = window.innerHeight;
      } else if (typeof document.documentElement !== 'undefined'
          && typeof document.documentElement.clientWidth !== 'undefined'
          && document.documentElement.clientWidth !== 0) {
        viewportwidth = document.documentElement.clientWidth;
        viewportheight = document.documentElement.clientHeight;
      } else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
        viewportheight = document.getElementsByTagName('body')[0].clientHeight;
      }
      setStyles(el, {
        position  : 'fixed',
        zIndex: 9999,
        backgroundColor: '#f5f5f5',
        width: panelWidth + 'px',
        height: '200px',
        padding: '20px 15px',
        textAlign: 'center',
        //left: (viewportwidth / 2) - (panelWidth / 2) + 'px',
        right: '20px',
        bottom: '20px'
      });
    }

    /**
     * Function will setup panel properties
     * @return {Boolean} success
     * @private
     * @method
     */
    function positionExtendedPanel(el) {
      var viewportwidth,
        viewportheight,
        panelWidth = 600;
      if (typeof window.innerWidth !== 'undefined') {
        viewportwidth = window.innerWidth;
        viewportheight = window.innerHeight;
      } else if (typeof document.documentElement !== 'undefined'
          && typeof document.documentElement.clientWidth !== 'undefined'
          && document.documentElement.clientWidth !== 0) {
        viewportwidth = document.documentElement.clientWidth;
        viewportheight = document.documentElement.clientHeight;
      } else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
        viewportheight = document.getElementsByTagName('body')[0].clientHeight;
      }
      setStyles(el, {
        position  : 'fixed',
        zIndex: 9999,
        left: (viewportwidth / 2) - (panelWidth / 2) + 'px',
        //right: '20px',
        top: '100px'
      });

      setStyles(document.getElementById('ck-overlay'), {
        position  : 'fixed',
        zIndex: 9998,
        width: viewportwidth + 'px',
        height: viewportheight + 'px'
      });
    }
    /**
     * Function to create the preference panel for optin / optout
     * @return {Boolean} panel
     * @private
     * @method
     */
    function createPanelUI() {
      var body = document.getElementsByTagName("body")[0],
        panel = document.createElement("div"),
        checked = (EU.Cookie.hasSubscribed()) ? 'checked' : '',
        p = document.getElementById('huk_cookie_prefernce_panel'),
        expires = config.expires || 30,
        cookie;
      if (config.cookie_prefix && config.optin_cookie_name) {
        AppConfig.cookie = config.cookie_prefix + config.optin_cookie_name;
      } else {
        AppConfig.cookie = 'TMP_EU_Cookie';
      }
      if (!p) {
        panel.id = 'huk_cookie_prefernce_panel';
        AppConfig.message += '<div class="huk_cookie_prefernce_toolbar">' +          
          '<input type="button" value="' + AppConfig.cancel + '" id="EU_OPIN_CANCEL"/>' +
		  '<input type="button" value="' + AppConfig.changeSettings + '" id="EU_OPIN_SETTINGS"/>' +
          '</div>' +
          '<div class="huk_cookie_prefernce_link">' +
          '<a href="' + AppConfig.link + '" target="_blank">' + AppConfig.linkText + '</a>' +
          '</div>';
        panel.innerHTML = AppConfig.message;

        positionPanel(panel);
        body.appendChild(panel);

        $('#EU_OPIN_SETTINGS').bind('click', function(event) {
          toggleOptions();
          hide();
        });
        
        $('#EU_OPIN_CANCEL').bind('click', function(event) {
          EU.Cookie.set({name: AppConfig.cookie, value: '4', expires: expires});
          hide();
        });

        $('#huk_cookie_prefernce_panel').bind('mouseenter', function(event) {
          clearTimeout(idleTimer);
        });
      }

      if (AppConfig.idle !== 0) {
        idleTimer = setTimeout(function () {
          idleCallback();
          hide();
        }, (AppConfig.idle * 1000));
      }
    }

    function createExtenedPanel() {
      var body = document.getElementsByTagName("body")[0],
        panel = document.createElement('div'),
        overlay = document.createElement('div'),
        expires = AppConfig.expires || 30,
        p = document.getElementById('huk_cookie_prefernce_panel_ex');

      if (config.cookie_prefix && config.optin_cookie_name) {
        AppConfig.cookie = config.cookie_prefix + config.optin_cookie_name;
      } else {
        AppConfig.cookie = 'TMP_EU_Cookie';
      }

      if (!p) {
        overlay.id = 'ck-overlay';
        overlay.innerHTML = "&nbsp;";
        panel.id = 'huk_cookie_prefernce_panel_ex';
        panel.innerHTML = '<div id="cookie-ext-panel">' + 
          '<div id="cookie-info">' +
            '<h1>Cookie Settings</h1>' +
            '<p>A cookie, also known as an HTTP cookie, web cookie, or browser cookie, is a piece of data stored by a website within a browser, and then subsequently sent back to the same website by the browser.[1] Cookies were designed to be a reliable mechanism for websites to remember things that a browser had done there in the past, which can include having clicked particular buttons, logging in, or having read pages on that site months or years ago.</p>' + 
            '<div id="cookie-selection">' +
              '<h2>Select the level of cookie you want to allow.</h2>' +
              '<div id="cokkie-options">' +
                  '<label for="strict"><span>Strictly necessary &amp; Performance</span>' +
                    '<input type="checkbox" id="strict" name="cookie-opt" value="1"/>' +
                  '</label>' +
                  '<label for="functional"><span>Functional</span>' +
                    '<input type="checkbox" id="functional" name="cookie-opt" value="2"/>' +
                  '</label>' +
                  '<label for="targeting"><span>Targeting</span>' +
                    '<input type="checkbox" id="targeting" name="cookie-opt" value="3"/>' +
                  '</label>' +
              '</div>' +
              '<div class="clearfix">&nbsp;</div>' +
            '</div>' +
            '<div class="clearfix">&nbsp;</div>' +
            '<div id="cookie-functionalList">' +
              '<div id="cookieWill">' +
              '</div>' +
              '<div id="cookieWillNot">' +
              '</div>' +
            '</div>' +
            '<div class="clearfix">&nbsp;</div>' +
            '<div id="c-toolbar">' + 
              '<input type="button" id="COOKIE_CANCEL" value="Cancel"/>' + 
              '<input type="button" id="COOKIE_SAVE" value="Save &amp; Close"/>' +
            '</div>' +
            '<div class="clearfix">&nbsp;</div>' +
          '</div>' +
        '</div>';
        body.appendChild(overlay);
        body.appendChild(panel);
        positionExtendedPanel(panel);

        if (EU.Cookie.get(AppConfig.cookie) === null || EU.Cookie.get(AppConfig.cookie) === '1') {
          listFeatures('strict');
          document.getElementById('strict').checked = true;
          document.getElementById('functional').checked = false;
          document.getElementById('targeting').checked = false;
        } else if (EU.Cookie.get(AppConfig.cookie) === '2') {
          listFeatures('functional');
          document.getElementById('functional').checked = true;
          document.getElementById('strict').checked = true;
          document.getElementById('targeting').checked = false;
        } else if (EU.Cookie.get(AppConfig.cookie) === '3') {
          listFeatures('targeting');
          document.getElementById('targeting').checked = true;
          document.getElementById('functional').checked = false;
          document.getElementById('strict').checked = false;
        }
      }

      $('#strict, #functional, #targeting').bind('click', function(event) {
        listFeatures(event.currentTarget.id);
        if(event.currentTarget.id === 'strict') {
          if ($('#strict').attr('checked')  !== 'checked') {
            $('#strict').attr('checked', 'checked');
          }
        } else if(event.currentTarget.id === 'functional') {
          if ($('#functional').attr('checked')  !== 'checked') {
            $('#strict').attr('checked', 'checked');
            $('#functional').attr('checked', false);
            $('#targeting').attr('checked', false);
          }
        } else if(event.currentTarget.id === 'targeting') {
          if ($('#targeting').attr('checked')  === 'checked') {
            $('#strict').attr('checked', 'checked');
            $('#functional').attr('checked', 'checked');
            $('#targeting').attr('checked', 'checked');
          }
        }
        hide();
      });

      EU.Events.addEvent(document.getElementById('COOKIE_SAVE'), 'click', function (event) {
        if (document.getElementById('targeting').checked) {
          EU.Cookie.set({name: AppConfig.cookie, value: '3', expires: expires});
        } else if(document.getElementById('functional').checked) {
          EU.Cookie.set({name: AppConfig.cookie, value: '2', expires: expires});
        } else if(document.getElementById('strict').checked) {
          EU.Cookie.set({name: AppConfig.cookie, value: '1', expires: expires});
        }
        hide();
        toggleOptions();
      });
	  
	  EU.Events.addEvent(document.getElementById('COOKIE_CANCEL'), 'click', function (event) {        
        hide();
        toggleOptions();
      });
    }

    removeCookies = function(currentOption) {
      if (currentOption === 'strict') {
        EU.Cookie.trash(AppConfig.assosiatedCookies.functional);
        EU.Cookie.trash(AppConfig.assosiatedCookies.targeting);
      } else if(currentOption === 'functional') {
        EU.Cookie.trash(AppConfig.assosiatedCookies.targeting);
      }
    };
    listFeatures = function(n) {
      var i, j, will, willnot, willWraper = '<h3>This website will:</h3><ul>', willNotWraper = '<h3>This website will not:</h3><ul>';
      will = AppConfig.functionalList[n].will;
      willnot = AppConfig.functionalList[n].willnot;

      for (i = 0; i < will.length; i += 1) {
        willWraper += '<li>' + will[i] + '</li>';
      }
      willWraper += '</ul>';

      for (i = 0; i < willnot.length; i += 1) {
        willNotWraper += '<li>' + willnot[i] + '</li>';
      }
      willNotWraper += '</ul>';

      document.getElementById('cookieWill').innerHTML = willWraper;
      document.getElementById('cookieWillNot').innerHTML = willNotWraper;
    };
   
    idleCallback = function () {
      var expires = AppConfig.expires || 30;
      if (!EU.Cookie.hasSubscribed()) {
        EU.Cookie.set({name: AppConfig.cookie, value: '0', expires: expires});
      }
    };

    /**
     * Function display Cookie preference panel on the screen
     * @public
     * @method
     */
    show = function () {
      var p = document.getElementById('huk_cookie_prefernce_panel');
      if (p) {
        p.style.display = 'block';
      } else {
        createPanelUI();
      }
    };
    /**
     * Function hide Cookie preference panel on the screen
     * @public
     * @method
     */
    hide = function () {
      var p = document.getElementById('huk_cookie_prefernce_panel');
      if (p) {
        p.style.display = 'none';
      }
    };

    /**
     * Function toggle Cookie preference panel on the screen
     * @public
     * @method
     */
    toggle = function () {
      var p = document.getElementById('huk_cookie_prefernce_panel');
      if (p) {
        p.style.display = (p.style.display === '' || p.style.display === 'block') ? 'none' : 'block';
      } else {
        createPanelUI();
      }
    };

    toggleOptions = function () {
      var p = document.getElementById('huk_cookie_prefernce_panel_ex'),
        overlay = document.getElementById('ck-overlay');
      if (p) {
        p.style.display = (p.style.display === '' || p.style.display === 'block') ? 'none' : 'block';
        overlay.style.display = (overlay.style.display === '' || overlay.style.display === 'block') ? 'none' : 'block';
      } else {
        createExtenedPanel();
      }
    };

    return {
      setup : function (options) {
        config = options;
        if (!EU.Cookie.get(options.cookie_prefix + options.optin_cookie_name)) {
          if (options && !options.test) {
            createPanelUI();
          }
        }
      },
      show : function () { show(); },
      hide : function () { hide(); },
      toggle : function () { toggle(); },
      toggleOptions : function () { toggleOptions(); }
    };
  }());
  /**
   * @class Cookie
   * Cookie optin / optout management class. The class allows user to subscribe / unsubscribe from 
   * storing cookie information. 
   * @extends EU
   * @singleton
   */
  EU.Cookie = (function () {
    var cookie_prefix = 'EU_',
      optin_cookie_name = 'OPTIN';

    /**
     * Function will return the value of the cookie if exists
     * @param {String} name The name of the cookie you want to retrieve.
     * @return {String} value
     * @method
     */
    function get(name) {
      var start = document.cookie.indexOf(name + "="),
        len = start + name.length + 1,
        end;
      if ((!start) && (name !== document.cookie.substring(0, name.length))) {
        return null;
      }
      if (start === -1) {
        return null;
      }
      end = document.cookie.indexOf(';', len);
      if (end === -1) {
        end = document.cookie.length;
      }
      return unescape(document.cookie.substring(len, end));
    }

    /**
     *
     * Function to set a browser cookie
     * @param {String} options.name The name of the cookie you want to store.
     * @param {String} options.value The value of the cookie you want to store.
     * @param {Number} options.expires The expiry date for the cookie in days.
     * @param {String} options.path Path where you want to store cookie information
     * @param {String} options.domain Domain or subdomain where the cookie is going to be stored.
     * @param {Boolean} options.secure If you want to store cookie as a secured cookie.
     * @return {Boolean} success
     * @method
     */
    function set(options) {
      //-console.log('-> EU.Cookie.set()');
      var today = new Date(),
        expires_date,
        escaped_value,
        cookie_string;
      today.setTime(today.getTime());
      if (options.expires) {
        options.expires = options.expires * 1000 * 60 * 60 * 24;
      }
      expires_date = new Date(today.getTime() + (options.expires));
      cookie_string = options.name + '=' + escape(options.value) +
        ((options.expires) ? ';expires=' + expires_date.toGMTString() : '') +
        ((options.path) ? ';path=' + options.path : '') +
        ((options.domain) ? ';domain=' + options.domain : '') +
        ((options.secure) ? ';secure' : '');
      document.cookie = cookie_string;
      return (get(options.name) === options.value);
    }
    /**
     * Function to delete the cookie
     * @param {String / Array} cookies list that need to be removed.
     * @method
     */
    function trash(cookies) {
      if (typeof(cookies) === 'string') {
        document.cookie = cookies + '=' +
          ((AppConfig.path) ? ';path=' + AppConfig.path : '') +
          ((AppConfig.domain) ? ';domain=' + AppConfig.domain : '') +
          ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return true;
      } else if(typeof(cookies) === 'array') {
        var tc = cookies.length, i;
        for (i = 0; i < tc; i+=1) {
          document.cookie = cookies[i] + '=' +
            ((AppConfig.path) ? ';path=' + AppConfig.path : '') +
            ((AppConfig.domain) ? ';domain=' + AppConfig.domain : '') +
            ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
        }
        return true;
      }
      return false;
    }
    /**
     * Function will allow user cookies to be stored for tracking purpose and third party scripts.
     * @return {Boolean} subscribed
     * @method
     */
    function subscribe() {
      //-console.log('-> subscribe');
      return true;
    }
    /**
     * Function optout user from storeing cookie information.
     * @return {Boolean} unsubscribe
     * @method
     */
    function unsubscribe() {
      //-console.log('-> unsubscribe');
      return true;
    }
    /**
     * Function will check if the user has already subscribed to optin cookies
     * @return {Boolean} unsubscribe
     * @method
     */
    function hasSubscribed() {
      var c_value = get(cookie_prefix + optin_cookie_name);
      if (c_value !== null && c_value !== '0') {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Function will return the level subscription user has opted in / out
     * @return {Number} 0,1,2,3,4
     * @method
     */
    function subscriptionLevel() {
      var c_value = get(cookie_prefix + optin_cookie_name);
      if (c_value !== null && c_value !== '0') {
        return c_value;
      } else {
        return false;
      }
    }

    /**
     * Function exposes the ability to set user prefence in cookies
     * @return {Boolean}  prefernce if information was saved successfully
     * @params {Number}
     * @method
     */
    function setLevel(n) {
      var c_value = get(cookie_prefix + optin_cookie_name),
        cookie = AppConfig.cookie_prefix + AppConfig.optin_cookie_name,
        expires = AppConfig.expires || 30;
      if (n) {
        return EU.Cookie.set({name: cookie, value: n, expires: expires});
      } else {
        return false;
      }
    }

    /**
     * Function will return the selected level of option userhas selected.
     * @return {Number}  
     * @method
     */
    function getLevel() {
      var c_value = get(cookie_prefix + optin_cookie_name),
        cookie = AppConfig.cookie_prefix + AppConfig.optin_cookie_name,
        expires = AppConfig.expires || 30;
      return c_value;
    }

    /**
     * Function initilizes and check optins
     * @alternateClassName MyDuck
     * @deprecated
     * @method
     */
    function init() {
      //
    }


    return {
      init              : function () { init(); },
      hasSubscribed     : function () { return hasSubscribed(); },
      subscriptionLevel : function () { return subscriptionLevel(); },
      setLevel          : function (n) { return setLevel(n); },
      getLevel          : function () { return getLevel(); },
      unsubscribe       : function () { unsubscribe(); },
      subscribe         : function () { subscribe(); },
      set               : function (o) { return set(o); },
      get               : function (n) { return get(n); },
      trash             : function (o) { return trash(o); }
    };
  }());
  /**
   * @class CookieManager
   * Class manages optin / optout subscrition for the user on the site.
   * @extends EU
   * @singleton
   */
  EU.CookieManager = (function () {
    /**
     * Initilize the Cookie panel and turns on the cookie panel
     * @method
     */

    function init(options) {
      AppConfig = EU.Utility.extend(AppConfig, options);
      //console.log(AppConfig);
      EU.CookiePreferenceUI.setup(options);
    }
    return {
      init: function (options) {
        init(options || {});
      }
    };
  }());
  //window.EU = EU || {};
  exports.EU = EU;
}(window, jQuery));