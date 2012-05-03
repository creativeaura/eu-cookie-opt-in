(function (exports) {
  "use strict";
  /**
   * @class Gauravity
   * ## EU Cookie Opt In-Out Library 
   * @version 0.0.1v
   * 
   * JavaScript library to manage cookie optin and optout for users visiting
   * your website as per the new EU law released on the 26th May. Once we initilize 
   * the CookieMange Class the mechanic will check if the user as opted 
   * in or out for saving cookies.
   *
   * If they have opted out we will block the loading of third party libraries.
   * If they have not saved any preference yet will will display a perference panel
   * to be able to optin or optout.
   * 
   * Sub pacakges
   *
   * - {@link Fx Effect Class}
   * - {@link Cookie Cookie Class}
   * - {@link Events Events Class}
   * - {@link CookiePreferenceUI CookiePreferenceUI Class}
   *
   * An embedded live example:
   *     @example
   * 
   *     Gauravity.CookieManager.init({
   *      expires: 20
   *     });
   *
   * If you would like to check if user has subscribed to cookie optin or not:
   *     @example
   * 
   *     var has_user_subscribed = Gauravity.Cookie.hasSubscribed();
   *
   */
  var Gauravity = {};
  /**
   * @class Fx
   * Class responsible for animation and effects
   * @extends Gauravity
   * @singleton
   */
  Gauravity.Fx = (function () {

    Gauravity.Fx = {};
    /**
     * Function to move dom element from one position to another
     * @method
    */
    Gauravity.Fx.move = function (elem, options, fn) {
      var el = document.getElementById(elem),
        p,
        timer,
        change;
    };

    return Gauravity.Fx;
  }());

  /**
   * @class Events
   * Gauravity.Event wraps the browser's native event-object normalizing cross-browser differences such as 
   * mechanisms to stop event-propagation along with a method to prevent default actions from taking
   * place.
   * @extends Gauravity
   * @singleton
   */
  Gauravity.Events = (function () {

    Gauravity.Events = {};
    /**
     * Function to add event listener to an element
     * @return {Boolean} success
     * @method
    */
    Gauravity.Events.addEvent = function (obj, type, fn) {
      if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function () { obj['e' + type + fn](window.event); };
        obj.attachEvent('on' + type, obj[type + fn]);
      } else {
        obj.addEventListener(type, fn, false);
      }
    };

   /**
   * Function to remove event listener to an element
   * @return {Boolean} success
   * @method
   */
    Gauravity.Events.removeEvent = function (obj, type, fn) {
      if (obj.detachEvent) {
        obj.detachEvent('on' + type, obj[type + fn]);
        obj[type + fn] = null;
      } else {
        obj.removeEventListener(type, fn, false);
      }
    };

    return Gauravity.Events;
  }());

  /**
   * @class CookiePreferenceUI
   * Class to create and intract with the user.
   * @extends Gauravity
   * @singleton
   */
  Gauravity.CookiePreferenceUI = (function () {
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
        panelWidth = 900;
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
        top: '0px',
        zIndex: 9999,
        backgroundColor: '#f5f5f5',
        width: panelWidth + 'px',
        height: '50px',
        border: '1px solid #c4c4c4',
        borderTop: 'none',
        padding: '10px 10px 20px 10px',
        left: (viewportwidth / 2) - (panelWidth / 2) + 'px'
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
        checked = (Gauravity.Cookie.hasSubscribed()) ? 'checked' : '',
        p = document.getElementById('huk_cookie_prefernce_panel'),
        expires = config.expires || 30,
        cookie;
      if (config.cookie_prefix && config.optin_cookie_name) {
        cookie = config.cookie_prefix + config.optin_cookie_name;
      } else {
        cookie = 'TMP_Gauravity_Cookie';
      }
      if (!p) {
        panel.id = 'huk_cookie_prefernce_panel';
        panel.innerHTML = '<h1 style="margin:0 0 5px 0">Cookie preference panel</h1>' +
          '<div class="huk_cookie_prefernce_panel_row"><input type="checkbox" ' +
          checked + ' id="Gauravity_OPIN"/><label for="Gauravity_OPIN">This site would like to place cookies ' +
          'on your computer to help make this website better. To find out more about cookies, visit ' +
          '<a href="http://en.wikipedia.org/wiki/HTTP_cookie">Wikipedia</a></label>' +
          '<input type="button" value="Save" id="Gauravity_OPIN_BUTTON"/></div>';
        positionPanel(panel);
        body.appendChild(panel);

        Gauravity.Events.addEvent(document.getElementById('Gauravity_OPIN_BUTTON'), 'click', function (event) {
          var cb = document.getElementById('Gauravity_OPIN');
          if (cb.checked) {
            Gauravity.Cookie.set({name: cookie, value: '1', expires: expires});
          } else {
            //Gauravity.Cookie.trash(cookie);
            Gauravity.Cookie.set({name: cookie, value: '0', expires: expires});
          }
        });
      }
    }

    /**
     * Function display Cookie preference panel on the screen
     * @private
     * @method
     */
    function show() {
      var p = document.getElementById('huk_cookie_prefernce_panel');
      if (p) {
        p.style.display = 'block';
      } else {
        createPanelUI();
      }
    }
    /**
     * Function hide Cookie preference panel on the screen
     * @private
     * @method
     */
    function hide() {
      var p = document.getElementById('huk_cookie_prefernce_panel');
      if (p) {
        p.style.display = 'none';
      }
    }
    return {
      setup : function (options) {
        config = options;
        if (!Gauravity.Cookie.get(options.cookie_prefix + options.optin_cookie_name)) {
          if (options && !options.test) {
            createPanelUI();
          }
        }
      },
      show : function () { show(); },
      hide : function () { hide(); }
    };
  }());
  /**
   * @class Cookie
   * Cookie optin / optout management class. The class allows user to subscribe / unsubscribe from 
   * storing cookie information. 
   * @extends Gauravity
   * @singleton
   */
  Gauravity.Cookie = (function () {
    var cookie_prefix = 'Gauravity_',
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
      //-console.log('-> Gauravity.Cookie.set()');
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
     * @param {String} options.name The name of the cookie you want to retrieve.
     * @param {String} options.path Path of the stored cookie
     * @param {String} options.domain Domain or subdomain the cookie is stored.
     * @method
     */
    function trash(options) {
      var o = {};
      if ((typeof (options) === 'string')) {
        o.name = options;
      } else {
        o = options;
      }
      if (get(o.name)) {
        document.cookie = o.name + '=' +
          ((o.path) ? ';path=' + o.path : '') +
          ((o.domain) ? ';domain=' + o.domain : '') +
          ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return true;
      } else {
        return false;
      }
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
      if (c_value !== null && c_value === '1') {
        return true;
      } else {
        return false;
      }
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
      init          : function () { init(); },
      hasSubscribed : function () { return hasSubscribed(); },
      unsubscribe   : function () { unsubscribe(); },
      subscribe     : function () { subscribe(); },
      set           : function (o) { return set(o); },
      get           : function (n) { return get(n); },
      trash         : function (o) { return trash(o); }
    };
  }());
  /**
   * @class CookieManager
   * Class manages optin / optout subscrition for the user on the site.
   * @extends Gauravity
   * @singleton
   */
  Gauravity.CookieManager = (function () {
    /**
     * Initilize the Cookie panel and turns on the cookie panel
     * @method
     */

    function init(options) {
      Gauravity.CookiePreferenceUI.setup(options);
    }
    return {
      init: function (options) {
        init(options || {});
      }
    };
  }());
  //window.Gauravity = Gauravity || {};
  exports.Gauravity = Gauravity;
}(window));
//C:\RnD\libs\cookie>jsduck-3.7.0.exe --output docs/ --ignore-global --title="Honda UK" cookie.debug.jsduck-3