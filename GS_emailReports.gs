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
  var dataHTML = filterStages(data)
  
  MailApp.sendEmail({
    // to: agent.email,
    to: 'mike.degroot@homie.com',
    subject: agent.name + ' Data', 
    htmlBody: (
      'Buyer Agent: ' + agent.name + '<br>' +
      'BA email: ' + agent.email + '<br>' +
      '<br>' +
      dataHTML
    )
  })
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
      a.buyerName + ': ' + a.stage + '<br>'
    )
  })
  
  return (html += '<br>')
}