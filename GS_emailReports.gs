function generateReports(){
  return true
  
  var user = getUserInfo()
  var res = getData(user)
  var buyerAgents = getAllBAs()
  return getReportData(res.data, buyerAgents)
}

function test(){
  var adminInfo = getAdminInfo()
  var res = getData(adminInfo)
  var buyerAgents = getAllBAs()
  return getReportData(res.data, buyerAgents)
}

function getAdminInfo(){
  var adminInfo = {
    userName: 'Mike De Groot',
    userType: 'Admin',
    userEmail: 'mike.degroot@homie.com'
  }
  
  return adminInfo
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
  
  MailApp.sendEmail({
    // to: agent.email,
    to: 'mike.degroot@homie.com',
    subject: agent.name + ' Data', 
    htmlBody: (
      'Buyer Agent: ' + agent.name + '<br>' +
      'BA email: ' + agent.email + '<br>' +
      '<br>' +
      deadlinesHTML + '<br>' +
      '<br>' +
      stagesHTML
    )
  })
}

function getSoonDeadlines(data){
  var deadlinesHTML = filterDeadlines(data)
  
  return deadlinesHTML
}

function filterDeadlines(data){
  var html = (
    '<div>' +
      '' +
    '</div>'
  )
  
  html += displayDeadlines(data, 'dueDiligenceDate')
  html += displayDeadlines(data, 'financingDate')
  html += displayDeadlines(data, 'settlementDate')
  
  return html
}

function displayDeadlines(data, deadline){
  var daysOut = 3
  var today = Number(new Date())
  var soonTimeFrame = today + (1000 * 60 * 60 * 24 * daysOut)
  
  var html = (
    '<h3 style="margin: 0;">' + deadline + '</h3>'
  )
  
  var stageData = data.filter(function(a){
    var deadlineDate = Number(new Date(Number(a[deadline])))
    return (deadlineDate <= soonTimeFrame && deadlineDate > Number(new Date()))
  })
  
  stageData.forEach(function(a){
    html += (
      a.buyerName + ': ' + a[deadline] + '<br>'
    )
  })
  
  return (html += '<br>')
}

function filterStages(data){
  var html = (
    '<div>' +
      '' +
    '</div>'
  )
  
  html += displayStageData(data, 'UC')
  html += displayStageData(data, 'Touring')
  
  return html
}

function displayStageData(data, stage){
  var html = (
    '<h3 style="margin: 0;">' + stage + '</h3>'
  )
  
  var stageData = data.filter(function(a){
    return (a.stage == stage)
  })
  
  stageData.forEach(function(a){
    html += (
      a.buyerName + '<br>'
    )
  })
  
  return (html += '<br>')
}