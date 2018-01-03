function doGet(e) {
  var params = JSON.stringify(e);
  var parametersObject = JSON.parse(params);
  
  var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/YOUR-SPREADSHEET-ID/edit');
  
  var settings = ss.getRange("Settings!1:3").getDisplayValues();
  var columnParams = settings[0]; // Row 1 contains the parameter names
  var columnPrefixes = settings[1]; // Row 2 contains prefixes
  var columnSuffixes = settings[2]; // Row 3 contains suffixes
  var num_columns = columnParams.length;
  var sheetRow = new Array(num_columns);
  
  for (var i = 0; i < num_columns; i++) {
    var param = columnParams[i];
    if(!param) break; // If the parameter is empty, we've reached the last parameter to include. Stop the loop.
    var data = "";
    if(param!="NODATA"){
      data = parametersObject.parameters[param][0];
    }
    sheetRow[i] = columnPrefixes[i]+data+columnSuffixes[i];
  } 
  ss.getSheets()[0].appendRow(sheetRow);
  
  return HtmlService.createHtmlOutput(ss.getName()+ ' ' + params);
  
}

// https://script.google.com/macros/s/THIS-SCRIPT-ID/dev?time={time}&device={device}&lat={lat}&lng={lng}&duplicate={duplicate}&snr={snr}&station={station}&data={data}&avgSnr={avgSnr}&rssi={rssi}&seqNumber={seqNumber}&Device_Type={customData.Device_Type}&Firmware_Version_Battery_status_byte=empty&Pulse_count_1={customData.Pulse_count_1}&Pulse_count_2={customData.Pulse_count_2}&Pulse_status_byte=empty&Battery_OK={customData.Battery_OK}&Firmware_version={customData.Firmware_version}&Counter_1_Direction={customData.Counter_1_Direction}&Counter_1_Tamper={customData.Counter_1_Tamper}&Counter_1_Spare={customData.Counter_1_Spare}&Counter_1_Contact={customData.Counter_1_Contact}&Counter_2_Direction={customData.Counter_2_Direction}&Counter_2_Tamper={customData.Counter_2_Tamper}&Counter_2_Spare={customData.Counter_2_Spare}&Counter_2_Contact={customData.Counter_2_Contact}
