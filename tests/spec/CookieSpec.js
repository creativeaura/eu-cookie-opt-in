describe("Cookie", function() {
  var visitor;

  beforeEach(function() {
    
  });

  it("EU::Cookie::get -> check for a random cookie value", function() {
    expect(EU.Cookie.get("__N__")).toBeNull();
  });

  it("EU::Cookie::set -> setting cookie value to Y", function() {
    expect(EU.Cookie.set({expires:10, name:'TestCookie', value: 'TestValue'})).toBeTruthy();
  });

  it("EU::Cookie::get -> retrive cookie value and match", function() {
    expect(EU.Cookie.get('TestCookie')).toEqual('TestValue');
  });

  describe("Cookie Preference", function(){
    
    it("Setting optin value to Y", function() {
      expect(EU.Cookie.set({expires:10, name:'TEST_OPTIN', value: 'Y'})).toBeTruthy();
    });

    it("Check the cookie value previously set is not null", function() {
      expect(EU.Cookie.get('TEST_OPTIN')).not.toBeNull();
    });

    it("Check the cookie value with the previous set value", function() {
      expect(EU.Cookie.get('TEST_OPTIN')).toEqual('Y');
    });

    it("remove cookie value", function() {
      expect(EU.Cookie.trash('TEST_OPTIN')).toBeTruthy();
    });

    it("Check the cookie value after trashing it from the previous it ", function() {
      expect(EU.Cookie.get('TEST_OPTIN')).toBeNull();
    });
  });  

  describe("Cookie Preference UI", function(){
    
    var cookie_prefix =  'EU_',
        cookie_name = 'OPTIN',
        expires = 20;

    beforeEach(function() {
      EU.CookieManager.init({
        expires: expires,
        cookie_prefix: cookie_prefix,
        optin_cookie_name: cookie_name,
        test:true
      });
    });

    it("Setting Subscription to 1", function() {
      expect(EU.Cookie.set({name: cookie_prefix + cookie_name, value: '1', expires: expires})).toBeTruthy();
    });

    it("Check subscription to be true", function() {
      expect(EU.Cookie.hasSubscribed()).toBeTruthy();
    });

    it("Setting Subscription to 0", function() {
      expect(EU.Cookie.set({name: cookie_prefix + cookie_name, value: '0', expires: expires})).toBeTruthy();
    });
    
    it("Check subscription to be false", function() {
      expect(EU.Cookie.hasSubscribed()).toBeFalsy();
    });
  });  
});