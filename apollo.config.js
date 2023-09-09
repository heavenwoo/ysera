module.exports = {
  client: {
    service: {
      name: 'ysera',
      url: 'http://localhost:1001/graphql',
    },

    includes: ['apps/ysera/src/**/*.ts', 'libs/**/*.ts'],
    excludes: ['**/*.test.ts', '**/*.spec.ts', '**/*.stories.ts', '**/*.d.ts'],
  },
};
