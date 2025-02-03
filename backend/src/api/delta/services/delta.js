'use strict';

/**
 * delta service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::delta.delta');
