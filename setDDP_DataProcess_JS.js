load("nashorn:mozilla_compat.js");
importClass(com.boomi.execution.ExecutionUtil);
importClass(java.util.Properties);
importClass(java.io.ByteArrayInputStream);
importClass(java.io.BufferedInputStream);
importClass(java.io.ByteArrayOutputStream);
importClass(java.util.regex.Matcher);
importClass(java.util.regex.Pattern);

function InputStreamToString(is) {
    var bis = new BufferedInputStream(is);
    var buf = new ByteArrayOutputStream();
    var result = bis.read();
    
    for (var k = 0; k <= 1024; k++) {
        buf.write(result);
        result = bis.read();
    }
    return buf.toString("UTF-8");
}

function getXMLValue(tagName, inputString) {
    var regEx = "<"+tagName+">(.+?)<\/"+tagName+">";
    var pattern = Pattern.compile(regEx);
    var matcher = pattern.matcher(inputString);
    var xmlValue;
    if(matcher.find()) {
        xmlValue = matcher.group(1);
    }
    return xmlValue;
}

for( var i = 0; i < dataContext.getDataCount(); i++ ) {
    var is = dataContext.getStream(i);
    var props = new Properties();
    var str = InputStreamToString(is);
	
    var CIMTYP = getXMLValue("CIMTYP", str);
	var MESTYP = getXMLValue("MESTYP", str);
	var RCVPRN = getXMLValue("RCVPRN", str);
	var DOCNUM = getXMLValue("DOCNUM", str);
	var MSG_TYPE;
	
	if(CIMTYP !== null) {
		MSG_TYPE = CIMTYP+"-"+MESTYP;
	}
	else {
		MSG_TYPE = MESTYP;
	}
	
	props.setProperty("document.dynamic.userdefined.DDP_MSG_TYPE", MSG_TYPE);
    props.setProperty("document.dynamic.userdefined.DDP_IDOC_NUMBER", DOCNUM);
    props.setProperty("document.dynamic.userdefined.DDP_RCVPRN", RCVPRN);
	
    dataContext.storeStream(dataContext.getStream(i), props);
}
