/* Tests for the users account */

describe('Login', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    it('should login successfully and then unlogin successfully', async () => {
        await device.reloadReactNative();
        await expect(element(by.text('Bienvenue !'))).toBeVisible();
        
        await element(by.id('login')).typeText('leask99@hotmail.fr');
        await element(by.id('password')).typeText('123456');
        await element(by.id('password')).tapReturnKey();
        await element(by.id('connect')).tap();
        
        await waitFor(element(by.text('Mon carnet de voyage'))).toBeVisible().withTimeout(2000);
        await expect(element(by.id('login'))).toNotExist();
        await expect(element(by.text('Voyages à venir'))).toBeVisible();

        await element(by.id('account')).tap();
        await expect(element(by.text('leask99@hotmail.fr'))).toBeVisible();
        await element(by.id('disconnect')).tap();

        await waitFor(element(by.text('Bienvenue !'))).toBeVisible().withTimeout(2000);
        await expect(element(by.id('login'))).toExist();
    });
});