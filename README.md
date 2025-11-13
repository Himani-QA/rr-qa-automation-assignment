# TMDB Discover Automation Project

Automated testing suite for **[TMDB Discover](https://tmdb-discover.surge.sh/)** built using **Playwright** and **JavaScript**.

This project includes:
-  **UI Automation** using **Playwright** and **Page Object Model (POM)**
-  **API Testing** using Playwright’s built-in `request` feature
-  **Custom Logger** implemented with **Winston**
-  **Allure Reporting** for detailed, interactive reports

## Installation & Setup

###  Clone the repository
git clone https://github.com/Himani-QA/rr-qa-automation-assignment.git


###  Install dependencies
npm install

###  Install Allure Commandline
npm install -g allure-commandline

---

## Running Tests

### Run All Tests
npx playwright test

###  Run Only UI Tests
npx playwright test tests/ui-tests.spec.js

###  Run Only API Tests
npx playwright test tests/api-tests.spec.js

### Run Tests with Allure Reporting
npx playwright test --reporter=line,allure-playwright

### View Allure Report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

---

## Configuration Details

- **Browsers:** Set in `playwright.config.js`
- **Timeouts & Retries:** Configurable in Playwright config
- **Logs:** Automatically created under `/logs`

---

## Contributing

Contributions are welcome!
To contribute:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push and open a Pull Request

---

## Author

**Himani Bhavsar**
Senior QA Automation Engineer
Project: [TMDB Discover Automation](https://tmdb-discover.surge.sh/)
