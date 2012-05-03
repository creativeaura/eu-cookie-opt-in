describe("Cookie", function() {
  var visitor;

  beforeEach(function() {
    
  });

  it("Gauravity::Cookie::get -> check for a random cookie value", function() {
    expect(Gauravity.Cookie.get("__N__")).toBeNull();
  });

  it("Gauravity::Cookie::set -> setting cookie value to Y", function() {
    expect(Gauravity.Cookie.set({expires:10, name:'TestCookie', value: 'TestValue'})).toBeTruthy();
  });

  it("Gauravity::Cookie::get -> retrive cookie value and match", function() {
    expect(Gauravity.Cookie.get('TestCookie')).toEqual('TestValue');
  });

  describe("Cookie Preference", function(){
    
    it("Setting optin value to Y", function() {
      expect(Gauravity.Cookie.set({expires:10, name:'TEST_OPTIN', value: 'Y'})).toBeTruthy();
    });

    it("Check the cookie value previously set is not null", function() {
      expect(Gauravity.Cookie.get('TEST_OPTIN')).not.toBeNull();
    });

    it("Check the cookie value with the previous set value", function() {
      expect(Gauravity.Cookie.get('TEST_OPTIN')).toEqual('Y');
    });

    it("remove cookie value", function() {
      expect(Gauravity.Cookie.trash('TEST_OPTIN')).toBeTruthy();
    });

    it("Check the cookie value after trashing it from the previous it ", function() {
      expect(Gauravity.Cookie.get('TEST_OPTIN')).toBeNull();
    });
  });  

  describe("Cookie Preference UI", function(){
    
    var cookie_prefix =  'Gauravity_',
        cookie_name = 'OPTIN',
        expires = 20;

    beforeEach(function() {
      Gauravity.CookieManager.init({
        expires: expires,
        cookie_prefix: cookie_prefix,
        optin_cookie_name: cookie_name,
        test:true
      });
    });

    it("Setting Subscription to 1", function() {
      expect(Gauravity.Cookie.set({name: cookie_prefix + cookie_name, value: '1', expires: expires})).toBeTruthy();
    });

    it("Check subscription to be true", function() {
      expect(Gauravity.Cookie.hasSubscribed()).toBeTruthy();
    });

    it("Setting Subscription to 0", function() {
      expect(Gauravity.Cookie.set({name: cookie_prefix + cookie_name, value: '0', expires: expires})).toBeTruthy();
    });
    
    it("Check subscription to be false", function() {
      expect(Gauravity.Cookie.hasSubscribed()).toBeFalsy();
    });
  });  
});