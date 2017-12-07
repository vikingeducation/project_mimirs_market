'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('States', [
      { "name": "Alabama" },
      { "name": "Alaska" },
      { "name": "Arizona" },
      { "name": "Arkansas" },
      { "name": "California" },
      { "name": "Colorado" },
      { "name": "Connecticut" },
      { "name": "Delaware" },
      { "name": "Florida" },
      { "name": "Georgia" },
      { "name": "Hawaii" },
      { "name": "Idaho" },
      { "name": "Illinois" },
      { "name": "Indiana" },
      { "name": "Iowa" },
      { "name": "Kansas" },
      { "name": "Kentucky" },
      { "name": "Louisiana" },
      { "name": "Maine" },
      { "name": "Maryland" },
      { "name": "Massachusetts" },
      { "name": "Michigan" },
      { "name": "Minnesota" },
      { "name": "Mississippi" },
      { "name": "Missouri" },
      { "name": "Montana" },
      { "name": "Nebraska" },
      { "name": "Nevada" },
      { "name": "New Hampshire" },
      { "name": "New Jersey" },
      { "name": "New Mexico" },
      { "name": "New York" },
      { "name": "North Carolina" },
      { "name": "North Dakota" },
      { "name": "Ohio" },
      { "name": "Oklahoma" },
      { "name": "Oregon" },
      { "name": "Pennsylvania" },
      { "name": "Rhode Island" },
      { "name": "South Carolina" },
      { "name": "South Dakota" },
      { "name": "Tennessee" },
      { "name": "Texas" },
      { "name": "Utah" },
      { "name": "Vermont" },
      { "name": "Virginia" },
      { "name": "Washington" },
      { "name": "West Virginia" },
      { "name": "Wisconsin" },
      { "name": "Wyoming" },
      { "name": "American Samoa" },
      { "name": "Guam" },
      { "name": "Northern Mariana Islands" },
      { "name": "Puerto Rico" },
      { "name": "United States Minor Outlying Islands" },
      { "name": "Virgin Islands" }
    ]);
    
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('States', null, {}, model.State);
    
  }
};
