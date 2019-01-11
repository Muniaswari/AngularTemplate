import { AdminSettingsModule } from './adminSettings.module';

describe('AdminSettingsModule', () => {
    let adminSettingsModule: AdminSettingsModule;

    beforeEach(() => {
        adminSettingsModule = new AdminSettingsModule();
    });

    it('should create an instance', () => {
        expect(adminSettingsModule).toBeTruthy();
    });
});
