const EC = protractor.ExpectedConditions;

describe('Overview page', function () {
  beforeAll(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`https://localhost:5001`);

    const header = element(by.css('.MuiAppBar-root'));
    browser.wait(EC.presenceOf(header), 10000);
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('MyJourneys');
  });

  it('should have 3 links in sidebar', async function () {
    const links = await element.all(by.css('.MuiDrawer-root .MuiList-root .MuiButtonBase-root')).count();
    expect(links).toEqual(3 * 2);
  });

  it('should have visible map', function () {
    expect(element(by.css('.mapboxgl-canvas-container')).isPresent()).toBe(true);
  });

  it('should have working register modal', async function () {
    const registerBtn = element.all(by.cssContainingText('span.MuiButton-label', 'Register')).first();
    await registerBtn.click();

    const inputs = await element.all(by.css('.MuiFormControl-root')).count();
    expect(inputs).toEqual(4);
    browser.actions().mouseMove(registerBtn, -100, -100).click().perform();
  });

  it('should have working login modal', async function () {
    const loginBtn = element(by.cssContainingText('span.MuiButton-label', 'Login'));
    await loginBtn.click();

    const inputs = await element.all(by.css('.MuiFormControl-root')).count();
    expect(inputs).toEqual(2);
  });
  
  it('should have upload photos button', function() {
    expect(element(by.css('.MuiButtonBase-root.FloatingActionButton')).isPresent()).toBe(true);
  });
});