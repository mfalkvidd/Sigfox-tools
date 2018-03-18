function doGet(e){
  return parseData(e.parameter);
}

function doPost(e) {
  //var jsonString = r.postData.getDataAsString();
  //var parametersObject = JSON.parse(jsonString);
  //var parametersObject = JSON.parse(r.postData.contents);
  //var json = e.postData.contents;
  //var data = JSON.parse(json);
  //return ContentService.createTextOutput("Data " + json);
  if(typeof e === 'undefined'){
    return HtmlService.createHtmlOutput("No input!");
  }
  var parametersObject = JSON.parse(e.postData.contents);
  return parseData(parametersObject);
}

  function parseData(parametersObject){
  var debugText = "";
  
  // Don't store initialization messages (data==434f4e46494704)
  if(typeof parametersObject["data"] === undefined || parametersObject["data"]=="434f4e46494704"){
    return HtmlService.createHtmlOutput("Not storing initialization message");
  }
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var deviceId = parametersObject["device"];
  var reportTime = Number(parametersObject["time"]);
  var lastReportTime = Number(scriptProperties.getProperty(deviceId + "_lastReportTime"));
  if(lastReportTime===0) lastReportTime = reportTime; // If this is the first report, set last report time to now
  var lastCounter1 = Number(scriptProperties.getProperty(deviceId + "_lastCounter1"));
  var counter1 = Number(parametersObject["Pulse_count_1"]);
  var isRunning1 = counter1 > lastCounter1;
  var timeSinceLastReport = (reportTime - lastReportTime);
  
  var lastRunningHours1 = Number(scriptProperties.getProperty(deviceId + "_lastRunningHours1"));
  if(isNaN(lastRunningHours1)) lastRunningHours1 = 0;
  var runningHours1 = lastRunningHours1;
  if(isRunning1) runningHours1 += (timeSinceLastReport / 3600);
  var rotationsSinceLastReport1 = counter1 - lastCounter1;
  var rotationsPerMin1 = 0;
  if(timeSinceLastReport > 0){
    // Avoid divide by zero
    rotationsPerMin1 = rotationsSinceLastReport1 / timeSinceLastReport * 60; // Times 60 to get rotations per minute which is more intuitive
  }
  
  var payload = 
      {
        "time": reportTime,
        "device": deviceId,
        "snr": parametersObject["snr"],
        "station": parametersObject["station"],
        "data": parametersObject["data"],
        "avgSnr": parametersObject["avgSnr"],
        "lat": parametersObject["lat"],
        "lng": parametersObject["lng"],
        "rssi": parametersObject["rssi"],
        "seqNumber": parametersObject["seqNumber"],
        "Device_Type": parametersObject["Device_Type"],
        "Pulse_count_1": counter1,
        "Pulse_count_2": 0,
        "Battery_OK": parametersObject["Battery_OK"],
        "Wear_sensor_alarm": parametersObject["Wear_sensor_alarm"],
        "isRunning1" : isRunning1,
        "runningHours1" : runningHours1,
        "rotationSpeed1" : rotationsPerMin1
      }
  
  var tbUrl = "<YOUR-TB-GATEWAY-URL>"
  var headers = {
    "Authorization" : "Basic <YOUR-BASIC-AUTH>"
  };
  
  var options =
      {
        "method"  : "POST",
        'contentType': 'application/json',
        "headers" : headers,
        "payload" : JSON.stringify(payload),
        "followRedirects" : true,
        "muteHttpExceptions": true
      };
  
  var result = UrlFetchApp.fetch(tbUrl, options);
  
  if (result.getResponseCode() != 200) {  
    return HtmlService.createHtmlOutput("PL" + payload + result.getResponseCode() + "\nTB CALL ContentText:" + result.getContentText());
  }
  
  scriptProperties.setProperty(deviceId + "_lastReportTime", reportTime.valueOf());
  scriptProperties.setProperty(deviceId + "_lastCounter1", counter1.valueOf());
  scriptProperties.setProperty(deviceId + "_lastRunningHours1", runningHours1.valueOf());
  return HtmlService.createHtmlOutput("reportTime=" + reportTime + "\n" + "lastReportTime=" + lastReportTime + "\n"+
                                         "timeSinceLastReport="+timeSinceLastReport+"\n"+"lastRunningHours1="+lastRunningHours1+"\n"+
                                         "runningHours1="+runningHours1+"\n" +
                                         "getProperty=" + scriptProperties.getProperty(deviceId + "_lastReportTime") +"\n"+
                                         "Number=" + Number(scriptProperties.getProperty(deviceId + "_lastReportTime")) + "\n" +
                                         "isNan=" + isNaN(parseInt(scriptProperties.getProperty(deviceId + "_lastReportTime")))+"\n");
  
}

function clearStore(){
  PropertiesService.getScriptProperties().deleteAllProperties();
}

function testPOST() {
  
  var url = ScriptApp.getService().getUrl();
  
  var payload =
      {
        "time": 1515939940,
        "device": "E2222",
        "duplicate": "false",
        "displayName": "Not installed",
        "snr": 81.48,
        "station": "94D8",
        "data": "04210100000000000000bb",
        "avgSnr": 88.89,
        "lat": 57.0881234,
        "lng": 17.1065432,
        "rssi": -62.00,
        "seqNumber": 1263,
        "Device_Type": "4",
        "Pulse_count_1": 1,
        "Pulse_count_2": 0,
        "Battery_OK": "true",
        "Wear_sensor_alarm": "true"
      };
  
  var options =
      {
        "method"  : "POST",
        'contentType': 'application/json',
        "payload" : payload,   
        "followRedirects" : true,
        "muteHttpExceptions": true
      };
  
  var result = UrlFetchApp.fetch(url, options);
  Logger.log("Got: " + result.getResponseCode());
  if (result.getResponseCode() == 200) {
    Logger.log("ContentText:" + result.getContentText());
    //Logger.log("JSON: " + JSON.parse(result.getContentText()));
  }
  
}
