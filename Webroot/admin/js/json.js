function formatJson(jsonString) {
    var tempChar;
    var pos = 0;
    var onKey = false;
    var str = jsonString;
    var strLen = str.length;
    var indentStr = '    ';
    var newLine = '\r\n';
    var returnVal = '';

    for (var index = 0; index < strLen; index++) {
        tempChar = str.substring(index, index + 1);
        if (tempChar == ':') {
            onKey = false;
            tempChar = ": ";
        }
        if (tempChar == '}' || tempChar == ']') {
            onKey = true;
            returnVal += newLine;
            pos = pos - 1;
            for (var j = 0; j < pos; j++)
                returnVal += indentStr;
        }
        if (!(tempChar == '"' && onKey)) {
            returnVal += tempChar;
        }
        if (tempChar == '{' || tempChar == '[' || tempChar == ',') {
            onKey = true;
            returnVal += newLine;
            if (tempChar == '{' || tempChar == '[')
                pos = pos + 1;
            for (var k = 0; k < pos; k++)
                returnVal += indentStr;
        }
    }
    return returnVal;
}