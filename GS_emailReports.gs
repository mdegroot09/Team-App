function generateReports(){
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
  buyerAgents.forEach(function(agent){
    var baData = data.filter(function(a){
      return (a.buyerAgent == buyerAgent.name)
    })
    
    // email current data to each ba
    emailReports(baData, agent)
  })
}

function emailReports(data, agent){
  var dataHTML = dataDisplay(data)
  
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

function dataDisplay(data){
  var html = ''
  data.forEach(function(a){
    html += (
      a.buyerName + '<br>' +
      a.stage + '<br>' +
      '<br>'
    )
  })
  return html
}