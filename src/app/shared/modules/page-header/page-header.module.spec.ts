import { PageHeaderModule } from '../validation-summary/validation-summary.module';

describe('PageHeaderModule', () => {
  let pageHeaderModule: PageHeaderModule;

  beforeEach(() => {
    pageHeaderModule = new PageHeaderModule();
  });

  it('should create an instance', () => {
    expect(pageHeaderModule).toBeTruthy();
  });
});
