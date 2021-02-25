import initSpecFile from '../utils/init-spec-file';

// All tests for widget. Each element collects similar tests which share a single spec key.
const testConfig = [
  {
    title: 'Validates header widget returns correct sentence',
    tests: [
      {
        slug: 'default',
        description:
          'when a country with no forest is selected (ATA) default sentence returns',
        visit: '/embed/sentence/country/ATA/',
        test: 'sentence',
        sentence:
          'In 2010, Antarctica had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest.',
      },
      {
        slug: 'indonesiaIso',
        description:
          'when Indonesia is selected correct sentence template returned',
        visit: '/embed/sentence/country/IDN',
        test: 'sentence',
        sentence:
          'In 2001, Indonesia had 1.03Gha of primary forest*, extending over 8.0% of its land area. In 2019, it lost 3.75Mha of primary forest*, equivalent to 1.84Gt of CO₂ of emissions.',
      },
      {
        slug: 'indonesiaAdm1',
        description:
          'when and admin 1 in Indonesia is selected correct sentence template returned',
        visit: '/embed/sentence/country/IDN/1',
        test: 'sentence',
        sentence:
          'In 2001, Aceh had 1.03Gha of primary forest*, extending over 8.0% of its land area. In 2019, it lost 3.75Mha of primary forest*, equivalent to 1.84Gt of CO₂ of emissions.',
      },
      {
        slug: 'indonesiaAdm2',
        description:
          'when an admin 2 in Indonesia is selected correct sentence template returned',
        visit: '/embed/sentence/country/IDN/1/1',
        test: 'sentence',
        sentence:
          'In 2001, Aceh Barat Daya had 1.03Gha of primary forest*, extending over 8.0% of its land area. In 2019, it lost 3.75Mha of primary forest*, equivalent to 1.84Gt of CO₂ of emissions.',
      },
      {
        slug: 'plantationsIso',
        description:
          'when country with plantations is selected correct sentence template returned',
        visit: '/embed/sentence/country/ESP',
        test: 'sentence',
        sentence:
          'In 2010, Spain had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'plantationsAdm1',
        description:
          'when admin 1 with plantations is selected correct sentence template returned',
        visit: '/embed/sentence/country/ESP/12',
        test: 'sentence',
        sentence:
          'In 2010, Galicia had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'plantationsAdm2',
        description:
          'when admin 2 with plantations is selected correct sentence template returned',
        visit: '/embed/sentence/country/ESP/12/1',
        test: 'sentence',
        sentence:
          'In 2010, A Coruña had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'plantationsTropicalIso',
        description:
          'when a tropical country with plantations is selected correct sentence template returned',
        visit: '/embed/sentence/country/MYS',
        test: 'sentence',
        sentence:
          'In 2010, Malaysia had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'plantationsTropicalAdm1',
        description:
          'when a tropical admin 1 with plantations is selected correct sentence template returned',
        visit: '/embed/sentence/country/MYS/14',
        test: 'sentence',
        sentence:
          'In 2010, Sarawak had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'plantationsTropicalAdm2',
        description:
          'when a tropical admin 2 with plantations is selected correct sentence template returned',
        visit: '/embed/sentence/country/MYS/14/31',
        test: 'sentence',
        sentence:
          'In 2010, Tatau had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'lossIso',
        description:
          'when country with tree cover loss is selected correct sentence template returned',
        visit: '/embed/sentence/country/GUY',
        test: 'sentence',
        sentence:
          'In 2010, Guyana had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'lossAdm1',
        description:
          'when admin 1 with tree cover loss is selected correct sentence template returned',
        visit: '/embed/sentence/country/GUY/2',
        test: 'sentence',
        sentence:
          'In 2010, Cuyuni-Mazaruni had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'lossAdm2',
        description:
          'when admin 2 with tree cover loss is selected correct sentence template returned',
        visit: '/embed/sentence/country/GUY/2/8',
        test: 'sentence',
        sentence:
          'In 2010, Rest of Region 7 had 3.79Gha of natural forest, extending over 30% of its land area. In 2019, it lost 22.5Mha of natural forest, equivalent to 6.03Gt of CO₂ of emissions.',
      },
      {
        slug: 'globalInitial',
        description:
          'when global tree cover loss is selected correct sentence template returned',
        visit: '/embed/sentence/global',
        test: 'sentence',
        sentence:
          'In 2010, the world had 3.92Gha of tree cover, extending over 30% of its land area. In 2019, it lost 24.2Mha of tree cover.',
      },
    ],
    spec: {
      test: (sheet) => {
        cy.visit(sheet.visit, {
          timeout: 100000,
          retryOnStatusCodeFailure: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000);
        cy.getTestById(sheet.test).should('have.text', sheet.sentence);
      },
    },
  },
];

// 4,4 MB

initSpecFile('Widgets spec', testConfig, true);
