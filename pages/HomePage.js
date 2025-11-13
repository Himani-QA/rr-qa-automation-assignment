const logger = require('../utils/logger');

class HomePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://tmdb-discover.surge.sh/';

        this.selectors = {
            categoryButtons: '//ul[@class="list-none flex"]//a',
            popularBtn: '//a[text()="Popular"]',
            trendingBtn: '//a[text()="Trend"]',
            newestBtn: '//a[text()="Newest"]',
            topRatedBtn: '//a[text()="Top Rated"]',
            searchInput: 'input[placeholder="SEARCH"], input[placeholder*="Search" i], input[name="search"]',
            searchButton: 'button[type="submit"], .search-btn, img[alt="Search Icon"]',
            contentCard: '.grid > div.flex.flex-col.items-center',

            // typeDropdown: 'div.css-2b097c-container >> nth=0 >> div.css-yk16xz-control',
            typeDropdown: 'div.css-2b097c-container >> nth=0', // container for first dropdown
            typeSingleValue: 'div.css-1uccc91-singleValue',
            typeInput: 'input[id^="react-select-"][id$="-input"]',
            typeMenu: '//*[@id="root"]/div/aside/div/div[1]/div[2]',
            typeOption: '.css-9gakcf-option, .css-1n7v3ny-option',
            movieOption: '//*[@id="react-select-2-option-0"]',
            tvOption: '//*[@id="react-select-2-option-1"]',

            yearDropdown: 'div[id*="react-select"][class*="-control"]:has-text("Year")',
            yearMenu: 'div[id*="react-select"][class*="-menu"]',
            yearOption: 'div[id*="react-select"][class*="-option"]',

            ratingSlider: 'input[type="range"][name="rating"], #rating-slider',
            ratingInput: 'input[type="number"][name="rating"], #rating-input',
            ratingMinInput: '#rating-min',
            ratingMaxInput: '#rating-max',


            loadingSpinner: '.loading, .spinner, [data-testid="loading"]',
            errorMessage: '.error, .error-message, [role="alert"]',
            noResults: '.no-results, .empty-state',
        };
    }

    /** Navigate to homepage */
    async navigate() {
        try {
            await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
        } catch (error) {
            await logger.logError(`Failed to navigate to ${this.baseUrl}`, error, this.page);
        }
    }

    /** Wait for page load */
    async waitForPageLoad() {
        try {
            await this.page.waitForSelector(this.selectors.contentContainer, { timeout: 10000 });
            await this.page.waitForLoadState('load');
        } catch (error) {
            await logger.logError(`Page load warning`, error, this.page);
        }
    }

    /** Select a category */
    async selectCategory(category) {
        try {
            const categorySelector = `//a[text()="${category}"]`;
            await this.page.click(categorySelector, { timeout: 5000 });
            await this.waitForContentLoad();
        } catch (error) {
            await logger.logError(`Failed to select category ${category}`, error, this.page);
            await this.page.getByRole('button', { name: category }).click();
            await this.waitForContentLoad();
        }
    }

    /** Search by title */
    async searchByTitle(title) {
        try {
            const searchInput = await this.page.locator(this.selectors.searchInput).first();
            await searchInput.fill(title);
            await searchInput.press('Enter');
            await this.waitForContentLoad();
        } catch (error) {
            await logger.logError(`Search failed for ${title}`, error, this.page);
        }
    }

    // Open the Type dropdown
    async openDropdown() {
        const { typeDropdown, typeSingleValue, typeMenu } = this.selectors;

        const dropdown = this.page.locator(typeDropdown);
        const singleValue = dropdown.locator(typeSingleValue);

        // Only click if the menu is not visible
        const menu = this.page.locator(typeMenu);
        if (!(await menu.isVisible())) {
            await singleValue.waitFor({ state: 'visible', timeout: 5000 });
            await singleValue.click();
            await menu.waitFor({ state: 'visible', timeout: 5000 });
        }
    }


    // Select type (Movie / TV / custom)
    async selectType(type) {
        try {
            const { typeOption, movieOption, tvOption } = this.selectors;

            // Open dropdown first
            await this.openDropdown();

            // Select option
            if (type.toLowerCase().includes('movie')) {
                await this.page.locator(movieOption).click();
                await logger.info('🎬 Selected option: Movie');
            } else if (type.toLowerCase().includes('tv')) {
                await this.page.locator(tvOption).click();
                await logger.info('📺 Selected option: TV Shows');
            } else {
                const option = this.page.locator(`${typeOption}:has-text("${type}")`);
                await option.first().click();
                await logger.info(`Selected custom type: ${type}`);
            }

            await this.waitForContentLoad({ timeout: 5000 });
            await logger.info(`✅ Type filter applied successfully: ${type}`);
        } catch (error) {
            await logger.logError(`❌ Type selection failed: ${type}`, error, this.page);
            throw error;
        }
    }

    //select year range
    async selectYearRange(startYear, endYear) {

        const startInput = this.page.locator('#react-select-4-input');
        const endInput = this.page.locator('#react-select-5-input');

        //await startInput.click();
        await startInput.fill(String(startYear));
        await startInput.press('Enter');

        // Select end year
        await endInput.fill(String(endYear));
        await endInput.press('Enter');

        await this.waitForContentLoad(1500);
        await logger.info(`✅ Selected year range: ${startYear} - ${endYear}`);
    }

    /** Select rating */
    async selectRating(rating) {
        try {
            rating = rating - 1;
            // Hover and click on the first star
            const firstStar = this.page.locator('ul.rc-rate li >> nth= ' + rating + ' >> div[role="radio"]');
            await firstStar.hover();
            await firstStar.click();
            await this.waitForContentLoad();
            await logger.info(`✅ Selected star rating: ${rating}`);
        } catch (error) {
            await logger.logError(`❌ Star rating selection failed: ${rating}`, error, this.page);
            throw error;
        }
    }

    async selectGenres(genres) {
        try {
            const genreList = Array.isArray(genres) ? genres : [genres];

            for (const genre of genreList) {
                // Click dropdown to open it (each time)
                const dropdown = this.page.locator('#root > div > aside > div > div:nth-child(4) > div.css-yk16xz-control');
                await dropdown.click();

                // Wait for the options to appear
                await this.page.waitForSelector('.css-26l3qy-menu', { state: 'visible' });

                // Locate the desired option by text
                const option = this.page.locator(`div[id^="react-select-3-option"]:has-text("${genre}")`);
                await option.waitFor({ state: 'visible' });

                // Click the option
                await option.click();

                await logger.info(`🎬 Selected genre: ${genre}`);

                // Optional short wait to ensure UI updates properly
                await this.page.waitForTimeout(500);
            }

            // Wait for content reload after all selections
            await this.waitForContentLoad(1500);

            await logger.info(`✅ Selected genres: ${genreList.join(', ')}`);
        } catch (error) {
            await logger.logError(`❌ Genre selection failed for: ${genres}`, error, this.page);
        }
    }



    /** Pagination */
    async clickNextPage() {
        try {
            const nextBtn = this.page.locator('#react-paginate li.next a[role="button"][aria-label="Next page"]');
            await nextBtn.waitFor({ state: 'visible', timeout: 3000 });
            await nextBtn.click();
            await this.waitForContentLoad();
            logger.info('Clicked Next page button successfully');
        } catch (error) {
            await logger.logError('Next page click failed', error, this.page);
        }
    }


    async clickPreviousPage() {
        try {
            const prevBtn = this.page.locator('#react-paginate li.previous a[role="button"][aria-label="Previous page"]');
            await prevBtn.waitFor({ state: 'visible', timeout: 3000 });
            await prevBtn.click();
            await this.waitForContentLoad();
            logger.info('Clicked Previous page button successfully');
        } catch (error) {
            await logger.logError('Previous page click failed', error, this.page);
        }
    }
    async goToPage(pageNumber) {
        try {
            const targetSelector = `#react-paginate a[role="button"][aria-label="Page ${pageNumber}"]`;
            const targetPage = this.page.locator(targetSelector);

            await targetPage.waitFor({ state: 'visible', timeout: 5000 });

            await targetPage.click();
            await logger.info(`➡️ Clicked on Page ${pageNumber}`);

            await this.page.waitForTimeout(1000);

        } catch (error) {
            await logger.logError(`❌ Page click failed for Page ${pageNumber}`, error, this.page);
            throw error;
        }
    }

    async verifyActivePage(pageNumber) {
        try {
            const activePageLocator = this.page.locator(`#react-paginate a[aria-current="page"][aria-label="Page ${pageNumber} is your current page"]`);
            console.log(activePageLocator);
            // Wait for active page indicator
            await activePageLocator.waitFor({ state: 'visible', timeout: 3000 });

            // Wait for grid/content to refresh
            await this.waitForContentLoad();

            await logger.info(`✅ Page ${pageNumber} is active and verified`);
        } catch (error) {
            await logger.logError(`❌ Failed to verify Page ${pageNumber} active state`, error, this.page);
            throw error;
        }
    }

    async isContentDisplayed(itemTitle) {
        try {
            var locatorId = `//p[normalize-space()='${itemTitle}']`;
            console.log(locatorId);
            const container = await this.page.locator(locatorId).first();
            return await container.isVisible({ timeout: 5000 });
        } catch (error) {
            await logger.logError(`Content visibility check failed`, error, this.page);
            return false;
        }
    }

    async getContentCardCount() {
        try {
            const cards = await this.page.locator(this.selectors.contentCard).all();
            return cards.length;
        } catch (error) {
            await logger.logError(`Card count failed`, error, this.page);
            throw error;
        }
    }

    async getAllCardTitles() {
        try {
            await this.page.waitForSelector('.grid .flex-col p.text-blue-500', { timeout: 5000 });

            const titles = await this.page.$$eval('.grid .flex-col p.text-blue-500', elements =>
                elements.map(el => el.textContent.trim())
            );

            console.log('Card Titles:', titles);
            return titles;
        } catch (error) {
            console.error('Error while fetching card titles:', error);
            return [];
        }
    }

    async waitForContentLoad() {
        try {
            await this.page.waitForSelector(this.selectors.loadingSpinner, {
                state: 'hidden',
                timeout: 5000
            });
        } catch {}
        await this.page.waitForTimeout(500);
    }
}

module.exports = HomePage;