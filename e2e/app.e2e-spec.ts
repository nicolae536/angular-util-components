import { AngularUtilComponentsPage } from './app.po';

describe('angular-util-components App', () => {
  let page: AngularUtilComponentsPage;

  beforeEach(() => {
    page = new AngularUtilComponentsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
