const EC = protractor.ExpectedConditions;

describe('Overview page', function () {
  beforeAll(async () => {
    browser.get(`https://localhost:5001/overview`);
    const header = element(by.css('.MuiAppBar-root'));
    browser.wait(EC.presenceOf(header), 10000);
    browser.sleep(1000)
  });

  it('should have visible map', function () {
    expect(element(by.css('.mapboxgl-canvas-container')).isPresent()).toBe(true);
  });
  
  it('should have upload photos button', function () {
    expect(element(by.css('.MuiButtonBase-root.FloatingActionButton')).isPresent()).toBe(true);
  });
  
  it('should have 2 overview journeys', async () => {
    const count = await element.all(by.css('.overview__photoTitle')).count();
    expect(count === 2).toBe(true);
  });
});