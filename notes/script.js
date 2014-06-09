//page JS, helpful for scripts

var xmlHttp;

function GetXmlHttpObject()
  { 
    xmlHttp=null;
	try
	  {
	  // Firefox, Opera 8.0+, Safari
	  xmlHttp=new XMLHttpRequest();
	  }
	catch (e)
	  {
		// Internet Explorer
		try
		{
		  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	 	}
	    catch (e)
		{
	   	 xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	 }
	return xmlHttp;
  } 
  
  //Getting Actual Data
  function GetData()
  { 
    var DeviceTypeId;
    var dvalue;
    var statevalue;
    var FromDate;
    var ToDate;
    var varStateIndex;
    var varStateValue;
    var varDistrictValue;
    var varLocValue;
    var varTimeValue;
    var varUrl="WeatherARGData.aspx?";
    
    
    //Dates
    FromDate=document.frmDeviceData.txtFromDate.value;
    ToDate=document.frmDeviceData.txtToDate.value;
    //State Data
    varStateValue=document.frmDeviceData.CmbState.value;
    //District Data
    varDistrictValue=document.frmDeviceData.CmbDistrict.value;
    //Location Data
    varLocValue=document.frmDeviceData.CmbLocation.value;
    //Time Data
    varTimeValue=document.frmDeviceData.CmbTime.value;
      
    varUrl=varUrl + "&FromDate=" + FromDate;
    varUrl=varUrl + "&ToDate=" + ToDate;
    varUrl=varUrl + "&State=" + varStateValue;
    varUrl=varUrl + "&District=" + varDistrictValue;
    varUrl=varUrl + "&Loc=" + varLocValue;
    varUrl=varUrl + "&Time=" + varTimeValue;
    //alert(varUrl);
       
    var strLoading = "";
	strLoading = 			 "<table width='960' height='350' border='0' cellspacing='0' cellpadding='0' class='boxborder'>";
	strLoading = strLoading + 	"<tr>";
	strLoading = strLoading + 		"<td align='center' valign='top' height='10'>&nbsp;<br></td>";
	strLoading = strLoading + 	"</tr>";
	strLoading = strLoading + 	"<tr>";
	strLoading = strLoading + 		"<td align='center' valign='top'><span class='section_header' id='txtload'>Loading Data... </span><br /><br /><img src='images/preloader.gif' id='imgload'></td>";
	strLoading = strLoading + 	"</tr>";
	strLoading = strLoading + "</table>";
		
	document.getElementById('DeviceData').innerHTML = strLoading;
    
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null)
	{
	 alert ("Your browser does not support AJAX!");
	 return;
	} 
	
	xmlHttp.onreadystatechange=stateChanged;
    xmlHttp.open("GET", varUrl , true);
    xmlHttp.send(null);
  } 
  
  function ViewFullScreenData()
  { 
    var DeviceTypeId;
    var dvalue;
    var statevalue;
    var FromDate;
    var ToDate;
    var varStateIndex;
    var varStateValue;
    var varDistrictValue;
    var varLocValue;
    var varTimeValue;
    var varUrl="WeatherARGData.aspx?";
    
    //Dates
    FromDate=document.frmDeviceData.txtFromDate.value;
    ToDate=document.frmDeviceData.txtToDate.value;
    //State Data
    varStateValue=document.frmDeviceData.CmbState.value;
    //District Data
    varDistrictValue=document.frmDeviceData.CmbDistrict.value;
    //Location Data
    varLocValue=document.frmDeviceData.CmbLocation.value;
    //Time Data
    varTimeValue=document.frmDeviceData.CmbTime.value;
      
    varUrl=varUrl + "&FromDate=" + FromDate;
    varUrl=varUrl + "&ToDate=" + ToDate;
    varUrl=varUrl + "&State=" + varStateValue;
    varUrl=varUrl + "&District=" + varDistrictValue;
    varUrl=varUrl + "&Loc=" + varLocValue;
    varUrl=varUrl + "&Time=" + varTimeValue;
    varUrl=varUrl + "&FScreen=1";
    //window.open(varUrl,"fullscreen","FullScreen=1");
    window.moveTo(0,0);
    alert(screen.width);
    alert(screen.height);
    window.resizeTo(screen.width, screen.height);
  } 
 
  
  //State of Response Changed 
  function stateChanged() 
  {
    if (xmlHttp.readyState==4)
    {
       document.getElementById('DeviceData').innerHTML=xmlHttp.responseText;
    }
  }  
  
function BtnData_onclick() 
{
    var intval="";
    var flag=0;
  
    if(document.frmDeviceData.txtFromDate.value=="" || document.frmDeviceData.txtToDate.value=="")
    {
        document.getElementById("lblMessage").innerText= "Please Select Dates";
        flag=1;
    }
    else
    {
        if(document.frmDeviceData.CmbState.value==0 && document.frmDeviceData.CmbTime.value=="")
        {
            document.getElementById("lblMessage").innerText= "Please Select STATE OR TIME";
            flag=1;
        }
    }    
  
    if(flag == 0)
    {
        document.getElementById("DivMessage").style.display="none";
        document.getElementById("lblMessage").innerText="";
        GetData();
        //setTimeout("GetData();",2000);
    }     
}

function BtnDownload_onclick() 
{
    var intval="";
    var flag=0;
    var FromDate="";
    var ToDate="";
    var State="";
    var Dist="";
    var Loc="";
    var Time="";
    var LocRef="";
 
  
    FromDate=document.frmDeviceData.txtFromDate.value;
    ToDate=document.frmDeviceData.txtToDate.value;
    State=document.frmDeviceData.CmbState.value;
    Dist=document.frmDeviceData.CmbDistrict.value;
    Loc=document.frmDeviceData.CmbLocation.value;
    Time=document.frmDeviceData.CmbTime.value;
    
    if(document.frmDeviceData.txtFromDate.value=="" || document.frmDeviceData.txtToDate.value=="")
    {
        document.getElementById("lblMessage").innerText= "Please Select Dates";
        flag=1;
    }
    else
    {
        if(document.frmDeviceData.CmbState.value==0 && document.frmDeviceData.CmbTime.value=="")
        {
            document.getElementById("lblMessage").innerText= "Please Select STATE OR TIME";
            flag=1;
        }
    }    
   
    if(flag == 0)
    {
       LocRef="userdetails.aspx?Dtype=ARG&State=" + State + "&Dist=" + Dist + "&Loc=" + Loc + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Time=" + Time;
       window.location.href=LocRef;
    }
}    

function GetDistrictData()
{ 
    var DistrictUrl;
    var StateId;
    var StateVal;
    var cnt;
 
    StateVal=document.frmDeviceData.CmbState.selectedIndex;
    StateId=document.frmDeviceData.CmbState[StateVal].value;
    DistrictUrl="DistrictData.aspx?DevType=ARG&StateId=" + StateId;
    
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null)
    {
	alert ("Your browser does not support AJAX!");
	return;
    } 
	
	 //Clearing the DropDownList
     var clen =  document.frmDeviceData.CmbDistrict.options.length;
     for(cnt=clen-1; cnt > 0; cnt--)
     {
        document.frmDeviceData.CmbDistrict.options.remove(cnt);
     }
	
    xmlHttp.onreadystatechange=ShowDistricts;
    xmlHttp.open("GET", DistrictUrl, true);
    xmlHttp.send(null);
} 

function ShowDistricts()
{
  var DistStr;
  var IndStr;
  var len;
  var k;
  
  if (xmlHttp.readyState==4)
  {
      DistStr=xmlHttp.responseText;
      var ArrDist = new Array();
      ArrDist=DistStr.split("|");
      len=ArrDist.length;
               
      for(k=0;k<len-1;k++)
      {
         var ArrInd=new Array();
         IndStr=ArrDist[k];
         ArrInd=IndStr.split(":");
          
         var opt = document.createElement("option");
         opt.text = ArrInd[0];
         opt.value = ArrInd[1];
         document.getElementById("CmbDistrict").options.add(opt);     
      }
      GetLocData();
   }  
}

function GetLocData()
{ 
    var DistrictUrl;
    var DevId;
    var DevVal;
    var StateId;
    var StateVal;
    var DistId;
    var DistVal;
    var cnt;
 
    StateVal=document.frmDeviceData.CmbState.selectedIndex;
    StateId=document.frmDeviceData.CmbState[StateVal].value;
 
    DistVal=document.frmDeviceData.CmbDistrict.selectedIndex;
    DistId=document.frmDeviceData.CmbDistrict[DistVal].value;
  
    LocUrl="LocData.aspx?DevType=ARG&StateId=" + StateId + "&DistId=" + DistId;
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp==null)
    {
	alert ("Your browser does not support AJAX!");
	return;
    } 
	
	 //Clearing the DropDownList
     var clen =  document.frmDeviceData.CmbLocation.options.length;
     for(cnt=clen-1; cnt > 0; cnt--)
     {
        document.frmDeviceData.CmbLocation.options.remove(cnt);
     }
	
    xmlHttp.onreadystatechange=ShowLocs;
    xmlHttp.open("GET", LocUrl, true);
    xmlHttp.send(null);
} 

function ShowLocs()
{
  var DistStr;
  var IndStr;
  var len;
  var k;
  
  if (xmlHttp.readyState==4)
  {
      DistStr=xmlHttp.responseText;
      var ArrDist = new Array();
      ArrDist=DistStr.split("|");
      len=ArrDist.length;
               
      for(k=0;k<len-1;k++)
      {
         var ArrInd=new Array();
         IndStr=ArrDist[k];
         ArrInd=IndStr.split(":");
          
         var opt = document.createElement("option");
         opt.text = ArrInd[0];
         opt.value = ArrInd[1];
         document.getElementById("CmbLocation").options.add(opt);     
      }
   }  
}

