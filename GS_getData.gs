function getData(user){
  
  var referralURL = 'https://docs.google.com/spreadsheets/d/1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(referralURL)
  
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  var citiesZips = getCitiesZips(masterURL)
  
  var buyerNamesAll = ss.getSheetByName('Data').getRange('A4:A').getValues() // get every value from A4 down
  
  // Remove empty values
  var buyerNames = buyerNamesAll.filter(function(value){
    return value != ''
  })
  
  var count = buyerNames.length
  var buyersAll = ss.getSheetByName('Data').getRange('A4:AJ' + (count + 3)).getValues()
  
  var buyerData = buyersAll.map(function(buyer){
    return ({
      buyerName: buyer[0],
      dynamicsLink: buyer[1],
      toolsLink: buyer[2].split('?backPressed')[0],
      phone: buyer[3],
      email: buyer[4],
      listingAgent: buyer[5],
      stage: buyer[6],
      commission: buyer[7],
      source: buyer[8],
      expectedClose: Date.parse(buyer[9]).toString(),  
      buyerAgent: buyer[10],
      status: buyer[11],
      lossReason: buyer[12],
      // commissionDate: buyer[13],
      listingAgentManager: buyer[14],
      tags: buyer[15],
      month: buyer[16],
      year: buyer[17],
      monthYear: buyer[18],
      address: buyer[19],
      listedPrice: buyer[20],
      underContractDate: Date.parse(buyer[21]).toString(),
      dueDiligenceDate: Date.parse(buyer[22]).toString(),
      financingDate: Date.parse(buyer[23]).toString(),
      settlementDate: Date.parse(buyer[24]).toString(),
      closedDate: Date.parse(buyer[25]).toString(),
      dateCreated: Date.parse(buyer[26]).toString(),
      notes: buyer[27],
      lastUpdated: Date.parse(buyer[31]).toString(),
      commissionDate: Date.parse(buyer[32]).toString(),
      url: buyer[33],
      tab: buyer[34],
      row: buyer[35]
    })
  })
  
  // if userType is Listing Agent, filter for only their stuff
  if (user.userType == 'Listing Agent'){
    var buyerDataPerLA = buyerData.filter(function(buyer){
      return buyer.listingAgent == user.userName
    })
    return {data: buyerDataPerLA, citiesZips: citiesZips}
  }
  
  // if userType is Listing Agent, filter for only their stuff
  if (user.userType == 'Buyer Agent'){
    var buyerDataPerBA = buyerData.filter(function(buyer){
      return buyer.buyerAgent == user.userName
    })
    return {data: buyerDataPerBA, citiesZips: citiesZips}
  }
  
  // if userType is Admin, send everything
  else if (user.userType == 'Admin'){
    return {data: buyerData, citiesZips: citiesZips}
  }
  
  // if userType is Listing Admin, send referrals
  else if (user.userType == 'Listing Admin'){
    buyerData = buyerData.filter(function(buyer){
      return (
        buyer.listingAgent &&
        buyer.listingAgent != '' && 
        buyer.listingAgent != 'none' && 
        buyer.listingAgent != 'None' &&
        buyer.listingAgent != 'N/A'
      )
    })
    return {data: buyerData, citiesZips: citiesZips}
  }
  
  else {
    return {} 
  }
}

function getCitiesZips(url){
  var citiesZips = []
  var ss = SpreadsheetApp.openByUrl(url).getSheetByName('Utah Zip Codes')
  
  var cities = ss.getRange('A2:A').getValues()
  cities = cities.filter(function(val){
    return val != ''
  })
  
  var row
  cities.forEach(function(val, i){
    row = i + 2
    citiesZips.push({
      city: ss.getRange('A' + row).getValue(),
      zip: ss.getRange('B' + row).getValue()
    })
  })
  
  return citiesZips
}

function getListingAgents(){
  // give editing access to master sheet
  var url = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  
  var ss = SpreadsheetApp.openByUrl(url).getSheetByName('Setting')
  var listingAgents = ss.getRange('A4:A').getValues()
  
  // filter out blank rows
  listingAgents = listingAgents.filter(function(agent){
    return agent != '' && agent != 'None'
  })
  
  listingAgents.sort()
  listingAgents.splice(0,0,'None')
  
  return listingAgents
}

function getUserInfo(){
  var url = 'https://docs.google.com/spreadsheets/d/1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(url)
  var userEmail = Session.getActiveUser().getEmail()
  var row = -1
    
  var emailsAll = ss.getSheetByName('Users').getRange('B:B').getValues()
  var emailsArr = emailsAll.filter(function(e,i){
    if (e == userEmail){
      row = i + 1
    }
    return e == userEmail
  })
  
  updateLastLogin(url, row)
  var userName = ss.getSheetByName('Users').getRange(row, 1).getValue()
  var userType = ss.getSheetByName('Users').getRange(row, 3).getValue()
  
  var listingAgents = getListingAgents()
  
  return {
    user: {
      userName: userName,
      userType: userType,
      userEmail: userEmail
    },
    listingAgents: listingAgents
  }
}

function updateLastLogin(url, row){
  var ss = SpreadsheetApp.openByUrl(url)
  
  // update last login
  ss.getSheetByName('Users').getRange('E' + row).setValue('=NOW()')
  ss.getSheetByName('Users').getRange('E' + row).setNumberFormat('m"/"d" "h":"mma/p')
  var date = ss.getSheetByName('Users').getRange('E' + row).getValue()
  ss.getSheetByName('Users').getRange('E' + row).setValue(date)
  
  // update login count
  var count = ss.getSheetByName('Users').getRange('F' + row).getValue()
  if (Session.getActiveUser().getEmail() == 'mike.degroot@homie.com'){
    count = 9
  }
  ss.getSheetByName('Users').getRange('F' + row).setValue(count + 1)
}

function getLeaderboard(){
  // give editing access to master sheet
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  
  var ss = SpreadsheetApp.openByUrl(masterURL).getSheetByName('Dashboard')
  
  // get count of listing agents who've submitted referrals
  var submitLeaders = ss.getRange('B44:B68').getValues()
  var submitCount = submitLeaders.filter(function(agent){
    return agent
  }).length
  
  // add each listing agent to object with total referral count
  var totalLeaders = {}
  for (var i = 44; i < (submitCount + 44); i++){
    var name = ss.getRange('B' + i).getValue()
    totalLeaders[name] = ss.getRange('C' + i).getValue()
  }
  
  // get count of seller > buyer referrers
  var sellerLeaders = ss.getRange('B24:B38').getValues()
  var totalLeaders = sellerLeaders.filter(function(val){
    return val != ''
  }).length
  
  // compile seller > buyer pct for each referrer
  var leaders = []
  var count
  for (var i = 24; i < (totalLeaders + 24); i++){
    name = ss.getRange('B' + i).getValue()
    count = ss.getRange('C' + i).getValue() * 1

    leaders.push({
      name: name,
      count: count
    })
  }
  
  // sort referrers based on count
  leaders.sort(compare)
  
  return leaders
}

function compare(a, b) {
  // sort based on distance
  var distA = a.pct
  var distB = b.pct

  var comparison = 0;
  if (distA < distB) {
    comparison = 1;
  } else if (distA > distB) {
    comparison = -1;
  }
  return comparison;
}