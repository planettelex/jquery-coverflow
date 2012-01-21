
var PageName = 'Home';
var PageId = 'd12b0c016cd949a6bf4c007c9e6154ae'
var PageUrl = 'Home.html'
document.title = 'Home';
var PageNotes = 
{
"pageName":"Home",
"showNotesNames":"False"}
var $OnLoadVariable = '';

var $CSUM;

var hasQuery = false;
var query = window.location.hash.substring(1);
if (query.length > 0) hasQuery = true;
var vars = query.split("&");
for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0].length > 0) eval("$" + pair[0] + " = decodeURIComponent(pair[1]);");
} 

if (hasQuery && $CSUM != 1) {
alert('Prototype Warning: The variable values were too long to pass to this page.\nIf you are using IE, using Firefox will support more data.');
}

function GetQuerystring() {
    return '#OnLoadVariable=' + encodeURIComponent($OnLoadVariable) + '&CSUM=1';
}

function PopulateVariables(value) {
    var d = new Date();
  value = value.replace(/\[\[OnLoadVariable\]\]/g, $OnLoadVariable);
  value = value.replace(/\[\[PageName\]\]/g, PageName);
  value = value.replace(/\[\[GenDay\]\]/g, '20');
  value = value.replace(/\[\[GenMonth\]\]/g, '1');
  value = value.replace(/\[\[GenMonthName\]\]/g, 'January');
  value = value.replace(/\[\[GenDayOfWeek\]\]/g, 'Friday');
  value = value.replace(/\[\[GenYear\]\]/g, '2012');
  value = value.replace(/\[\[Day\]\]/g, d.getDate());
  value = value.replace(/\[\[Month\]\]/g, d.getMonth() + 1);
  value = value.replace(/\[\[MonthName\]\]/g, GetMonthString(d.getMonth()));
  value = value.replace(/\[\[DayOfWeek\]\]/g, GetDayString(d.getDay()));
  value = value.replace(/\[\[Year\]\]/g, d.getFullYear());
  return value;
}

function OnLoad(e) {

}

var u115 = document.getElementById('u115');
gv_vAlignTable['u115'] = 'top';
var u122 = document.getElementById('u122');

var u21 = document.getElementById('u21');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u21ann'), "<div id='u21Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u21Note').click(function(e) { ToggleWorkflow(e, 'u21', 300, 150, false); return false; });
var u21Ann = 
{
"label":"?",
"Description":"Upper bound the image count."};

var u137 = document.getElementById('u137');

var u32 = document.getElementById('u32');

var u156 = document.getElementById('u156');
gv_vAlignTable['u156'] = 'top';
var u130 = document.getElementById('u130');

var u2 = document.getElementById('u2');
gv_vAlignTable['u2'] = 'center';
var u79 = document.getElementById('u79');
gv_vAlignTable['u79'] = 'top';
var u49 = document.getElementById('u49');

var u4 = document.getElementById('u4');
gv_vAlignTable['u4'] = 'center';
var u153 = document.getElementById('u153');

var u140 = document.getElementById('u140');

u140.style.cursor = 'pointer';
if (bIE) u140.attachEvent("onclick", Clicku140);
else u140.addEventListener("click", Clicku140, true);
function Clicku140(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u136', 'pd0u136','none','',500,'none','',500);

}

}

var u17 = document.getElementById('u17');
gv_vAlignTable['u17'] = 'top';
var u135 = document.getElementById('u135');
gv_vAlignTable['u135'] = 'top';
var u151 = document.getElementById('u151');
gv_vAlignTable['u151'] = 'top';
var u42 = document.getElementById('u42');
gv_vAlignTable['u42'] = 'top';
var u159 = document.getElementById('u159');

var u55 = document.getElementById('u55');

u55.style.cursor = 'pointer';
if (bIE) u55.attachEvent("onclick", Clicku55);
else u55.addEventListener("click", Clicku55, true);
function Clicku55(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u51', 'pd0u51','none','',500,'none','',500);

}

}

var u101 = document.getElementById('u101');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u101ann'), "<div id='u101Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u101Note').click(function(e) { ToggleWorkflow(e, 'u101', 300, 150, false); return false; });
var u101Ann = 
{
"label":"?",
"Description":"Upper bound the image count."};

var u186 = document.getElementById('u186');

var u14 = document.getElementById('u14');
gv_vAlignTable['u14'] = 'top';
var u48 = document.getElementById('u48');
gv_vAlignTable['u48'] = 'center';
var u105 = document.getElementById('u105');

var u27 = document.getElementById('u27');

var u7 = document.getElementById('u7');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u7ann'), "<div id='u7Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u7Note').click(function(e) { ToggleWorkflow(e, 'u7', 300, 150, false); return false; });
var u7Ann = 
{
"label":"?",
"Description":"Opens modal w\/ formatted JSON string"};
gv_vAlignTable['u7'] = 'top';
var u52 = document.getElementById('u52');

var u20 = document.getElementById('u20');
gv_vAlignTable['u20'] = 'top';
var u67 = document.getElementById('u67');

var u65 = document.getElementById('u65');
gv_vAlignTable['u65'] = 'top';
var u120 = document.getElementById('u120');
gv_vAlignTable['u120'] = 'center';
var u152 = document.getElementById('u152');
gv_vAlignTable['u152'] = 'top';
var u110 = document.getElementById('u110');

var u6 = document.getElementById('u6');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u6ann'), "<div id='u6Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u6Note').click(function(e) { ToggleWorkflow(e, 'u6', 300, 150, false); return false; });
var u6Ann = 
{
"label":"?",
"Description":"Reinstanciates coverflow w\/ selected options."};
gv_vAlignTable['u6'] = 'top';
var u205 = document.getElementById('u205');

var u108 = document.getElementById('u108');
gv_vAlignTable['u108'] = 'top';
var u37 = document.getElementById('u37');
gv_vAlignTable['u37'] = 'top';
var u62 = document.getElementById('u62');
gv_vAlignTable['u62'] = 'center';
var u141 = document.getElementById('u141');
gv_vAlignTable['u141'] = 'center';
var u11 = document.getElementById('u11');
gv_vAlignTable['u11'] = 'center';
var u75 = document.getElementById('u75');
gv_vAlignTable['u75'] = 'top';
var u133 = document.getElementById('u133');
gv_vAlignTable['u133'] = 'center';
var u191 = document.getElementById('u191');
gv_vAlignTable['u191'] = 'top';
var u34 = document.getElementById('u34');
gv_vAlignTable['u34'] = 'top';
var u68 = document.getElementById('u68');
gv_vAlignTable['u68'] = 'top';
var u89 = document.getElementById('u89');

var u47 = document.getElementById('u47');

var u184 = document.getElementById('u184');
gv_vAlignTable['u184'] = 'top';
var u185 = document.getElementById('u185');

var u161 = document.getElementById('u161');

var u72 = document.getElementById('u72');

var u103 = document.getElementById('u103');
gv_vAlignTable['u103'] = 'top';
var u164 = document.getElementById('u164');

var u149 = document.getElementById('u149');

var u99 = document.getElementById('u99');
gv_vAlignTable['u99'] = 'top';
var u66 = document.getElementById('u66');
gv_vAlignTable['u66'] = 'top';
var u112 = document.getElementById('u112');
gv_vAlignTable['u112'] = 'top';
var u44 = document.getElementById('u44');

var u78 = document.getElementById('u78');
gv_vAlignTable['u78'] = 'center';
var u179 = document.getElementById('u179');
gv_vAlignTable['u179'] = 'top';
var u57 = document.getElementById('u57');
gv_vAlignTable['u57'] = 'top';
var u197 = document.getElementById('u197');

var u119 = document.getElementById('u119');

u119.style.cursor = 'pointer';
if (bIE) u119.attachEvent("onclick", Clicku119);
else u119.addEventListener("click", Clicku119, true);
function Clicku119(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u109', 'pd1u109','none','',500,'none','',500);

}

}

var u16 = document.getElementById('u16');

var u203 = document.getElementById('u203');
gv_vAlignTable['u203'] = 'top';
var u125 = document.getElementById('u125');
gv_vAlignTable['u125'] = 'top';
var u41 = document.getElementById('u41');
gv_vAlignTable['u41'] = 'top';
var u172 = document.getElementById('u172');
gv_vAlignTable['u172'] = 'top';
var u158 = document.getElementById('u158');

var u54 = document.getElementById('u54');
gv_vAlignTable['u54'] = 'top';
var u88 = document.getElementById('u88');
gv_vAlignTable['u88'] = 'top';
var u189 = document.getElementById('u189');

u189.style.cursor = 'pointer';
if (bIE) u189.attachEvent("onclick", Clicku189);
else u189.addEventListener("click", Clicku189, true);
function Clicku189(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u185', 'pd0u185','none','',500,'none','',500);

}

}

var u38 = document.getElementById('u38');
gv_vAlignTable['u38'] = 'top';
var u176 = document.getElementById('u176');

var u26 = document.getElementById('u26');

var u174 = document.getElementById('u174');
gv_vAlignTable['u174'] = 'center';
var u128 = document.getElementById('u128');
gv_vAlignTable['u128'] = 'top';
var u85 = document.getElementById('u85');
gv_vAlignTable['u85'] = 'top';
var u51 = document.getElementById('u51');

var u182 = document.getElementById('u182');
gv_vAlignTable['u182'] = 'center';
var u10 = document.getElementById('u10');

var u100 = document.getElementById('u100');
gv_vAlignTable['u100'] = 'top';
var u23 = document.getElementById('u23');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u23ann'), "<div id='u23Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u23Note').click(function(e) { ToggleWorkflow(e, 'u23', 300, 150, false); return false; });
var u23Ann = 
{
"label":"?",
"Description":"Upper bound the image count - 1."};

var u144 = document.getElementById('u144');
gv_vAlignTable['u144'] = 'center';
var u166 = document.getElementById('u166');
gv_vAlignTable['u166'] = 'top';
var u82 = document.getElementById('u82');
gv_vAlignTable['u82'] = 'top';
var u36 = document.getElementById('u36');

var u30 = document.getElementById('u30');

var u95 = document.getElementById('u95');
gv_vAlignTable['u95'] = 'top';
var u61 = document.getElementById('u61');

u61.style.cursor = 'pointer';
if (bIE) u61.attachEvent("onclick", Clicku61);
else u61.addEventListener("click", Clicku61, true);
function Clicku61(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u51', 'pd1u51','none','',500,'none','',500);

}

}

var u195 = document.getElementById('u195');

u195.style.cursor = 'pointer';
if (bIE) u195.attachEvent("onclick", Clicku195);
else u195.addEventListener("click", Clicku195, true);
function Clicku195(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u185', 'pd1u185','none','',500,'none','',500);

}

}

var u116 = document.getElementById('u116');

var u201 = document.getElementById('u201');
gv_vAlignTable['u201'] = 'center';
var u114 = document.getElementById('u114');
gv_vAlignTable['u114'] = 'center';
var u33 = document.getElementById('u33');
gv_vAlignTable['u33'] = 'top';
var u160 = document.getElementById('u160');
gv_vAlignTable['u160'] = 'center';
var u157 = document.getElementById('u157');
gv_vAlignTable['u157'] = 'top';
var u92 = document.getElementById('u92');
gv_vAlignTable['u92'] = 'top';
var u46 = document.getElementById('u46');

var u126 = document.getElementById('u126');

var u71 = document.getElementById('u71');

var u181 = document.getElementById('u181');

var u198 = document.getElementById('u198');

var u5 = document.getElementById('u5');

u5.style.cursor = 'pointer';
if (bIE) u5.attachEvent("onclick", Clicku5);
else u5.addEventListener("click", Clicku5, true);
function Clicku5(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u0', 'pd0u0','none','',500,'none','',500);

}

}
gv_vAlignTable['u5'] = 'top';
var u98 = document.getElementById('u98');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u98ann'), "<div id='u98Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u98Note').click(function(e) { ToggleWorkflow(e, 'u98', 300, 150, false); return false; });
var u98Ann = 
{
"label":"?",
"Description":"Upper bound the image count."};

var u127 = document.getElementById('u127');
gv_vAlignTable['u127'] = 'top';
var u43 = document.getElementById('u43');
gv_vAlignTable['u43'] = 'top';
var u169 = document.getElementById('u169');
gv_vAlignTable['u169'] = 'top';
var u56 = document.getElementById('u56');
gv_vAlignTable['u56'] = 'center';
var u150 = document.getElementById('u150');
gv_vAlignTable['u150'] = 'top';
var u187 = document.getElementById('u187');
gv_vAlignTable['u187'] = 'center';
var u74 = document.getElementById('u74');

var u142 = document.getElementById('u142');
gv_vAlignTable['u142'] = 'top';
var u106 = document.getElementById('u106');
gv_vAlignTable['u106'] = 'center';
var u168 = document.getElementById('u168');
gv_vAlignTable['u168'] = 'center';
var u154 = document.getElementById('u154');

var u40 = document.getElementById('u40');

var u139 = document.getElementById('u139');
gv_vAlignTable['u139'] = 'top';
var u87 = document.getElementById('u87');
gv_vAlignTable['u87'] = 'center';
var u53 = document.getElementById('u53');
gv_vAlignTable['u53'] = 'center';
var u193 = document.getElementById('u193');
gv_vAlignTable['u193'] = 'center';
var u104 = document.getElementById('u104');

var u192 = document.getElementById('u192');

var u121 = document.getElementById('u121');

var u19 = document.getElementById('u19');
gv_vAlignTable['u19'] = 'top';
var u155 = document.getElementById('u155');
gv_vAlignTable['u155'] = 'top';
var u206 = document.getElementById('u206');
gv_vAlignTable['u206'] = 'center';
var u109 = document.getElementById('u109');

var u84 = document.getElementById('u84');
gv_vAlignTable['u84'] = 'center';
var u50 = document.getElementById('u50');
gv_vAlignTable['u50'] = 'top';
var u97 = document.getElementById('u97');
gv_vAlignTable['u97'] = 'top';
var u63 = document.getElementById('u63');

var u123 = document.getElementById('u123');
gv_vAlignTable['u123'] = 'top';
var u170 = document.getElementById('u170');

var u76 = document.getElementById('u76');

var u134 = document.getElementById('u134');

var u81 = document.getElementById('u81');
gv_vAlignTable['u81'] = 'center';
var u177 = document.getElementById('u177');
gv_vAlignTable['u177'] = 'top';
var u73 = document.getElementById('u73');
gv_vAlignTable['u73'] = 'center';
var u94 = document.getElementById('u94');
gv_vAlignTable['u94'] = 'top';
var u60 = document.getElementById('u60');
gv_vAlignTable['u60'] = 'top';
var u190 = document.getElementById('u190');
gv_vAlignTable['u190'] = 'center';
var u102 = document.getElementById('u102');
gv_vAlignTable['u102'] = 'top';
var u9 = document.getElementById('u9');
gv_vAlignTable['u9'] = 'center';
var u200 = document.getElementById('u200');

var u113 = document.getElementById('u113');

u113.style.cursor = 'pointer';
if (bIE) u113.attachEvent("onclick", Clicku113);
else u113.addEventListener("click", Clicku113, true);
function Clicku113(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u109', 'pd0u109','none','',500,'none','',500);

}

}

var u147 = document.getElementById('u147');
gv_vAlignTable['u147'] = 'center';
var u163 = document.getElementById('u163');

var u91 = document.getElementById('u91');
gv_vAlignTable['u91'] = 'top';
var u131 = document.getElementById('u131');

var u64 = document.getElementById('u64');
gv_vAlignTable['u64'] = 'top';
var u70 = document.getElementById('u70');
gv_vAlignTable['u70'] = 'top';
var u24 = document.getElementById('u24');
gv_vAlignTable['u24'] = 'top';
var u188 = document.getElementById('u188');
gv_vAlignTable['u188'] = 'top';
var u162 = document.getElementById('u162');
gv_vAlignTable['u162'] = 'top';
var u204 = document.getElementById('u204');
gv_vAlignTable['u204'] = 'top';
var u117 = document.getElementById('u117');
gv_vAlignTable['u117'] = 'center';
var u13 = document.getElementById('u13');
gv_vAlignTable['u13'] = 'center';
var u29 = document.getElementById('u29');
gv_vAlignTable['u29'] = 'top';
var u111 = document.getElementById('u111');
gv_vAlignTable['u111'] = 'center';
var u132 = document.getElementById('u132');

var u175 = document.getElementById('u175');

var u129 = document.getElementById('u129');
gv_vAlignTable['u129'] = 'top';
var u86 = document.getElementById('u86');

u86.style.cursor = 'pointer';
if (bIE) u86.attachEvent("onclick", Clicku86);
else u86.addEventListener("click", Clicku86, true);
function Clicku86(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u76', 'pd1u76','none','',500,'none','',500);

}

}

var u58 = document.getElementById('u58');

var u183 = document.getElementById('u183');

var u173 = document.getElementById('u173');

u173.style.cursor = 'pointer';
if (bIE) u173.attachEvent("onclick", Clicku173);
else u173.addEventListener("click", Clicku173, true);
function Clicku173(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u163', 'pd1u163','none','',500,'none','',500);

}

}

var u39 = document.getElementById('u39');
gv_vAlignTable['u39'] = 'top';
var u171 = document.getElementById('u171');
gv_vAlignTable['u171'] = 'center';
var u0 = document.getElementById('u0');

var u31 = document.getElementById('u31');

var u83 = document.getElementById('u83');

var u178 = document.getElementById('u178');
gv_vAlignTable['u178'] = 'top';
var u8 = document.getElementById('u8');

var u3 = document.getElementById('u3');

var u96 = document.getElementById('u96');

var u146 = document.getElementById('u146');

u146.style.cursor = 'pointer';
if (bIE) u146.attachEvent("onclick", Clicku146);
else u146.addEventListener("click", Clicku146, true);
function Clicku146(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u136', 'pd1u136','none','',500,'none','',500);

}

}

var u196 = document.getElementById('u196');
gv_vAlignTable['u196'] = 'center';
var u15 = document.getElementById('u15');

var u202 = document.getElementById('u202');

u202.style.cursor = 'pointer';
if (bIE) u202.attachEvent("onclick", Clicku202);
else u202.addEventListener("click", Clicku202, true);
function Clicku202(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u0', 'pd1u0','none','',500,'none','',500);

}

}
gv_vAlignTable['u202'] = 'top';
var u124 = document.getElementById('u124');
gv_vAlignTable['u124'] = 'top';
var u80 = document.getElementById('u80');

u80.style.cursor = 'pointer';
if (bIE) u80.attachEvent("onclick", Clicku80);
else u80.addEventListener("click", Clicku80, true);
function Clicku80(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u76', 'pd0u76','none','',500,'none','',500);

}

}

var u1 = document.getElementById('u1');

var u138 = document.getElementById('u138');
gv_vAlignTable['u138'] = 'center';
var u148 = document.getElementById('u148');

var u93 = document.getElementById('u93');

var u167 = document.getElementById('u167');

u167.style.cursor = 'pointer';
if (bIE) u167.attachEvent("onclick", Clicku167);
else u167.addEventListener("click", Clicku167, true);
function Clicku167(e)
{
windowEvent = e;


if (true) {

	SetPanelState('u163', 'pd0u163','none','',500,'none','',500);

}

}

var u145 = document.getElementById('u145');
gv_vAlignTable['u145'] = 'top';
var u12 = document.getElementById('u12');

var u165 = document.getElementById('u165');
gv_vAlignTable['u165'] = 'center';
var u199 = document.getElementById('u199');
gv_vAlignTable['u199'] = 'center';
var u25 = document.getElementById('u25');

var u59 = document.getElementById('u59');
gv_vAlignTable['u59'] = 'center';
var u118 = document.getElementById('u118');
gv_vAlignTable['u118'] = 'top';
var u90 = document.getElementById('u90');

var u18 = document.getElementById('u18');
gv_vAlignTable['u18'] = 'top';
var u136 = document.getElementById('u136');

var u45 = document.getElementById('u45');

var u77 = document.getElementById('u77');

var u22 = document.getElementById('u22');
gv_vAlignTable['u22'] = 'top';
var u143 = document.getElementById('u143');

var u107 = document.getElementById('u107');

var u35 = document.getElementById('u35');
gv_vAlignTable['u35'] = 'top';
var u69 = document.getElementById('u69');

x = 0;
y = 0;
InsertAfterBegin(document.getElementById('u69ann'), "<div id='u69Note' class='annnoteimage' style='left:" + x + ";top:" + y + "'></div>");
$('#u69Note').click(function(e) { ToggleWorkflow(e, 'u69', 300, 150, false); return false; });
var u69Ann = 
{
"label":"?",
"Description":"Upper bound the image count."};

var u180 = document.getElementById('u180');

var u28 = document.getElementById('u28');
gv_vAlignTable['u28'] = 'center';
var u194 = document.getElementById('u194');
gv_vAlignTable['u194'] = 'top';
if (window.OnLoad) OnLoad();
