const EC = protractor.ExpectedConditions;

describe('Articles page', function () {
  beforeAll(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`https://localhost:5001/articles`);

    const header = element(by.css('.MuiAppBar-root'));
    browser.wait(EC.presenceOf(header), 10000);
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('MyJourneys');
  });
  
  it('should have valid h1', () => {
    expect(element(by.css('h1')).getText()).toEqual('Articles');
  });

  it('should have 6 blog posts', async () => {
    const blogs = await element.all(by.css('.articles__list .MuiCard-root')).count();
    expect(blogs).toEqual(6);
  });

  it('should have working load more button', async () => {
    const blogs = await element.all(by.css('.articles__list .MuiCard-root')).count();
    expect(blogs).toEqual(6);

    const loadMoreBtn = element(by.css('.MuiButton-fullWidth'));
    expect(loadMoreBtn.isPresent()).toBe(true);

    await loadMoreBtn.click();
    browser.sleep(100);
    expect(await element.all(by.css('.articles__list .MuiCard-root')).count()).toEqual(12);
  });

  it('should have 4 sorting pills', async () => {
    expect(await element.all(by.css('.articles__list .articles__filter')).count()).toEqual(4);
  });

  it('should have popular tags', async () => {
    const tags = await element.all(by.css('.articles__popularTags .MuiChip-root')).count();
    expect(tags > 0).toBe(true);
  });

  it('should have working search', async () => {
    const searchInput = await element(by.css('.articles__searchForm input'));
    searchInput.sendKeys('Lietuv');
    browser.sleep(100);
    const blogs = await element.all(by.css('.articles__list .MuiCard-root')).count();
    expect(blogs > 0).toBe(true);
  });

  it('should have 3 links in sidebar', async function () {
    const links = await element.all(by.css('.MuiDrawer-root .MuiList-root .MuiButtonBase-root')).count();
    expect(links).toEqual(3 * 2);
  });

  it('should have working register modal', async function () {
    const registerBtn = element.all(by.cssContainingText('span.MuiButton-label', 'Register')).first();
    await registerBtn.click();

    const inputs = await element.all(by.css('.MuiFormControl-root')).count();
    expect(inputs).toEqual(5);
    browser.actions().mouseMove(registerBtn, -100, -100).click().perform();
  });

  it('should have working login modal', async function () {
    const loginBtn = element.all(by.cssContainingText('span.MuiButton-label', 'Login')).first();
    await loginBtn.click();

    const inputs = await element.all(by.css('.login__modal .MuiFormControl-root')).count();
    expect(inputs).toEqual(2);
    browser.actions().mouseMove(loginBtn, -100, -100).click().perform();
  });

});