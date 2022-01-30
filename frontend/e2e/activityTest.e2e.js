/* Tests for an activity owned by the user */

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

    it('should see the two activities', async () => {
        await element(by.id('Travel in Bresil')).tap();
        await waitFor(element(by.text('Vos activités'))).toBeVisible().withTimeout(2000);
        await expect(element(by.text('See the famous statue'))).toBeVisible();
        await expect(element(by.text('Parc national de la Tijuaca'))).toBeVisible();
        await expect(element(by.text('Visit'))).toBeVisible();
        await expect(element(by.text('Eat some food'))).toBeVisible();
        await expect(element(by.text('Restaurante Marius Degustare'))).toBeVisible();
        await expect(element(by.text('Meals'))).toBeVisible();
    });

    it('should create an activity after test for all the possible errors in the form', async () => {
        await element(by.id('create')).tap();

        await element(by.id('name')).typeText('activityyy');
        // Error for the place
        await expect(element(by.text('La localisation est requise.'))).toBeVisible();

        await element(by.id('place')).typeText('placeee');
        await element(by.id('place')).tapReturnKey();

        // Error for the title
        await element(by.id('name')).clearText();
        await expect(element(by.text('Le titre du voyage est requis.'))).toBeVisible();

        await element(by.id('name')).typeText('activityyy');
        await element(by.id('name')).tapReturnKey();

        // Error for the type
        await expect(element(by.text('Le type est requis.'))).toBeVisible();

        await element(by.id('type')).typeText('typeee');
        await element(by.id('type')).tapReturnKey();

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
        await expect(element(by.text('Le type est requis.'))).toNotExist();
        await element(by.id('save')).tap();
        
        // The modification are displayed
        await element(by.id('scroll')).scrollTo('bottom');
        await expect(element(by.text('See the famous statue'))).toBeVisible();
        await expect(element(by.text('Parc national de la Tijuaca'))).toBeVisible();
        await expect(element(by.text('Visit'))).toBeVisible();
        await expect(element(by.text('Eat some food'))).toBeVisible();
        await expect(element(by.text('Restaurante Marius Degustare'))).toBeVisible();
        await expect(element(by.text('Meals'))).toBeVisible();
        await waitFor(element(by.text('activityyy'))).toBeVisible().withTimeout(2000);
        await expect(element(by.text('placeee'))).toBeVisible();
        await expect(element(by.text('typeee'))).toBeVisible();
    });

    it('should modify an activity', async () => {
        await element(by.text('activityyy')).tap();
        await element(by.id('modify')).tap()

        await element(by.id('name')).typeText('[modified]');
        await element(by.id('name')).tapReturnKey();
        await element(by.id('type')).typeText('[modified]');
        await element(by.id('type')).tapReturnKey();
        await element(by.id('place')).typeText('[modified]');
        await element(by.id('place')).tapReturnKey();
        await element(by.id('save')).tap();

        // The modification are displayed
        await expect(element(by.text('activityyy[modified]'))).toBeVisible();
        await expect(element(by.text('placeee[modified]'))).toBeVisible();
        await expect(element(by.text('typeee[modified]'))).toBeVisible();
        
        await element(by.id('goback')).tap();

        // The modification are displayed
        await expect(element(by.text('See the famous statue'))).toBeVisible();
        await expect(element(by.text('Parc national de la Tijuaca'))).toBeVisible();
        await expect(element(by.text('Visit'))).toBeVisible();
        await expect(element(by.text('Eat some food'))).toBeVisible();
        await expect(element(by.text('Restaurante Marius Degustare'))).toBeVisible();
        await expect(element(by.text('Meals'))).toBeVisible();
        await expect(element(by.text('activityyy[modified]'))).toBeVisible();
        await expect(element(by.text('placeee[modified]'))).toBeVisible();
        await expect(element(by.text('typeee[modified]'))).toBeVisible();
        await waitFor(element(by.text('activityyy'))).toNotExist();
        await expect(element(by.text('placeee'))).toNotExist();
        await expect(element(by.text('typeee'))).toNotExist();
    });

    it('should delete a travel', async () => {
        await element(by.text('activityyy[modified]')).tap();
        await element(by.id('delete')).tap()
        
        // The modification are displayed
        await expect(element(by.text('See the famous statue'))).toBeVisible();
        await expect(element(by.text('Parc national de la Tijuaca'))).toBeVisible();
        await expect(element(by.text('Visit'))).toBeVisible();
        await expect(element(by.text('Eat some food'))).toBeVisible();
        await expect(element(by.text('Restaurante Marius Degustare'))).toBeVisible();
        await expect(element(by.text('Meals'))).toBeVisible();
        await expect(element(by.text('activityyy[modified]'))).toNotExist();
        await expect(element(by.text('placeee[modified]'))).toNotExist();
        await expect(element(by.text('typeee[modified]'))).toNotExist();
    });
});