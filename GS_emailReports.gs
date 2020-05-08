function generateReports(){
  return true
  
  // quit if weekend
  let d = new Date().getDay()
  if (d == 6 || d == 0){return}
  
  var adminInfo = getAdminInfo()
  var res = getData(adminInfo)
  var buyerAgents = getAllBAs()
  return getReportData(res.data, buyerAgents)
}

function test(){
  // quit if weekend
  let d = new Date().getDay()
  if (d == 6 || d == 0){return}
  
  var adminInfo = getAdminInfo()
  var res = getData(adminInfo)
  var buyerAgents = getAllBAs()
  return getReportData(res.data, buyerAgents)
}

function getAdminInfo(){
  return ({
    userName: 'Mike De Groot',
    userType: 'Admin',
    userEmail: 'mike.degroot@homie.com'
  })
}

function getReportData(data, buyerAgents){
  // filter data for each ba
  buyerAgents.forEach(function(agent, i){
    var baData = data.filter(function(a){
      return (a.buyerAgent == agent.name)
    })
    
    // email current data to each ba
    if (i == 2){ // *** REMOVE LINE ***
      emailReports(baData, agent)
    }
  })
}

function emailReports(data, agent){
  var deadlinesHTML = getSoonDeadlines(data)
  var stagesHTML = filterStages(data)
  var cmsBtn = getCmsBtn(agent)
  
  MailApp.sendEmail({
    // to: agent.email,
    to: 'mike.degroot@homie.com',
    subject: 'CMS Daily Update', 
    htmlBody: (
      agent.name.split(' ')[0] + ',<br>' +
      '<br>' +
      'Here\'s a brief summary of your current CMS:  <br>' +
      deadlinesHTML +
      stagesHTML +
      'Please update your attached CMS as needed. <br>' +
      '<br>' +
      'Thanks, <br>' +
      'Cole and Mike' +
      cmsBtn 
    )
  })
}

function getSoonDeadlines(data){
  var deadlinesHTML = filterDeadlines(data)
  
  return deadlinesHTML
}

function filterDeadlines(data){
  var daysOut = 3
  var html = '<h2>Deadlines (Next ' + daysOut + ' days)</h2>'
 
  html += displayDeadlines(data, 'dueDiligenceDate', 'Due Diligence', daysOut)
  html += displayDeadlines(data, 'financingDate', 'F&A', daysOut)
  html += displayDeadlines(data, 'settlementDate', 'Settlement', daysOut)
  
  return html
}

function displayDeadlines(data, deadline, title, daysOut){
  var today = convertDateToNum(new Date())
  var soonTimeFrame = today + (1000 * 60 * 60 * 24 * daysOut)
  
  var html = '<div style="font-weight: 600; margin: 0;">' + title + '</div>'
  
  var deadlineData = data.filter(function(a){
    var deadlineDate = convertDateToNum(new Date(Number(a[deadline])))
    return (deadlineDate <= soonTimeFrame && deadlineDate >= today)
  })
  
  if (deadlineData.length > 0){
    deadlineData.forEach(function(a){
      var deadlineDate = convertDateToNum(new Date(Number(a[deadline])))
      var mm = new Date(deadlineDate).getMonth() + 1
      var dd = new Date(deadlineDate).getDate()
      
      // if deadline is today, make red
      var color = (deadlineDate == today ? 'red' : 'black')
      
      html += '<div style="color: ' + color + '">' + a.buyerName + ': ' + mm + '/' + dd + '</div>'
    })
  }
  else {
    html += '<div>-</div>'
  }
  
  return (html += '<br>')
}

function convertDateToNum(d){
  // get and return begginning of day timestamp
  var mm = d.getMonth() + 1
  var dd = d.getDate()
  var yyyy = d.getFullYear()
  var startOfDay = new Date(mm + '/' + dd + '/' + yyyy)
  return Number(startOfDay)
}

function filterStages(data){
  var html = '<h2>Stages</h2>'
  
  html += displayStageData(data, 'UC')
  html += displayStageData(data, 'Touring')
  
  return html
}

function displayStageData(data, stage){
  var html = (
    '<div style="font-weight: 600; margin: 0;">' + stage + '</div>'
  )
  
  var stageData = data.filter(function(a){
    return (a.stage == stage)
  })
  
  stageData.forEach(function(a){
    html += '<div>' + a.buyerName + '</div>'
  })
  
  return (html += '<br>')
}

function getCmsBtn(agent){
  return '<a style="display: none;" href="' + agent.url + '">Open My CMS</a>'
}