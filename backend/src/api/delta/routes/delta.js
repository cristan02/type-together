'use strict';

/**
 * delta router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::delta.delta');
