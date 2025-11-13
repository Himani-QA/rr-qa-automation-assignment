const fs = require("fs");
const path = require("path");

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, "../logs");
        console.log('📁 Logs directory path:', this.logsDir);

        try {
            if (!fs.existsSync(this.logsDir)) {
                fs.mkdirSync(this.logsDir, { recursive: true });
                console.log('Created logs directory');
            } else {
                console.log('Logs directory already exists');
            }
        } catch (err) {
            console.error('Failed to create logs directory:', err);
        }
    }

    stripAnsiCodes(text) {
        return text.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
    }

    getLogFilePath() {
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const filePath = path.join(this.logsDir, `${dateStr}.txt`);
        console.log('Log file path:', filePath); // DEBUG
        return filePath;
    }

    formatTimestamp() {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const time = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        }).toLowerCase();

        return `[${day}/${month}/${year}, ${time}]`;
    }

    info(mesge) {
        console.info(mesge);
    }

    async logError(testName, error, page = null) {
        console.log('logError called for:', testName); // DEBUG

        try {
            const logFile = this.getLogFilePath();
            const timestamp = this.formatTimestamp();

            const cleanError = this.stripAnsiCodes(error.message || "Unknown error");
            const cleanStack = this.stripAnsiCodes(error.stack || "No stack available");

            console.log(' Error details:', { cleanError, cleanStack }); // DEBUG

            const message = `${timestamp}\nUser: ${testName}\nError: ${cleanError}\n\nStack: ${cleanStack}\n` +
                "-------------------------------------------------------------------------------------------------\n\n";

            console.log('Attempting to write to file:', logFile); // DEBUG

            // Save to local file
            fs.appendFileSync(logFile, message, "utf8");
            console.log(' Successfully wrote to log file'); // DEBUG

            // Try to attach to report (but don't fail if this doesn't work)
            try {
                if (typeof test !== 'undefined' && test.info) {
                    await test.info().attach(`${testName} - Error Log`, {
                        body: Buffer.from(message, "utf8"),
                        contentType: "text/plain"
                    });
                }
            } catch (attachError) {
                console.log('Could not attach to test report:', attachError.message);
            }

            // Attach screenshot if page is valid
            if (page && !page.isClosed()) {
                try {
                    const screenshot = await page.screenshot({ fullPage: true });
                    if (typeof test !== 'undefined' && test.info) {
                        await test.info().attach(`${testName} - Screenshot`, {
                            body: screenshot,
                            contentType: "image/png"
                        });
                    }
                } catch (screenshotError) {
                    console.log('Could not take screenshot:', screenshotError.message);
                }
            }

            console.log('Error logging completed successfully'); // DEBUG

        } catch (err) {
            console.error("CRITICAL: Failed to write error log:", err);
            console.error("Original error was:", err);
        }
    }
}

module.exports = new Logger();