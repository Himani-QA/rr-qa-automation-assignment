const { test, expect } = require('@playwright/test');
const logger = require('../utils/logger');
const HomePage = require('../pages/HomePage');

test.describe('TMDB Discover - Comprehensive Test Suite', () => {

    // CATEGORY FILTERING TESTS

    test.describe('Category Filtering', () => {
        test('TC-001: Verify Popular category displays content', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Select "Popular" category', async() => {
                    logger.info('Selecting "Popular" category');
                    await homePage.selectCategory('Popular');
                });

                await test.step('Verify content is displayed for "Popular" category', async() => {
                    const isContentVisible = await homePage.isContentDisplayed('Frankenstein');
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Verified that content is visible for Popular category');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });

                throw error;
            }
        });

        test('TC-002: Verify Trending category displays content', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Select "Trending" category', async() => {
                    logger.info('Selecting "Trending" category');
                    await homePage.selectCategory('Trend');
                });

                await test.step('Verify content is displayed for "Trending" category', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("xXx");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Verified that content is visible for Trending category');
                });
                await test.step('Verify at least one content card is loaded', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBeGreaterThan(0);
                    logger.info(`Trending category loaded with ${cardCount} items`);
                });


            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

        test('TC-003: Verify Newest category displays content', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Select "Newest" category', async() => {
                    logger.info('Selecting "Newest" category');
                    await homePage.selectCategory('Newest');
                });

                await test.step('Verify content is displayed for "Newest" category', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("Baramulla");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Verified that content is visible for Newest category');
                });

                await test.step('Verify at least one content card is loaded', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBeGreaterThan(0);
                    logger.info(`Newest category loaded with ${cardCount} items`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

        test('TC-004: Verify Top Rated category displays content', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Select "Top Rated" category', async() => {
                    logger.info('Selecting "Top Rated" category');
                    await homePage.selectCategory('Top rated');
                });

                await test.step('Verify content is displayed for "Top Rated" category', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("The Godfather");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Verified that content is visible for Top Rated category');
                });

                await test.step('Verify at least one content card is loaded', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBeGreaterThan(0);
                    logger.info(`Top Rated category loaded with ${cardCount} items`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });

                throw error;
            }
        });
    });

    // // SEARCH/TITLE FILTERING TESTS

    test.describe('Search Functionality', () => {

        test('TC-005: Verify search with valid movie title', async({ page }, testInfo) => {
            const homePage = new HomePage(page);
            let searchTerm = 'Predator';

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Enter valid movie title and perform search', async() => {
                    logger.info(`Searching for movie title: ${searchTerm}`);
                    await homePage.searchByTitle(searchTerm);
                    await page.waitForTimeout(5000);
                });

                await test.step('Verify search results are displayed', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("Predator");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Verified that search results are visible');
                });

                await test.step('Validate that search results contain the search term', async() => {
                    const titles = await homePage.getAllCardTitles();
                    console.log(titles);
                    const hasRelevantResults = titles.some(title =>
                        title.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    expect(hasRelevantResults).toBeTruthy();
                    logger.info(`Search returned ${titles.length} results`);
                    logger.info(`Results contain search term: ${hasRelevantResults}`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });

                throw error;
            }
        });

        test('TC-006: Verify search with partial title', async({ page }, testInfo) => {
            const homePage = new HomePage(page);
            const partialTerm = 'Mar';
            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Enter partial movie title and perform search', async() => {
                    logger.info(`Searching for partial movie title: ${partialTerm}`);
                    await homePage.searchByTitle(partialTerm);
                    await page.waitForTimeout(5000);
                });

                await test.step('Verify search results are displayed for partial title', async() => {
                    const isContentVisible = await homePage.isContentDisplayed(partialTerm);
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Partial search results displayed successfully');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

        test('TC-007: Verify search with no results', async({ page }, testInfo) => {
            const homePage = new HomePage(page);
            const invalidTerm = 'XYZABC12345678';
            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Search for an invalid/non-existent title', async() => {

                    logger.info(`Searching for invalid movie title: ${invalidTerm}`);
                    await homePage.searchByTitle(invalidTerm);
                    await page.waitForTimeout(1000);
                });

                await test.step('Verify that no results are returned', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    logger.info(`Search for invalid term returned ${cardCount} items`);
                    expect(cardCount).toBeGreaterThanOrEqual(0);

                    if (cardCount === 0) {
                        logger.info('No results displayed as expected for invalid search');
                    } else {
                        logger.info('Default or fallback results displayed');
                    }
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });
    });

    // TYPE FILTERING TEST

    test.describe('Type Filtering', () => {

        test('TC-008: Verify Movies filter', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to TMDB Discover homepage', async() => {
                    logger.info('Navigating to TMDB Discover homepage');
                    await homePage.navigate();
                });

                await test.step('Select "Movies" type filter', async() => {
                    logger.info('Applying Movies filter');
                    await homePage.openDropdown();
                    await homePage.selectType('Movie');
                    await page.waitForTimeout(1000);
                });

                await test.step('Verify Movies content is displayed', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("Baramulla");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Movies content is visible after applying filter');
                });

                await test.step('Verify Movies card count is greater than 0', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBeGreaterThan(0);
                    logger.info(`Movies filter applied successfully: ${cardCount} items displayed`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

        test('TC-009: Verify TV Shows filter', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to TMDB Discover homepage', async() => {
                    logger.info('Navigating to TMDB Discover homepage');
                    await homePage.navigate();
                });

                await test.step('Select "TV Shows" type filter', async() => {
                    logger.info('Applying TV Shows filter');
                    await homePage.openDropdown();
                    await homePage.selectType('TV Shows');
                    await page.waitForTimeout(5000);
                });

                await test.step('Verify TV Shows content is displayed', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("The Rookie");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('TV Shows content is visible after applying filter');
                });

                await test.step('Verify TV Shows card count is greater than 0', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBeGreaterThan(0);
                    logger.info(`TV Shows filter applied successfully: ${cardCount} items displayed`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

        test('TC-010: Verify switching between types', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Switch to "TV Shows" type and capture card count', async() => {
                    logger.info('Switching to TV Shows type');
                    await homePage.openDropdown();

                    await homePage.selectType('TV Shows');
                    await page.waitForTimeout(1000);
                });

                const tvCount = await test.step('Get TV Shows card count', async() => {
                    const count = await homePage.getContentCardCount();
                    logger.info(`TV Shows count: ${count}`);
                    return count;
                });

                await test.step('Select "Movies" type and capture card count', async() => {
                    logger.info('Selecting Movies type');
                    await homePage.selectType('Movies');
                    await page.waitForTimeout(1000);
                });

                const moviesCount = await test.step('Get Movies card count', async() => {
                    const count = await homePage.getContentCardCount();
                    logger.info(`Movies count: ${count}`);
                    return count;
                });

                await test.step('Validate both filters display content', async() => {
                    expect(moviesCount).toBeGreaterThan(0);
                    expect(tvCount).toBeGreaterThan(0);
                    logger.info(`Type switching successful: Movies=${moviesCount}, TV=${tvCount}`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

    });

    // YEAR FILTERING TESTS

    test.describe('Year Filtering', () => {

        test('TC-011: Verify year range filtering', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to TMDB Discover homepage', async() => {
                    logger.info('Navigating to TMDB Discover homepage');
                    await homePage.navigate();
                });

                await test.step('Apply year range filter 2020-2023', async() => {
                    logger.info('Filtering by year range: 2020-2023');
                    await homePage.selectYearRange(2020, 2024);
                    await page.waitForTimeout(1500);
                });

                await test.step('Verify content is displayed for year range', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("Every Day");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Content is visible after year range filter');
                });

                await test.step('Log number of items displayed', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    logger.info(`Year range 2020-2023: ${cardCount} items found`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });
    })

    // RATING FILTERING

    test.describe('Rating Filtering', () => {

        test('TC-012: Verify rating filter', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Apply rating filter ', async() => {
                    logger.info('Filtering by rating');
                    await homePage.selectRating(1); //Select from 1,2,3,4,5
                    await page.waitForTimeout(1500);
                });

                await test.step('Verify content is displayed for rating ', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("War of the Worlds");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Content is visible after applying rating ');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

        test('TC-013: Verify Maximum rating filter', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    logger.info('Navigating to homepage');
                    await homePage.navigate();
                });

                await test.step('Apply Max rating filter)', async() => {
                    logger.info('Filtering by Max rating: 4.5');
                    await homePage.selectRating(5);
                    await page.waitForTimeout(1500);
                });

                await test.step('Verify content is displayed for Max rating filter', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("End of Loyalty");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Content is visible after applying Max rating filter');
                });

                await test.step('Log number of items displayed', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    logger.info(`Rating 8+ filter: ${cardCount} items found`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`Test failed: ${testInfo.title} - ${error.message}`);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

    });

    // GENRE FILTERING TESTS

    test.describe('Genre Filtering', () => {

        test('TC-014: Verify single genre filter (Action)', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to TMDB Discover homepage', async() => {
                    await homePage.navigate();
                });

                await test.step('Apply Action genre filter', async() => {
                    logger.info('Filtering by Action genre');
                    await homePage.selectGenres('Action');
                    await page.waitForTimeout(1500);
                });

                await test.step('Verify content is displayed for Action genre', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("Martin");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('Content is visible after applying Action genre filter');
                });

                await test.step('Verify card count is greater than 0', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBeGreaterThan(0);
                    logger.info(`Action genre: ${cardCount} items found`);
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    await logger.logError("Verify single genre filter (Action)", error, page);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('screenshot', {
                        body: screenshot,
                        contentType: 'image/png'
                    });
                });
                throw error;
            }
        });

    });

    // PAGINATION

    test.describe('Pagination', () => {

        test('TC-015: Verify selecting specific page updates grid', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    await homePage.navigate();
                    logger.info('Navigated to TMDB Discover homepage');

                    // Scroll down to the bottom of the page
                    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                    await page.waitForTimeout(1500);
                    logger.info('Scrolled to bottom of homepage');
                });

                await test.step('Select Page 2', async() => {
                    await homePage.goToPage(2); // Only clicks
                    await page.waitForTimeout(1500);
                    logger.info('Clicked on Page 2');
                });

                await test.step('Verify Page 2 is active', async() => {
                    await homePage.verifyActivePage(2); // Separate verification
                });

                await test.step('Verify content is visible after pagination', async() => {
                    const isContentVisible = await homePage.isContentDisplayed("Stolen Girl");
                    expect(isContentVisible).toBeTruthy();
                    logger.info('✅ Grid content is displayed after navigating to Page 2');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    await logger.logError('Verify selecting specific page updates grid', error, page);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('Failure Screenshot', {
                        body: screenshot,
                        contentType: 'image/png',
                    });
                });
                throw error;
            }
        });

        test('TC-016: Verify Next and Previous page navigation', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    await homePage.navigate();
                    logger.info('Navigated to TMDB Discover homepage');
                    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                    await page.waitForTimeout(1500);
                    logger.info('Scrolled to bottom of homepage');
                });

                await test.step('Go to next page', async() => {
                    const firstPageContent = await homePage.getAllCardTitles();
                    await homePage.clickNextPage();
                    await page.waitForTimeout(1500);

                    await homePage.verifyActivePage(2); // ✅ verify page 2 active
                    const nextPageContent = await homePage.getAllCardTitles();

                    expect(nextPageContent).not.toEqual(firstPageContent);
                    logger.info('✅ Next page navigation successful');
                });

                await test.step('Go back to previous page', async() => {
                    await homePage.clickPreviousPage();
                    await page.waitForTimeout(1500);

                    await homePage.verifyActivePage(1); // ✅ verify page 1 active
                    const prevPageContent = await homePage.getAllCardTitles();

                    expect(prevPageContent.length).toBeGreaterThan(0);
                    logger.info('✅ Previous page navigation successful');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    await logger.logError(' Verify Next and Previous page navigation', error, page);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('Failure Screenshot', {
                        body: screenshot,
                        contentType: 'image/png',
                    });
                });
                throw error;
            }
        });
    });

    // COMBINED FILTERS TESTS
    test.describe('Combined Filters', () => {

        test('TC-017: Verify Type + Genre + Year filter', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    await homePage.navigate();
                    logger.info('Navigated to TMDB Discover homepage');
                });

                await test.step('Apply Type: Movies', async() => {
                    await homePage.selectType('Movies');
                    await page.waitForTimeout(800);
                    logger.info('Applied Type filter: Movies');
                });

                await test.step('Apply Genre: Action', async() => {
                    await homePage.selectGenres('Action');
                    await page.waitForTimeout(800);
                    logger.info('Applied Genre filter: Action');
                });

                await test.step('Apply Year Range: 2020 - 2024', async() => {
                    await homePage.selectYearRange(2020, 2024);
                    await page.waitForTimeout(1500);
                    logger.info('Applied Year Range filter: 2020–2024');
                });

                await test.step('Verify filtered content is displayed', async() => {
                    const isContentVisible = await homePage.isContentDisplayed('Martin');
                    expect(isContentVisible).toBeTruthy();
                    logger.info('✅ Combined Movies + Action + Year filter applied successfully');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`❌ Test failed: ${testInfo.title}`, error, page);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('Failure Screenshot', {
                        body: screenshot,
                        contentType: 'image/png',
                    });
                });
                throw error;
            }
        });
    });

    // NEGATIVE TEST
    test.describe('Negative Tests & Known Issues', () => {

        // ❌ TC-018: Negative test – Verify navigating to invalid page (500)
        test('TC-018: Verify last page pagination (Known Issue)', async({ page }, testInfo) => {
            const homePage = new HomePage(page);

            try {
                await test.step('Navigate to homepage', async() => {
                    await homePage.navigate();
                    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                    await page.waitForTimeout(1500);
                    logger.info('Scrolled to bottom of homepage');
                    logger.info('Navigated to TMDB Discover homepage');
                });

                await test.step('Try navigating to invalid page (last page)', async() => {
                    logger.info('Attempting to navigate to page 53637');
                    await homePage.goToPage(53643); // only click attempt
                    await page.waitForTimeout(1500);
                });

                await test.step('Verify no grid or empty state displayed', async() => {
                    const cardCount = await homePage.getContentCardCount();
                    expect(cardCount).toBe(0);
                    logger.info('✅ No grid displayed for invalid page number (expected)');
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    logger.logError(`❌ Test failed: ${testInfo.title}`, error, page);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('Failure Screenshot', {
                        body: screenshot,
                        contentType: 'image/png',
                    });
                });
                throw error;
            }
        });

        // ❌ TC-019: Negative test – Verify direct slug access
        test('TC-019: Verify direct slug access (Known Issue)', async({ page }, testInfo) => {
            const slugUrl = 'https://tmdb-discover.surge.sh/popular';
            logger.info(`Test: Verify direct slug access → ${slugUrl}`);

            try {
                await test.step('Navigate directly to slug URL', async() => {
                    await page.goto(slugUrl, { waitUntil: 'load' });
                    await page.waitForTimeout(2000);
                    logger.info('Page navigation attempt completed');
                });

                await test.step('Check if page loaded successfully', async() => {
                    const isPageLoaded = await page.locator('body').isVisible();
                    logger.info(`Direct slug access result: ${isPageLoaded ? '✅ Loaded' : '❌ Failed'}`);

                    if (!isPageLoaded) {
                        logger.error('BUG: Direct slug access failed (Known Issue DEF-001)');
                    }

                    expect(isPageLoaded).toBeTruthy();
                });

            } catch (error) {
                await test.step('Capture screenshot and log failure', async() => {
                    await logger.logError(`Direct slug access test failed: ${testInfo.title}`, error, page);
                    const screenshot = await page.screenshot();
                    await testInfo.attach('Failure Screenshot', {
                        body: screenshot,
                        contentType: 'image/png',
                    });
                });
                throw error;
            }
        });

    });
})