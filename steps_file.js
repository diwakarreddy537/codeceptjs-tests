const assert = require("assert");

module.exports = function () {
  return actor({
    goto(url) {
      this.amOnPage(url);
    },

    async partialSearch(searchTerm) {
      this.waitForElement('input[name="searchText"]', 10);
      this.fillField('input[name="searchText"]', searchTerm);
      this.pressKey("Enter");

      await this.waitForURL(
        `https://www.oranum.com/en/experts/${searchTerm}`,
        5
      );
      this.seeElement(".listpage.listpage--multi .listpage-title");
      this.see(
        `${searchTerm.toUpperCase()} EXPERTS`,
        ".listpage.listpage--multi .listpage-title"
      );
    },

    async waitForSearchResult(searchTerm) {
      this.waitForURL(`https://www.oranum.com/en/experts/${searchTerm}`, 10);
      this.seeElement(".listpage.listpage--multi .listpage-title");
      this.see(
        `${searchTerm.toUpperCase()} EXPERTS`,
        ".listpage.listpage--multi .listpage-title"
      );
    },

    async checkNameFromSearchResult(textContent) {
      const articlesCount = await this.grabNumberOfVisibleElements(
        ".thumb-container article:not(.thumb-campaign)"
      );

      for (let i = 1; i <= articlesCount; i++) {
        const articleSelector = `.thumb-container article:not(.thumb-campaign):nth-child(${i})`;

        const result = await this.grabTextFrom(
          `${articleSelector} .thumb-data-item--name`
        );
        assert(result.toLowerCase().includes(textContent.toLowerCase()));
      }
    },

    async checkCategoryFromSearchResult(name) {
      this.say("Check Category or Tag name");
      const articlesCount = await this.grabNumberOfVisibleElements(
        ".thumb-container article:not(.thumb-campaign)"
      );

      for (let i = 1; i <= articlesCount; i++) {
        const articleSelector = `.thumb-container article:not(.thumb-campaign):nth-child(${i})`;

        const result = await this.grabTextFrom(
          `${articleSelector} .thumb-data-willingness-list`
        );
        assert(
          result.toLowerCase().includes(name.toLowerCase()),
          `${name.trim()} category or tag search have different experts list found`
        );
      }
      this.say("Category or Tag name are matched");
    },

    async checkForDuplicateExpertsFromList() {
      this.say("Check For Duplicate Experts");
      const elements = await this.grabTextFromAll(
        ".thumb-container article:not(.thumb-campaign) .thumb-data-item--name"
      );
      const hasDuplicates = new Set(elements).size !== elements.length;
      assert(!hasDuplicates, "Duplicate values should not exist");
      this.say("no duplicate found");
    },

    async findLiveExpert() {
      this.goto("https://www.oranum.com/en");
      const firstArticleSelector =
        ".thumb-container article:not(.thumb-campaign):nth-child(1)";

      this.click(firstArticleSelector);
    },

    async checkVideoContainer() {
      this.waitForElement("#video-container", 10);
    },

    async clickButtonForOverlayApplet(overlayElementId) {
      await within("#video-container", () => {
        this.seeElement(overlayElementId, 10);
        this.click(overlayElementId);
      });
    },

    async checkOverlayAppletVisible() {
      await within("#video-container", () => {
        this.waitForVisible(
          'div[data-testid="mainLoginSignUpOverlayApplet"]',
          10
        );
        // check join button exit
        this.waitForVisible(
          'div[data-testid="mainLoginSignUpOverlayApplet"]  button[data-testid="joinNowButtonApplet"]',
          10
        );
      });
    },

    async closeOverlayApplet(overlayDataId) {
      await within("#video-container", () => {
        this.seeElement(
          'div[data-testid="mainLoginSignUpOverlayApplet"] .js_close_dialog'
        );
        this.click(
          'div[data-testid="mainLoginSignUpOverlayApplet"] .js_close_dialog'
        );
      });
    },
  });
};
