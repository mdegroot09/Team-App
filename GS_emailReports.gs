function generateReports(){
  return
  
  var user = {
    userName: 'Mike De Groot',
    userType: 'Admin',
    userEmail: 'mike.degroot@homie.com'
  }
  var res = getData(user)
  var buyerAgents = getAllBAs()
  return getReportData(res.data, buyerAgents)
}

function getReportData(data, buyerAgents){
  // filter data for each ba
  buyerAgents.forEach(function(agent, i){
    var baData = data.filter(function(a){
      return (a.buyerAgent == agent.name)
    })
    
    // email current data to each ba
    if (i == 2){
      emailReports(baData, agent)
    }
  })
}

function emailReports(data, agent){
  var dataHTML = filterStages(data)
  
  MailApp.sendEmail({
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
  
  return html
}

function displayStageData(data, stage){
  var html = (
    '<h3>' + stage + '</h3>'
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