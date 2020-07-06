function runReports(){
  var isTest = false
  generateReports(isTest)
}

function runTest(){
  var isTest = true
  generateReports(isTest)
}

function generateReports(isTest){
  // quit if weekend
  let d = new Date().getDay()
  if (d == 6 || d == 0){return}
  
  var adminInfo = getAdminInfo()
  var res = getData(adminInfo)
  var buyerAgents = getAllBAs()
  return getReportData(res.data, buyerAgents, isTest)
}

function getAdminInfo(){
  return ({
    userName: 'Mike De Groot',
    userType: 'Admin',
    userEmail: 'mike.degroot@homie.com'
  })
}

function getReportData(data, buyerAgents, isTest){
  // filter data for each ba
  buyerAgents.forEach(function(agent, i){
    var baData = data.filter(function(a){
      return (a.buyerAgent == agent.name)
    })
    
    // email current data to each ba (or admin if isTest)
    if ((!isTest || i == 2) && !agent.name.includes('Eric')){ 
      emailReports(baData, agent, isTest)
    }
  })
}

function emailReports(data, agent, isTest){
  var deadlinesHTML = getSoonDeadlines(data)
  var stagesHTML = filterStages(data)
  var cmsBtn = getCmsBtn(agent)
  var email = isTest ? 'mike.degroot@homie.com' : agent.email
  
  MailApp.sendEmail({
    // to: 'mike.degroot@homie.com',
    to: email,
    subject: 'CMS Daily Update', 
    htmlBody: (
      agent.name.split(' ')[0] + ',<br>' +
      '<br>' +
      'Here\'s a brief summary of your CMS:  <br>' +
      deadlinesHTML +
      stagesHTML +
      'Please update your CMS as needed. <br>' +
      '<br>' +
      'Thanks, <br>' +
      'Cole and Mike' +
      cmsBtn 
    )
  })
}

function getSoonDeadlines(data){
  var daysOut = 3
  var html = '<h2>Deadlines (next ' + daysOut + ' days)</h2>'
 
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
      var shortDate = getShortDate(deadlineDate)
      
      // if deadline is today, make red
      var color = (deadlineDate == today ? 'red' : 'black')
      
      html += '<div style="color: ' + color + '">' + String(a.buyerName).trim() + ': ' + shortDate + '</div>'
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

function getShortDate(d){
  var mm = new Date(d).getMonth() + 1
  var dd = new Date(d).getDate()
  
  return mm + '/' + dd
}

function filterStages(data){
  var html = '<h2>Stages</h2>'
  
  html += displayStageData(data, 'UC')
  html += displayStageData(data, 'Touring')
  
  return html
}

function displayStageData(data, stage){
  var stageHTML = (stage == 'UC' ? 'UC (w/ next deadline)' : 'Touring (w/ last update)')
  var html = '<div style="font-weight: 600; margin: 0;">' + stageHTML + '</div>'
  
  var stageData = data.filter(function(a){
    return (a.stage == stage)
  })
  
  stageData.forEach(function(a){
    var deadline 
    
    // show next deadline for UC
    if (a.stage == 'UC'){
      deadline = getNextDeadline(a)
    }
    
    // show last updated for Touring
    else {
      deadline = getShortDate(Number(a.lastUpdated))
    }
    
    html += '<div>' + a.buyerName + ' - ' + deadline + '</div>'
  })
  
  return (html += '<br>')
}

function getNextDeadline(buyer){
  var dueDiligenceDate = convertDateToNum(new Date(Number(buyer.dueDiligenceDate)))
  var financingDate = convertDateToNum(new Date(Number(buyer.financingDate)))
  var settlementDate = convertDateToNum(new Date(Number(buyer.settlementDate)))
  var today = convertDateToNum(new Date())
  
  var shortDate
  var nextDeadline = {}
  
  if ((dueDiligenceDate ? dueDiligenceDate >= today : false) && (financingDate ? dueDiligenceDate <= financingDate : true)){
    shortDate = getShortDate(dueDiligenceDate)
    
    nextDeadline.type = 'Due Diligence'
    nextDeadline.date = shortDate
  }
  else if ((financingDate ? financingDate >= today : false) && financingDate <= settlementDate){
    shortDate = getShortDate(financingDate)
    
    nextDeadline.type = 'F&A'
    nextDeadline.date = shortDate
  }
  else if (settlementDate){
    shortDate = getShortDate(settlementDate)
    
    nextDeadline.type = 'Settlement'
    nextDeadline.date = shortDate
  }
  else {
    return '<span style="color: red">Missing/invalid date(s)<span>'
  }
  
  return (nextDeadline.type + ' ' + nextDeadline.date)
}

function getCmsBtn(agent){
  return '<a style="display: none;" href="' + agent.url + '">Open My CMS</a>'
}