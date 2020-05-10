const EC = protractor.ExpectedConditions;

describe('Articles page', function () {
  beforeAll(() => {
    browser.waitForAngularEnabled(false);
    browser.get(`https://localhost:5001/articles`);

    const header = element(by.css('.MuiAppBar-root'));
    browser.wait(EC.presenceOf(header), 10000);
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
    const searchInput = await element(by.css('.MuiFormControl-root input'));
    searchInput.sendKeys('Lietuv');
    browser.sleep(100);
    const blogs = await element.all(by.css('.articles__list .MuiCard-root')).count();
    expect(blogs > 0).toBe(true);
  });

});