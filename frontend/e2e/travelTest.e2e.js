/* Tests for a travel owned by the user */

describe('Travel', () => {
    beforeAll(async () => {
        await device.launchApp();
        await device.reloadReactNative();
        
        // Log in
        await element(by.id('login')).typeText('leask99@hotmail.fr');
        await element(by.id('password')).typeText('123456');
        await element(by.id('password')).tapReturnKey();
        await element(by.id('connect')).tap();
        await waitFor(element(by.text('Mon carnet de voyage'))).toBeVisible().withTimeout(2000);
    });

    it('should see the three travels', async () => {
        //await device.reloadReactNative();
        await expect(element(by.text('Travel in Bresil'))).toBeVisible();
        await expect(element(by.text('Rio de Janeiro'))).toBeVisible();
        await expect(element(by.text('Travel in Mada'))).toBeVisible();
        await expect(element(by.text('Faraf'))).toBeVisible();
        await expect(element(by.text('Relax at home'))).toBeVisible();
        await expect(element(by.text('Limoges'))).toBeVisible();
    });

    it('should create a travel after test for all the possible errors in the form', async () => {
        await element(by.id('create')).tap();

        await element(by.id('title')).typeText('travelll');
        // Error for the place
        await expect(element(by.text('La localisation est requise.'))).toBeVisible();

        await element(by.id('place')).typeText('placeee');
        await element(by.id('place')).tapReturnKey();

        // Error for the title
        await element(by.id('title')).clearText();
        await expect(element(by.text('Le titre du voyage est requis.'))).toBeVisible();

        await element(by.id('title')).typeText('travelll');
        await element(by.id('title')).tapReturnKey();

        // Error for the date
        await element(by.id('start')).tap();
        const picker = element(
            by.type('android.widget.ScrollView').withAncestor(by.type('android.widget.DatePicker')),
          )
        await picker.swipe('left', 'fast', 1)
        await picker.tapAtPoint({ x: 50, y: 200 })
        await element(by.text('OK')).tap()
        await element(by.text('OK')).tap()
        await expect(element(by.text('La date de début du voyage doit être avant la date de fin.'))).toBeVisible();

        await element(by.id('end')).tap();
        const picker3 = element(
            by.type('android.widget.ScrollView').withAncestor(by.type('android.widget.DatePicker')),
          )
        await picker3.swipe('left', 'fast', 1)
        await picker3.swipe('left', 'fast', 1)
        await picker3.tapAtPoint({ x: 50, y: 200 })
        await element(by.text('OK')).tap()
        await waitFor(element(by.text('CANCEL'))).toBeVisible;
        await element(by.text('CANCEL')).tap();

        // No more errors
        await expect(element(by.text('La localisation est requise.'))).toNotExist();
        await expect(element(by.text('Le titre du voyage est requis.'))).toNotExist();
        await expect(element(by.text('La date de début du voyage doit être avant la date de fin.'))).toNotExist();
        await element(by.id('save')).tap();
        
        // The modification are displayed
        await waitFor(element(by.text('Mon carnet de voyage'))).toBeVisible().withTimeout(2000);
        await expect(element(by.text('Travel in Bresil'))).toBeVisible();
        await expect(element(by.text('Rio de Janeiro'))).toBeVisible();
        await expect(element(by.text('Travel in Mada'))).toBeVisible();
        await expect(element(by.text('Faraf'))).toBeVisible();
        await expect(element(by.text('Relax at home'))).toBeVisible();
        await expect(element(by.text('Limoges'))).toBeVisible();
        await waitFor(element(by.text('travelll'))).toBeVisible().withTimeout(2000);
        await expect(element(by.text('placeee'))).toBeVisible();
    });

    it('should modify a travel', async () => {
        await element(by.text('travelll')).tap();
        await element(by.id('modify')).tap()

        await element(by.id('title')).typeText('[modified]');
        await element(by.id('title')).tapReturnKey();
        await element(by.id('place')).typeText('[modified]');
        await element(by.id('place')).tapReturnKey();
        await element(by.id('save')).tap();

        // The modification are displayed
        await expect(element(by.text('travelll[modified]'))).toBeVisible();
        await expect(element(by.text('placeee[modified]'))).toBeVisible();
        
        await element(by.id('goback')).tap();

        // The modification are displayed
        await expect(element(by.text('Travel in Bresil'))).toBeVisible();
        await expect(element(by.text('Rio de Janeiro'))).toBeVisible();
        await expect(element(by.text('Travel in Mada'))).toBeVisible();
        await expect(element(by.text('Faraf'))).toBeVisible();
        await expect(element(by.text('Relax at home'))).toBeVisible();
        await expect(element(by.text('Limoges'))).toBeVisible();
        await expect(element(by.text('travelll[modified]'))).toBeVisible();
        await expect(element(by.text('placeee[modified]'))).toBeVisible();
        await expect(element(by.text('travelll'))).toNotExist();
        await expect(element(by.text('placeee'))).toNotExist();
    });

    it('should delete a travel', async () => {
        await element(by.text('travelll[modified]')).tap();
        await element(by.id('delete')).tap()
        
        // The modification are displayed
        await expect(element(by.text('Travel in Bresil'))).toBeVisible();
        await expect(element(by.text('Rio de Janeiro'))).toBeVisible();
        await expect(element(by.text('Travel in Mada'))).toBeVisible();
        await expect(element(by.text('Faraf'))).toBeVisible();
        await expect(element(by.text('Relax at home'))).toBeVisible();
        await expect(element(by.text('Limoges'))).toBeVisible();
        await expect(element(by.text('travelll[modified]'))).toNotExist();
        await expect(element(by.text('placeee[modified]'))).toNotExist();
    });
});