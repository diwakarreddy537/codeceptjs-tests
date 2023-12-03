const assert = require("assert");

Feature("Test oranum website");

Scenario(
  "Req-1_Search for Expert or category: Searching for partial text should display only matching psychics",
  async ({ I }) => {
    I.goto("https://www.oranum.com/en/");
    const searchTerm = "matt";
    await I.partialSearch(searchTerm);
    await I.waitForSearchResult(searchTerm);
    await I.checkNameFromSearchResult(searchTerm);
  }
);

Scenario(
  "Req-2_Validate that the following buttons will trigger a 'Sign up' overlay to be displayed",
  async ({ I }) => {
    await I.findLiveExpert();
    await I.checkVideoContainer();

    const overlayBtnIcon = [
      ["Check Buy Credit Icon", "buyCreditIcon"],
      ["Check Favorite Icon", "favoriteIcon"],
      ["Check Surprise Icon", "surpriseIcon"],
    ];
    for (let i = 0; i < overlayBtnIcon.length; i++) {
      I.say(overlayBtnIcon[i][0]);
      await I.clickButtonForOverlayApplet(
        `div[data-id="${overlayBtnIcon[i][1]}"]`
      );
      await I.checkOverlayAppletVisible();
      await I.closeOverlayApplet();
    }

    const surpriseList = [
      ["Check Surprises Diamond Icon", "surprise-OranumSurprisesDiamond_LJ"],
      ["Check Surprises Fox Icon", "surprise-OranumSurprisesFox"],
      ["Check Surprises Heart Icon", "surprise-OranumSurprisesHeart"],
      ["Check Surprises Sun Icon", "surprise-OranumSurprisesSun"],
      ["Check Surprises Phoenix Icon", "surprise-OranumSurprisesPhoenix"],
      ["Check Surprises YinYang Icon", "surprise-OranumSurprisesYinYang"],
      ["Check Surprises Flower Icon", "surprise-OranumSurprisesFlower"],
    ];

    for (let i = 0; i < surpriseList.length; i++) {
      I.say(surpriseList[i][0]);
      const selector = `div[data-testid="surpriseListBottom"] div[data-testid="${surpriseList[i][1]}"]`;
      await I.clickButtonForOverlayApplet(selector);
      await I.checkOverlayAppletVisible();
      await I.closeOverlayApplet();
    }

    I.say("Check Quick Buy Icon");
    await I.clickButtonForOverlayApplet("#mc_btn_quickbuy_bottom");
    await I.checkOverlayAppletVisible();
    await I.closeOverlayApplet();

    // I.say("Check Start Private Button");
    // await I.clickButtonForOverlayApplet("#mc_btn_start_private");
    // await I.checkOverlayAppletVisible();
    // await I.closeOverlayApplet();
  }
);

Scenario(
  "Req-3_Selecting different topics should display only matching psychic",
  async ({ I }) => {
    I.goto("https://www.oranum.com/en/");

    const sidebarFiltersExists = await I.seeElement(".sidebar-filters");
    assert(!sidebarFiltersExists, "Sidebar filters element not found");

    const filterList = await I.grabNumberOfVisibleElements(
      ".sidebar-filters > li"
    );

    // find Category and Topics list index
    let findMenuIndex = [];
    for (let i = 1; i <= filterList; i++) {
      const liSelector = `.sidebar-filters > li:nth-child(${i})`;

      // Check if the <li> contains a label with text "Category" or "Topics"
      const hasCategoryLabel = await I.executeScript((liSelector) => {
        const li = document.querySelector(liSelector);
        const label = li.querySelector("label");
        return (
          label &&
          (label.innerText.includes("Category") ||
            label.innerText.includes("Topics"))
        );
      }, liSelector);

      if (hasCategoryLabel) {
        findMenuIndex.push(i);
      }
    }

    // Navigate all the links from Category and Topics sub menu
    for (let i = 0; i < findMenuIndex.length; i++) {
      const anchorLinksSelector = `.sidebar-filters > li:nth-child(${i}) a`;
      const anchorLinksCount = await I.grabNumberOfVisibleElements(
        anchorLinksSelector
      );
      for (let j = 1; j <= anchorLinksCount; j++) {
        const anchorLinkSelector = `.sidebar-filters > li:nth-child(${findMenuIndex[i]}) li:nth-child(${j}) a`;

        const name = await I.grabTextFrom(anchorLinkSelector);

        I.say(`Click ${name.trim()} menu`);
        I.click(anchorLinkSelector);

        await I.checkForDuplicateExpertsFromList();
        await I.checkCategoryFromSearchResult(name);
      }
    }
  }
);


