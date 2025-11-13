const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Test Configuration
 *
 * This configuration file defines:
 * - Test execution settings
 * - Browser configurations
 * - Reporting options
 * - CI/CD optimizations
 */
module.exports = defineConfig({
    // Test directory
    testDir: './tests',

    // Maximum time one test can run (30 seconds)
    timeout: 30 * 1000,

    // Test execution settings
    fullyParallel: true, // Run tests in parallel
    forbidOnly: !!process.env.CI, // Fail if test.only in CI
    retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
    workers: process.env.CI ? 2 : undefined, // Limit workers in CI

    // Reporter configuration
    reporter: [
        // Console reporter with detailed output
        ['list'],

        // HTML reporter - generates interactive report
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never', // Don't auto-open in CI
        }],

        // JSON reporter for programmatic access
        ['json', {
            outputFile: 'test-results/results.json'
        }],

        // JUnit reporter for CI integration
        ['junit', {
            outputFile: 'test-results/junit.xml'
        }],

        // Allure reporter - Enhanced reporting with rich details
        ['allure-playwright', {
            outputFolder: 'allure-results',
            detail: true,
            suiteTitle: true,
            categories: [{
                    name: 'Known Issues',
                    matchedStatuses: ['failed'],
                    messageRegex: '.*Known Issue.*',
                },
                {
                    name: 'API Failures',
                    matchedStatuses: ['broken'],
                    messageRegex: '.*API.*',
                },
            ],
            environmentInfo: {
                'Application': 'TMDB Discover',
                'Environment': 'Production',
                'URL': 'https://tmdb-discover.surge.sh',
                'Test Framework': 'Playwright',
            },
        }],
    ],

    // Global test settings
    use: {
        // Base URL for navigation
        baseURL: 'https://tmdb-discover.surge.sh',

        // Browser context options
        viewport: { width: 1280, height: 720 },

        // Collect trace on failure for debugging
        trace: 'retain-on-failure',

        // Screenshot on failure
        screenshot: 'only-on-failure',

        // Video recording
        video: 'retain-on-failure',

        // Timeout for each action (e.g., click, fill)
        actionTimeout: 10000,

        // Navigation timeout
        navigationTimeout: 30000,

        // Ignore HTTPS errors (for dev environments)
        ignoreHTTPSErrors: true,

        // Accept downloads
        acceptDownloads: false,

        // User agent
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },

    // Configure projects for major browsers
    projects: [{
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Chromium-specific settings
                launchOptions: {
                    args: [
                        '--disable-web-security',
                        '--disable-features=IsolateOrigins,site-per-process',
                    ],
                },
            },
        },

        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //     },
        // },

        // {
        //     name: 'webkit',
        //     use: {
        //         ...devices['Desktop Safari'],
        //     },
        // },

        // Mobile browsers (optional)
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },

        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

        // Edge browser (optional)
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     ...devices['Desktop Edge'],
        //     channel: 'msedge'
        //   },
        // },

        // Google Chrome (optional)
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     ...devices['Desktop Chrome'],
        //     channel: 'chrome'
        //   },
        // },
    ],

    // Web server configuration (if testing local dev server)
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    //   timeout: 120 * 1000,
    //   reuseExistingServer: !process.env.CI,
    // },

    // Output directories
    outputDir: 'test-results/',

    // Global setup/teardown (optional)
    // globalSetup: require.resolve('./global-setup'),
    // globalTeardown: require.resolve('./global-teardown'),

    // Expect timeout
    expect: {
        timeout: 5000,
        toHaveScreenshot: {
            maxDiffPixels: 100,
        },
    },
});

/**
 * Environment-specific configurations
 */

// Development environment
if (process.env.ENV === 'dev') {
    module.exports.use.baseURL = 'http://localhost:3000';
    module.exports.use.video = 'off';
    module.exports.workers = 1;
}

// Staging environment
if (process.env.ENV === 'staging') {
    module.exports.use.baseURL = 'https://staging.tmdb-discover.surge.sh';
}

// Production environment (default)
if (process.env.ENV === 'production') {
    module.exports.use.baseURL = 'https://tmdb-discover.surge.sh';
}

// Debug mode
if (process.env.DEBUG === 'true') {
    module.exports.workers = 1;
    module.exports.use.headless = false;
    module.exports.use.video = 'on';
    module.exports.use.trace = 'on';
}