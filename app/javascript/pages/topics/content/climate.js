import monitorImage from 'pages/topics/assets/climate/cards/monitor.png';
import exploreImage from 'pages/topics/assets/climate/cards/explore.png';
import carbonImage from 'pages/topics/assets/climate/cards/carbon.png';
import calculateImage from 'pages/topics/assets/climate/cards/calculate.png';
import insightsImage from 'pages/topics/assets/climate/cards/insights.png';
import researchImage from 'pages/topics/assets/climate/cards/research.png';

export default {
  intro: {
    img: '',
    alt: '',
    title:
      'Forests can provide 30% of the solution needed to meet climate goals of staying below 2C of warming.',
    text:
      'Forests remove and store carbon from the atmosphere, representing cost-effective solution for mitigating climate change. The loss or degredation of forests compromises their ability to remove emissions.'
  },
  slides: [
    {
      title: 'Climate',
      subtitle: 'Pristine state',
      text:
        'Forests provide a natural solution for removing carbon from the atmosphere. Forests absorb and store carbon emissions caused by human activity, like burning fossil fuels, thus helping to remove harmful emissions from within the atmosphere and ocean.',
      src: 'climate1'
    },
    {
      title: 'Climate',
      subtitle: 'Drivers of change',
      text:
        'Forests ability to absorb carbon from the atmosphere can be compromised by commodity production, urbanization, disease and fires that cause forest loss. When a tree burns or decays, it emits the carbon it was storing into the atmosphere, futher exacerbating climate change.',
      src: 'climate2'
    },
    {
      title: 'Climate',
      subtitle: 'Compromised state',
      text:
        'With fewer trees to help absorb and regulate carbon in the atmopshere, the Earths temperate rises and the effects of climate change increase.',
      src: 'climate3'
    },
    {
      title: 'Climate',
      subtitle: 'Recovery state',
      text:
        'Sustainable forest management, improved land tenure, conservation, performance-based financing and restoration are all valuable strategies for preserving forests as a natural climate solution. These solutions also have positive economic, biodiversity, and societal impacts. Improvements in forest monitoring data and technology faciliate implementation of these solutions.',
      src: 'climate4'
    }
  ],
  cards: [
    {
      id: 'example',
      title: 'Card title',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet erat vitae sapien tempor viverra. Aenean id nisi mauris. Nunc ultricies, mauris elementum lobortis dictum.',
      extLink: '',
      image: monitorImage
    }
  ]
};
