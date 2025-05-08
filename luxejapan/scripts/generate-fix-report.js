const fs = require('fs')
const path = require('path')

// 读取日志文件
const logFile = path.join(__dirname, '../cypress/logs/accessibility.log')
const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean)

// 分析日志
const issues = logs.reduce((acc, log) => {
  const [timestamp, issue] = log.split(' - ')
  const date = new Date(timestamp).toLocaleDateString()
  
  if (!acc[date]) {
    acc[date] = []
  }
  
  acc[date].push(issue)
  return acc
}, {})

// 生成报告
const report = {
  summary: {
    total: logs.length,
    dates: Object.keys(issues).length,
    types: {
      accessibility: logs.filter(log => log.includes('accessibility')).length,
      performance: logs.filter(log => log.includes('performance')).length,
      image: logs.filter(log => log.includes('image')).length
    }
  },
  details: issues
}

// 保存报告
const reportFile = path.join(__dirname, '../cypress/reports/fix-report.json')
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))

// 生成 HTML 报告
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Auto Fix Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    .summary { background: #f5f5f5; padding: 1rem; border-radius: 4px; }
    .details { margin-top: 2rem; }
    .date { margin-top: 1rem; font-weight: bold; }
    .issue { margin-left: 1rem; color: #666; }
  </style>
</head>
<body>
  <h1>Auto Fix Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>Total issues fixed: ${report.summary.total}</p>
    <p>Days with fixes: ${report.summary.dates}</p>
    <p>Types of fixes:</p>
    <ul>
      <li>Accessibility: ${report.summary.types.accessibility}</li>
      <li>Performance: ${report.summary.types.performance}</li>
      <li>Image optimization: ${report.summary.types.image}</li>
    </ul>
  </div>

  <div class="details">
    <h2>Details</h2>
    ${Object.entries(report.details)
      .map(([date, issues]) => `
        <div class="date">${date}</div>
        ${issues.map(issue => `<div class="issue">${issue}</div>`).join('')}
      `).join('')}
  </div>
</body>
</html>
`

const htmlReportFile = path.join(__dirname, '../cypress/reports/fix-report.html')
fs.writeFileSync(htmlReportFile, html)

console.log('报告已生成：')
console.log('- JSON:', reportFile)
console.log('- HTML:', htmlReportFile) 