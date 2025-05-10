module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/luxejapan-public/'
      ],
      startServerCommand: 'npm run preview -- --port 4173 --host 0.0.0.0 --strictPort',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 60000,
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