'use strict';

/**
 * delta controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::delta.delta');
