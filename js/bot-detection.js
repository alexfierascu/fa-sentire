// bot-detection.js - Client-side bot detection for static websites

(function() {
    'use strict';

    // Configuration
    const config = {
        blockBots: true,
        logDetections: true,
        redirectUrl: '/blocked.html', // Page to redirect blocked bots
        allowedBots: [
            'googlebot', 'bingbot', 'slurp', 'duckduckbot',
            'baiduspider', 'yandexbot'
        ],
        blockedPatterns: [
            // Testing/Automation Tools
            'selenium', 'cypress', 'playwright', 'puppeteer',
            'webdriver', 'chromedriver', 'geckodriver', 'phantomjs',
            'testcafe', 'protractor', 'nightmare', 'zombie',
            // Scrapers
            'python-requests', 'scrapy', 'beautifulsoup', 'requests',
            'curl', 'wget', 'httpie', 'postman', 'insomnia',
            // Generic bot patterns
            'bot', 'crawler', 'scraper', 'spider', 'headless'
        ]
    };

    // Bot detection functions
    const BotDetector = {

        // Check user agent
        checkUserAgent() {
            const userAgent = navigator.userAgent.toLowerCase();

            // Allow search engines
            if (config.allowedBots.some(bot => userAgent.includes(bot))) {
                return { isBot: false, reason: 'allowed_bot', userAgent };
            }

            // Check for blocked patterns
            const blockedPattern = config.blockedPatterns.find(pattern =>
                userAgent.includes(pattern)
            );

            if (blockedPattern) {
                return {
                    isBot: true,
                    reason: 'blocked_user_agent',
                    pattern: blockedPattern,
                    userAgent
                };
            }

            // Check for suspicious patterns
            if (userAgent.length < 10 || userAgent.length > 500) {
                return {
                    isBot: true,
                    reason: 'suspicious_user_agent_length',
                    userAgent
                };
            }

            return { isBot: false, userAgent };
        },

        // Check for automation properties
        checkAutomationProperties() {
            const detections = [];

            // WebDriver detection
            if (window.webdriver ||
                window.navigator.webdriver ||
                window.callPhantom ||
                window._phantom) {
                detections.push('webdriver_property');
            }

            // Selenium detection
            if (window.document && (
                window.document.$cdc_asdjflasutopfhvcZLmcfl_ ||
                window.document.documentElement.getAttribute('selenium') ||
                window.document.documentElement.getAttribute('webdriver') ||
                window.document.documentElement.getAttribute('driver')
            )) {
                detections.push('selenium_property');
            }

            // Chrome automation detection
            if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
                if (!window.chrome.runtime.onConnect.hasListeners()) {
                    detections.push('chrome_automation');
                }
            }

            // Headless Chrome detection
            if (navigator.webdriver === true) {
                detections.push('navigator_webdriver');
            }

            // Check for missing properties
            if (!window.outerHeight || !window.outerWidth) {
                detections.push('missing_window_properties');
            }

            // Phantom.js detection
            if (window.callPhantom || window._phantom || window.phantom) {
                detections.push('phantomjs');
            }

            return detections;
        },

        // Check browser behavior
        checkBrowserBehavior() {
            const detections = [];

            // Check if plugins are available
            if (navigator.plugins.length === 0) {
                detections.push('no_plugins');
            }

            // Check for webGL
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) {
                    detections.push('no_webgl');
                }
            } catch (e) {
                detections.push('webgl_error');
            }

            // Check for touch support inconsistency
            if (('ontouchstart' in window) !== ('TouchEvent' in window)) {
                detections.push('touch_inconsistency');
            }

            // Check screen properties
            if (screen.width === 0 || screen.height === 0) {
                detections.push('invalid_screen_dimensions');
            }

            // Check timezone
            try {
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (!timezone || timezone === 'UTC') {
                    detections.push('suspicious_timezone');
                }
            } catch (e) {
                detections.push('timezone_error');
            }

            return detections;
        },

        // Check timing patterns
        checkTiming() {
            const startTime = performance.now();

            // Measure JavaScript execution speed
            let iterations = 0;
            const endTime = startTime + 1; // 1ms test

            while (performance.now() < endTime) {
                iterations++;
            }

            // If too fast, might be headless
            if (iterations > 50000) {
                return ['execution_too_fast'];
            }

            return [];
        },

        // Comprehensive bot check
        detect() {
            const results = {
                isBot: false,
                confidence: 0,
                detections: [],
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // User agent check
            const userAgentResult = this.checkUserAgent();
            if (userAgentResult.isBot) {
                results.isBot = true;
                results.confidence += 90;
                results.detections.push({
                    type: 'user_agent',
                    reason: userAgentResult.reason,
                    pattern: userAgentResult.pattern
                });
            }

            // Automation properties check
            const automationDetections = this.checkAutomationProperties();
            if (automationDetections.length > 0) {
                results.isBot = true;
                results.confidence += 80;
                results.detections.push({
                    type: 'automation_properties',
                    detections: automationDetections
                });
            }

            // Browser behavior check
            const behaviorDetections = this.checkBrowserBehavior();
            if (behaviorDetections.length > 2) {
                results.isBot = true;
                results.confidence += 60;
                results.detections.push({
                    type: 'browser_behavior',
                    detections: behaviorDetections
                });
            }

            // Timing check
            const timingDetections = this.checkTiming();
            if (timingDetections.length > 0) {
                results.confidence += 40;
                results.detections.push({
                    type: 'timing',
                    detections: timingDetections
                });
            }

            return results;
        },

        // Log detection results
        log(results) {
            if (config.logDetections) {
                console.log('🤖 Bot Detection Results:', {
                    isBot: results.isBot,
                    confidence: results.confidence + '%',
                    detections: results.detections.length,
                    userAgent: results.userAgent.substring(0, 100) + '...'
                });

                if (results.detections.length > 0) {
                    console.table(results.detections);
                }
            }
        },

        // Block bot action
        blockBot(results) {
            // Hide page content
            document.body.style.display = 'none';

            // Create blocking message
            const blockingDiv = document.createElement('div');
            blockingDiv.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #1a1a1a;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: Arial, sans-serif;
                    z-index: 999999;
                ">
                    <h1>🚫 Access Denied</h1>
                    <p>Automated access to this website is not permitted.</p>
                    <p>This website is designed for human visitors only.</p>
                    <div style="margin-top: 20px; font-size: 0.8em; color: #888;">
                        Detection ID: ${Date.now()}
                    </div>
                </div>
            `;

            document.body.appendChild(blockingDiv);

            // Optional: Redirect after delay
            setTimeout(() => {
                if (config.redirectUrl) {
                    window.location.href = config.redirectUrl;
                }
            }, 3000);

            // Prevent further script execution
            throw new Error('Bot access blocked');
        },

        // Initialize detection
        init() {
            // Run detection when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.run());
            } else {
                this.run();
            }
        },

        // Run the detection
        run() {
            try {
                const results = this.detect();
                this.log(results);

                if (results.isBot && config.blockBots) {
                    this.blockBot(results);
                }

                // Store results for debugging
                window.__botDetectionResults = results;

            } catch (error) {
                console.error('Bot detection error:', error);
            }
        }
    };

    // Auto-initialize when script loads
    BotDetector.init();

    // Expose for manual testing
    window.BotDetector = BotDetector;

})();