function getBuyerAgent(city, buyerZip){
  var radius = 20
  
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(masterURL).getSheetByName('Agent Data')
  var name, email, city, zip, lastReceived, sevenDayTotal, thirtyDayTotal, available, url
  var buyerAgentsAll = getAllBAs()
  
  var agents = filterSortAgents(buyerAgentsAll, buyerZip, radius)
  
  // if no agents found, send error
  if (!agents[0]){
    return '' 
  }
  
  // otherwise send agent info
  else {
    return {
      name: agents[0].name,
      email: agents[0].email,
      url: agents[0].url
    }
  }
}

function filterSortAgents(buyerAgentsAll, buyerZip, radius){
  // remove agents who are unavailable 
  var buyerAgents = buyerAgentsAll.filter(function(agent){
    return agent.available
  })
  
  // get distance from buyerZip for each agent
  for (var i = 0; i < buyerAgents.length; i++){
    buyerAgents[i].distance = zipIt(buyerZip, buyerAgents[i].zip)
  }
  
  // remove agents outside the radius
  buyerAgents = buyerAgents.filter(function(agent){
    return agent.distance <= radius
  })
  
  // sort first by lastReceived then by 7-day total
  buyerAgents.sort(compareDate)
  buyerAgents.sort(compareTotal)
  
  return buyerAgents
}

function distSortAgents(buyerAgentsAll, buyerZip){
  // remove agents who are unavailable 
  var buyerAgents = buyerAgentsAll.filter(function(agent){
    return agent
  })
  
  // get distance from buyerZip for each agent
  for (var i = 0; i < buyerAgents.length; i++){
    buyerAgents[i].distance = zipIt(buyerZip, buyerAgents[i].zip)
  }
  
  // sort first by lastReceived then by 7-day total
  buyerAgents.sort(compareDate)
  buyerAgents.sort(compareTotal)
  
  return buyerAgents 
}

function compareDate(a, b) {
  // sort based on distance
  var distA = a.lastReceived
  var distB = b.lastReceived

  var comparison = 0;
  if (distA > distB) {
    comparison = 1;
  } else if (distA < distB) {
    comparison = -1;
  }
  return comparison;
}

function compareTotal(a, b) {
  // sort based on distance
  var distA = a.sevenDayTotal
  var distB = b.sevenDayTotal

  var comparison = 0;
  if (distA > distB) {
    comparison = 1;
  } else if (distA < distB) {
    comparison = -1;
  }
  return comparison;
}

function getAllBAs(){
  // give editing access to master sheet
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(masterURL).getSheetByName('Agent Data')
  
  var name, email, city, zip, lastReceived, sevenDayTotal, thirtyDayTotal, available, url
  var buyerAgentsAll = []
  var agentsCount = ss.getRange('A2:A').getValues().filter(function(cell){
    return cell != ''
  }).length
  
  for (var i = 2; i < agentsCount + 2; i++){
    name = ss.getRange('A' + i).getValue()
    email = ss.getRange('B' + i).getValue()
    city = ss.getRange('C' + i).getValue()
    zip = ss.getRange('D' + i).getValue()
    lastReceived = ss.getRange('E' + i).getValue()
    sevenDayTotal = ss.getRange('F' + i).getValue()
    thirtyDayTotal = ss.getRange('G' + i).getValue()
    url = ss.getRange('H' + i).getValue()
    available = true
    
    // convert lastReceived to date
    if (lastReceived){
      lastReceived = Number(new Date(lastReceived))
    }
    
    // assign as unavailable if applicable
    if (ss.getRange('A' + i).getBackground() == '#f4cccc'){
      available = false
    }
    
    buyerAgentsAll.push({
      name: name,
      email: email,
      city: city,
      zip: zip,
      lastReceived: lastReceived,
      sevenDayTotal: sevenDayTotal,
      thirtyDayTotal: thirtyDayTotal,
      url: url,
      available: available
    })
  }
  
  return buyerAgentsAll
}