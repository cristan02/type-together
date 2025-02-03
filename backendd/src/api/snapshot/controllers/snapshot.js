'use strict';

/**
 * snapshot controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::snapshot.snapshot');
