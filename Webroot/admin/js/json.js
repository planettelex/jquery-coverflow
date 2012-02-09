/*
 * Copyright (c) 2012 Planet Telex Inc. all rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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