const EC = protractor.ExpectedConditions;

describe('Planner page', () => {
  beforeAll(async () => {
    browser.waitForAngularEnabled(false);
    browser.get(`https://localhost:5001/`);

    const header = element(by.css('.MuiAppBar-root'));
    browser.wait(EC.presenceOf(header), 10000);

    // tester tester123
    const loginBtn = element(by.cssContainingText('span.MuiButton-label', 'Login'));
    await loginBtn.click();

    const username = await element.all(by.css('.login__modal .MuiFormControl-root input')).first();
    username.sendKeys('tester');

    const password = await element.all(by.css('.login__modal .MuiFormControl-root input')).last();
    password.sendKeys('tester123');

    browser.sleep(100);
    const btn = await element(by.css('.login__modal button'));
    await btn.click();
    browser.sleep(100);
    browser.waitForAngular();

    browser.get(`https://localhost:5001/journeys`);
    plannerHeader = element(by.css('.MuiAppBar-root'));
    browser.wait(EC.presenceOf(plannerHeader), 10000);
  });

  it('should have valid h1', () => {
    expect(element(by.css('h1')).getText()).toEqual('Journey planner');
  });

  it('should have add journey button', () => {
    expect(element(by.css('.MuiFab-root.FloatingActionButton')).isPresent()).toBe(true);
  });
  
  it('should have 3 journeys', async () => {
    const journeys = await element.all(by.css('.MuiPaper-root.MuiCard-root')).count();
    expect(journeys === 3).toBe(true);
  });
  
  it('should be able to click journey', async () => {
    const journey = await element.all(by.css('.MuiPaper-root.MuiCard-root')).first();
    await journey.click();
    expect(browser.getCurrentUrl()).toEqual('https://localhost:5001/journeys/Antarctica.1029');
  });
  
  it('should have 5 journey items', async () => {
    const items = await element.all(by.css('.journey__item')).count();
    expect(items === 5).toBe(true);
  });
  
  it('should have 5 places', async () => {
    const placesTab = element.all(by.css('.MuiTabs-flexContainer button')).get(1);
    await placesTab.click();
    const places = await element.all(by.css('.journey__place')).count();
    expect(places === 5).toBe(true);
  });

  it('should have 3 notes', async () => {
    const notesTab = element.all(by.css('.MuiTabs-flexContainer button')).get(2);
    await notesTab.click();
    const notes = await element.all(by.css('.journey__note')).count();
    expect(notes === 3).toBe(true);
  });

});