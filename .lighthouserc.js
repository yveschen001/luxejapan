module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/luxejapan-public/',
        'http://localhost:4173/luxejapan-public/zh-tw/',
        'http://localhost:4173/luxejapan-public/en/'
      ],
      startServerCommand: 'npm run preview',
      numberOfRuns: 1,
      healthcheck: 'http://localhost:4173/luxejapan-public/'
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
} 