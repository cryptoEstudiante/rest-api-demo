/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";


// Declare vars for dialog
// Global Variables //
var TIMER = 5; // org. val was 5--timer to fade out = autohide * 1000
var SPEED = 10; // org. val was 10--
var WRAPPER = 'content';

// for viewport test
// smart phones at about 480 x 320px
var TEST_WIDTH = 550; // changed to 550 minimum px width permitted for demo to run
var TEST_HEIGHT = 320;// minimum px height permitted for demo to run
var STR_TEST_WIDTH = '480';
var STR_TEST_HEIGHT = '320';  //smart phones are at about 480 x 320px


var JS_CHART; 
var USER_ONLINE = 0; //checks using navigator object

var DEBUG = 0; //turn on/off console logging
var MY_TRACE = 0;
var SHOW_ALERTS = 0;
var TEST_MODE=1;

var STR_FOR_USERWAIT = "Updating...";
var STR_FOR_BROWSER_DISCONNECTED_ESPANOL = "No hay conexión a Internet\n\
                                   Intenta: Comprobar los cables de red, el módem y el router \n\
                                   Volver a conectarte a Wi-Fi \n\
                                   Ejecución del Diagnóstico de red de Windows: ERR_INTERNET_DISCONNECTED";
var STR_FOR_CORS_ERROR = "Looks like are data provider changed the rules on us. We can´t access their domain for the price data. It´s called a Cross-origin resource sharing (CORS) error. For now, the Web page will close. However, check back in a few days. We will work to correct the error. Thanks.";
var STR_FOR_BROWSER_DISCONNECTED = "There seems to be an issue with network connectivity. Check your Internet connection, and then refresh the web page.";
// How to refresh a Web page:: window.location.reload(true);
// or trying the URL from the address bar again
var STR_FOR_CONNECTED_BUT_SLOW = " The server maybe very busy. You may want to try again later.";
var STR_FOR_NETWORK_ISSUES = "The Web server could be very busy, or there is a domain name system (DNS) issue.<br><br> Retry the web page by clicking the refresh or reload button. Or, you may want to try again later.";
//
//, or trying the URL from the address bar again.
//Error 404 or 302 received --This has to be at my Web service provider:
//make an assumption that this is probably only temporary....    
var STR_FOR_MOVED_RESOURCE = "Error received from Web server. The page requested has either moved or is no longer available. Try again using the navigation menus or search feature. ";
var STR_FOR_ACCESS_DENIED_MSG = "Access denied message received from data provider, or unable to access price data. The cause of this error is unknown. However, to improve the user experience, this error is being logged at our server for debug investigation. This is a fatal error. The Web page will close. Please try again later.";
var STR_FOR_BAD_DATA = "Price data from service provider is not valid. To improve the user experience, this error is being logged at our server for debug investigation. This is a fatal error. The Web page will close. Please try again later.";
var STR_FOR_SERVER_ERROR = " Error received from server--irrecoverable error. To improve the user experience, this error is being logged at our server for debug investigation. This is a fatal error. The Web page will close. Please try again later.";
var STR_FOR_BROWSER_VIEWPORT_TOO_SMALL = " Increase the size of your browser window, or use a personal computer to view the page. Thanks.";
// COULD ALSO SAY BROWSER NOT SUPPORTED    
var STR_VIEW_LATER = " Try viewing the Web page later.";
var STR_GENERIC_ERROR = " The JavaScript client received an error, and cannot continue." + STR_VIEW_LATER;

var STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW = " The Web page cannot be displayed in your browser. Use the recent Chrome, Internet Explorer, Opera, Firefox or Safari to view the page. Thanks!";

var STR_BROWSER_UNTESTED = ' The requested Web page was not tested with your version of the browser.';
var STR_FOR_BROWSER_UNTESTED = 'The requested page was not tested with your browser.';
//var STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW = " Use the current version of a browser, or one of the following: Mozilla Firefox (version 38 or later), or Google Chrome\n\
  //   (version 41 or later). Thanks!";
var STR_BROWSER_VIEWPORT_TOO_SMALL = ' Beta Version 1 is not sized yet for a SmartPhone screen. The page requires a larger viewing area. Increase the size of your browser window, or use a device with a larger viewing area. Thanks.';    

var STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW = "The Web page cannot be displayed in this browser. Use the recent Chrome, Internet Explorer, Opera, Firefox or Safari to view the page. Thanks!";

// Exception
var STR_UNEXPECTED_PROGRAM_RESULT = "Unexpected result from execution of JavaScript client.";

var STR_SOFTWARE_PROVIDED_AS_IS = "Your browser may not be compatible with the\n\
    demo.";

var hTimer = null;

var i_ExchangeIterator = 0;  // global 
var NUM_EXCHANGES_NETS = 2; // global 
var NUM_MS_TIMEOUT_BEFORE_REQUESTDATA = 5000; // global 
var NUM_MS_B4_HTTPGET_TIMEOUT = 8000; // How long should the GET take?

var XBT_VALID_LOWER_BOUND = 2000.0000;  //for function isValidData
var XBT_VALID_UPPER_BOUND = 30000.0000; //for function isValidData

// Browser compatibility constants used in function detectCompatibleBrowser
// and its helper functions.
var COMPATIBLE_YES = "1";/*for detectBrowser functions*/
var COMPATIBLE_UNKNOWN = "00";/*for detectBrowser functions*/
var COMPATIBLE_NO = "0";/*for detectBrowser functions*/

var arr_ExchangeNetworks = [];// global 
//[0]'Bitcoin P2P Network' from ChainSo
//[1]'CEX.IO'
arr_ExchangeNetworks[0] = {name: "ChainSo", req_URL: "https://chain.so/api/v2/get_info/BTC"};
arr_ExchangeNetworks[1] = {name: "CEX.IO", req_URL: "https://cex.io/api/tickers/BTC/USD"};

// DETECT BROWSERS 
var browser_name = '';  //global

// PROGRAM EXECUTION STARTS on the document.ready event that I catch in function doc.ready()
//****************************  START FUNCTION DEFINITIONS ************************
/** 
* @summary Detects Opera and its version. This function is called by 
* <i>function detectCompatibleBrowser</i>. If the function detects the browser,
* the function verifies that the version of the browser can support the 
* features required by the client. 
* @description <b>Comments</b><br>
* <i>Function detectOpera</i> is customized to detect Opera, and its version.
* The function creates an object with browser information, and returns 
* a reference to the object. If the browser is not compatible with
* the client, the function displays an error message, and sets the
* <i>compatible</i> property of the object to the constant COMPATIBLE_NO. 
* <br><br>
* <b>Returns</b><br>A reference to an object with the following
* properties:
* <ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
*  @see <i>function detectCompatibleBrowser</i>
*/
function detectOpera() {
  try { 
    if (MY_TRACE === 1) {writeToConsole('TRACE: at detectOpera');}
    // Because of a compiler error:  Added qualifier of window to
    //  window.opr.addons
    var browserInfo = { name: "",
                         found: false,
                         compatible: COMPATIBLE_UNKNOWN
                       };
    var isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera ||
        navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera === true) {
      browserInfo.name = 'Opera';
      browserInfo.found = true;
      browserInfo.compatible = COMPATIBLE_YES; // Not sure which versions of
                                              // Opera to permit
      if (DEBUG===1) {
        writeToConsole('User has Opera');
        writeToConsole('Opera user agent string: ' + navigator.userAgent);       
        writeToConsole('Opera has appVersion: ' + navigator.appVersion);
      }
      var mIndex = -1;
      if (navigator.appVersion.indexOf("OPR/")!== -1) {
        mIndex = navigator.appVersion.indexOf("OPR\/"); 
                          
        if (DEBUG === 1){writeToConsole('Parsed OPR version '  + 
            (navigator.appVersion).substr(mIndex +4,3));}
        if (parseInt((navigator.appVersion).substr(mIndex +4, 3),10) < 41) {
          browserInfo.compatible = COMPATIBLE_YES; // not sure which
                                                // versions of Opera to deny.
        } 
      } else {
         if (DEBUG === 1){writeToConsole('User has Opera. However,\n\
             I cannot tell which version.');}
         browserInfo.compatible = COMPATIBLE_YES;
      }      
    } // end if (isOpera == true)
 
    return browserInfo;
      
    } catch(e){
      if (DEBUG===1){writeToConsole("EXCEPTION in detectOpera(), name\n\
         and message: " + e.name+ " " +e.message + " ");}
      if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
      return browserInfo;
    }
} //end detectOpera 


/** 
* @summary Detects Firefox and its version. This function is called by 
* <i>function detectCompatibleBrowser</i>. If the function detects the browser,
* the function verifies that the version of the browser can support the 
* features required by the client. 
* @description <b>Comments</b><br>
* <i>Function detectFirefox</i> is customized to detect Firefox, and its version.
* The function creates an object with browser information, and returns 
* a reference to the object. If the browser is not compatible with
* the client, the function displays an error message, and sets the
* <i>compatible</i> property of the object to the constant COMPATIBLE_NO. 
* <br><br>
* <b>Returns</b><br>
* A reference to an object with the following
* properties:
* <ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
*  @see <i>function detectCompatibleBrowser</i>
*/
function detectFirefox() {
  try {
    if (MY_TRACE === 1) {writeToConsole('TRACE: in detectFireFox()');}
    var browserInfo = { name: "",
                         found: false,
                         compatible: COMPATIBLE_UNKNOWN
                       };
    if (navigator.userAgent.indexOf("Firefox") !== -1 ) { //Firefox valid at 
                                                          // 38 and later!
      // Defer (just for one browser make!) to using the userAgent string :-(  
      // for browser detection.
      browserInfo.name = 'Firefox';
      browserInfo.found = true;
         
      if (DEBUG === 1) {
        writeToConsole('User has Firefox user agent string: ' + 
            navigator.userAgent);       
        writeToConsole('User has Firefox appVersion: ' + navigator.appVersion);
      }
      var mIndex = -1;
      //-->look in user agent string for something like the following: 
      //Firefox/54.0  //
     
      mIndex = navigator.userAgent.indexOf("Firefox\/"); 
      //substr(pos, len);
      if (DEBUG === 1){writeToConsole('Parsed Firefox version ' + 
          (navigator.userAgent).substr(mIndex +8,4));}
      if (parseInt((navigator.userAgent).substr(mIndex +8, 4),10) < 38) {
        alert("For a better user experience, upgrade your browser \n\
              to Mozilla Firefox version 38 or later. Thanks.");
        browserInfo.compatible = COMPATIBLE_NO;
      } else {       
          browserInfo.compatible = COMPATIBLE_YES; 
      }      
    } //end if Firefox detected
    return browserInfo; 
  } catch(e){
    if (DEBUG===1){writeToConsole("EXCEPTION in detectFirefox(), name and \n\
        message: " + e.name+ " " +e.message + " ");}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    return browserInfo;
  }
} //end function detectFirefox


/** 
* @summary Detects Internet Explorer and its version. This function is called by 
* <i>function detectCompatibleBrowser</i>. If the function detects the browser,
* the function verifies that the version of the browser can support the 
* features required by the client. 
* @description <b>Comments</b><br>
* <i>Function detectInternetExplorer</i> is customized to detect Internet 
* Explorer, and its version. The function creates an object with browser 
* information, and returns a reference to the object. If the browser is not 
* compatible with the client, the function displays an error message, and sets 
* the <i>compatible</i> property of the object to the constant COMPATIBLE_NO. 
* <br><br>
* <b>Returns</b><br>
* A reference to an object with the following
* properties:
* <ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
*  @see <i>function detectCompatibleBrowser</i>
*/
function detectInternetExplorer() {
  try {    
    if (MY_TRACE === 1) {writeToConsole('TRACE: at detectInternetExplorer');}
    var browserInfo = { name: "",
                         found: false,
                         compatible: COMPATIBLE_UNKNOWN
                       };
    var isIE = /*@cc_on!@*/false || (!!document.documentMode);
    if (isIE === false) {
      return browserInfo;
    } else {
      browserInfo.name = 'IE';
      var msie = document.documentMode;
      browserInfo.found = true;
         
    if (DEBUG === 1) {
      writeToConsole('User has IE version ' + msie);
      writeToConsole('IE user agent string: ' + navigator.userAgent); 
    }
    // Confirm 
    if ((!navigator.userAgent.match(/Trident\/7\./)) &&  (msie < 11)) { 
      alert("For a better user experience, upgrade to Internet\n\
          Explorer version 11 or later. Thanks.");
      browserInfo.compatible = COMPATIBLE_NO;
    } else {
        browserInfo.compatible = COMPATIBLE_YES;
        if (DEBUG === 1) {writeToConsole("User has IE compatible version.");}
    }
  }// end else is IE
  return browserInfo;
      
  } catch(e){
    if (DEBUG===1){writeToConsole("EXCEPTION in detectInternetExplorer(), name and\n\
        message: " + e.name+ " " +e.message + " ");}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    return browserInfo;
  } 
} //end function detectInternetExplorer()

/** 
* @summary Detects Edge and its version. This function is called by 
* <i>function detectCompatibleBrowser</i>. If the function detects the browser,
* the function verifies that the version of the browser can support the 
* features required by the client. 
* @description <b>Comments</b><br>
* <i>Function detectEdge</i> is customized to detect Edge, and its version.
* The function creates an object with browser information, and returns 
* a reference to the object. If the browser is not compatible with
* the client, the function displays an error message, and sets the
* <i>compatible</i> property of the object to the constant COMPATIBLE_NO. 
* <br><br>
* <b>Returns</b><br>
* A reference to an object with the following properties:
* <ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
*  @see <i>function detectCompatibleBrowser</i>
*/
 function detectEdge() {    
  try { 
    if (MY_TRACE === 1) {writeToConsole('TRACE: at detectEdge()');}
    var browserInfo = { name: "",
                         found: false,
                         compatible: COMPATIBLE_UNKNOWN
                       };
    //var isEdge = !isIE && !!window.StyleMedia; //should be 2.0 version
    var isEdge = !!window.StyleMedia; //should be 2.0 version
    if (isEdge) {  
      browserInfo.name = 'Edge';
      browserInfo.found = true;
      browserInfo.compatible = true; // I believe all version of Edge
                               // support WebSockets.
      if (DEBUG === 1){ writeToConsole('User has Edge.');}
     }
     return browserInfo;
  } catch(e){
    if (DEBUG===1){writeToConsole("EXCEPTION in detectEdge(), name and \n\
        message: " + e.name+ " " +e.message + " ");}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    return browserInfo;
  } 
} //end function detectEdge()

/** 
* @summary Detects Chrome and its version. This function is called by 
* <i>function detectCompatibleBrowser</i>. If the function detects the browser,
* the function verifies that the version of the browser can support the 
* features required by the client. 
* @description <b>Comments</b><br>
* <i>Function detectChrome</i> is customized to detect Chrome, and its version.
* The function creates an object with browser information, and returns 
* a reference to the object. If the browser is not compatible with
* the client, the function displays an error message, and sets the
* <i>compatible</i> property of the object to the constant COMPATIBLE_NO. 
* <br><br>
* <b>Returns</b><br>A reference to an object with the following
* properties:
* <ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
*  @see <i>function detectCompatibleBrowser</i>
*/
function detectChrome(){
  try { 
    if (MY_TRACE === 1) {writeToConsole('TRACE: at detectChrome');}
    var browserInfo = { name: "",
                         found: false,
                         compatible: COMPATIBLE_UNKNOWN
                       };  
    // Use object detection from Window object
    // if ((navigator.userAgent.indexOf("Chrome") !== -1 && !isEdge)
    if (!!window.chrome ) {//&& !!window.chrome.webstore) { //<+++Version 41 
                                                       //  !have store.
      browserInfo.name = 'Chrome';
      browserInfo.found = true;
           
      if (DEBUG === 1) {
        writeToConsole('User has Chrome & user agent string: ' + navigator.userAgent);       
        writeToConsole('User has Chrome appversion: ' + navigator.appVersion);
       }
    } else {
      return browserInfo; //should be empty string
    }
      //get the version
      //-->look in appVersion string for something like the 
      //following: Firefox/54.0
      if (navigator.appVersion.indexOf("Chrome/")!== -1) {
        var mIndex = -1;  
        mIndex = navigator.appVersion.indexOf("Chrome\/"); 
        //substr(pos, len);
        if (DEBUG === 1){writeToConsole('Parsed Chrome version '  + 
            (navigator.appVersion).substr(mIndex +7,3));}
        if (parseInt((navigator.appVersion).substr(mIndex +7, 3),10) <= 49) {
          alert("The Web page works better with a current browser version.\n\
              Upgrade to the latest version of Chrome. Thanks.");
          browserInfo.compatible = COMPATIBLE_NO;
         } else if (parseInt((navigator.appVersion).substr(mIndex +7, 3),10) >= 50) {
             browserInfo.compatible = COMPATIBLE_YES;
             if (DEBUG === 1){writeToConsole("User has Chrome with compatible\n\
                  version.");}
         } 
      } else {
        if (DEBUG === 1){writeToConsole('User has Chrome but I cannot tell\n\
            which version.');}
        // HERE I let the user continue even though I dont know the version of the browser!
      } //end get Chrome version       
      return browserInfo;
  } catch(e){
    if (DEBUG===1){writeToConsole("EXCEPTION in detectChrome(), name and \n\
       message: " + e.name+ " " +e.message + " ");}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    return browserInfo;
  } 
} //end function detectChrome

/** 
* @summary Detects Safari and its version. This function is called by 
* <i>function detectCompatibleBrowser</i>. If the function detects the browser,
* the function verifies that the version of the browser can support the 
* features required by the client. 
* @description <b>Comments</b><br>
* <i>Function detectSafari</i> is customized to detect Safari, and its version.
* The function creates an object with browser information, and returns 
* a reference to the object. If the browser is not compatible with
* the client, the function displays an error message, and sets the
* <i>compatible</i> property of the object to the constant COMPATIBLE_NO. 
* <br><br>
* <b>Returns</b><br> A reference to an object with the following
* properties:
* <ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
*  @see <i>function detectCompatibleBrowser</i>
*/
function detectSafari() { 
  try { 
    if (MY_TRACE === 1) {writeToConsole('TRACE: at detectSafari()');}
    var browserInfo = { name: "",
                         found: false,
                         compatible: COMPATIBLE_UNKNOWN
                       };
    // Safari 3.0+ "[object HTMLElementConstructor]"
    // window.HTMLElement returns a function which is named
    // HTMLElementConstructor(){}.
    var isSafari = ((/constructor/i.test(window.HTMLElement)) && 
                (navigator.userAgent.indexOf('Safari') !== -1 && 
                navigator.userAgent.indexOf('Chrome') === -1));
    // in use strict safari not declared, neither is the arg p 
    // (function (p) {return p.toString() === "[object 
    // SafariRemoteNotification]";})
    // (!window['safari'] || safari.pushNotification);
    if (isSafari === true) {// Require Safari 10 or 11
      browserInfo.name = 'Safari';
      browserInfo.found = true;
    if (DEBUG===1) {
       writeToConsole('User has Safari.');
       writeToConsole('Safari user agent string: ' + navigator.userAgent);       
       writeToConsole('Safari has appVersion: ' + navigator.appVersion);
    }
     // Get version
    var safIndex;
    var fullVersion;
    var offsetVersion;
            
    if ((safIndex = navigator.userAgent.indexOf("Safari"))!==-1) { 
      fullVersion = navigator.userAgent.substring(safIndex +7);
      if ((offsetVersion = navigator.userAgent.indexOf("Version"))!==-1) { 
        saf_Version = navigator.userAgent.substring(offsetVersion+8);
      } 
      if (saf_Version < 10) {
        alert("Browser version is not current. The Web page\n\
           works better with Safari version 10 or later. Thanks." ); 
        browserInfo.compatible = COMPATIBLE_NO;
      } else if (saf_Version >= 10) {
        browserInfo.compatible = COMPATIBLE_YES;  
      } else { 
         if (DEBUG === 1){writeToConsole('User has Safari; however, I cannot\n\
          tell which version.');}
          browserInfo.compatible = COMPATIBLE_YES;
         // HERE I let the user continue with the browser even though I dont 
         // know the version of Safari
      }
    } //end if safIndex
  }  //end if Safari
  return browserInfo;
  } catch(e){
    if (DEBUG===1){writeToConsole("EXCEPTION in detectSafari(), name and\n\
        message: " + e.name+ " " +e.message + " ");}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    return browserInfo;
  }
} //end function detectSafari()
          
/**
* @summary Stops early versions of browsers from running the demo 
* for the following reasons:
* <ul>
* <li>No support for WebSockets.</li>
* <li>No support for a console object.</li>
* </ul>
* This function is called on the <i>JQuery ready event</i> by 
* <i>function verifyRequirementsAndStartSocket</i>. To run the demo, the 
* browser must support the features used by the browser&mdash;this is a 
* requirement.
* @description <b>Comments</b><br>
* <i>Function detectCompatibleBrowser</i> calls the following 
*  helper functions:<br>
* <ul>
* <li>detectChrome</li>
* <li>detectEdge</li>
* <li>detectFirefox</li>
* <li>detectInternetExplorer</li>
* <li>detectOpera</li>
* <li>detectSafari</li>
* </ul>
*<b>Functionality of Helper Functions</b><br>
*<i>Function detectCompatibleBrowser</i> calls each helper function 
* until one helper function detects the browser. Each helper function 
* returns an object with the following browser information properties:
*<ul>
* <li><i><b>name</b></i> {string} The name of the browser; otherwise,
* an empty string if the browser is not detected.</li>
* <li><i><b>found</b></i> {boolean} Indicates whether the helper function
* detected the browser:<br> 
* <ul>
*     <li><strong>true</strong>. The browser is detected.</li>
*     <li><strong>false</strong>. The browser is not detected.</li>
* </ul>     
* <li><i><b>compatible</b></i> (string} Indicates whether the browser is 
* compatible with the client, which can be any of the following constants:</li>  
*    <ul>
*     <li>COMPATIBLE_YES </li>
*     <li>COMPATIBLE_UNKNOWN</li>
*     <li>COMPATIBLE_NO</li>
*   </ul>
* </ul> 
* If the helper function detects the browser, the function discovers the 
* version of the browser. A helper function eliminates an incompatible 
* version by setting the <i>compatible</i> property of the object to 
* COMPATIBLE_NO. Following is a partial list of the browser versions 
* that are too early to run the demo:
* <ul>
* <li> Internet Explorer version 10 and earlier.</li>
* <li> Chrome version 49 and earlier.</li>
* <li> Firefox version 37 and earlier.</li>
* <li> Opera version 40 and earlier.</li>
* <li> Safari version 9 and earlier.</li>
* </ul>
* The helper function displays an error message to the user if the browser
* is not compatible.<br><br>
* <b>Action on an Incompatible Browser</b><br>
* <i>Function detectCompatibleBrowser</i> throws an 
* exception if the <i>compatible</i> property indicates the browser is not 
* compatible. <br><br>  
* <b>Browsers Undetected</b><br>
* The function does not detect all browsers. However, undetected browsers  
* run the demo anyway. Following are the browsers undetected: <br>
* Blink, Facebook, Dolphin, Onion, Ghostery, iCab, Intego Rook, Maxthon, 
* Mercury, Puffin, Grazing, Perfect, Diigo, Sleipnir, Maven, Night Web, 
* Red Onion, or UC. 
* @throw STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW
* @throw STR_UNEXPECTED_PROGRAM_RESULT <br>
*/        
function detectCompatibleBrowser(){
  try { 
    if (MY_TRACE === 1) {writeToConsole('starting detectCompatibleBrowser');}
        
    var browserInfo = detectInternetExplorer();
   
    if (browserInfo.found !== true) {  
       browserInfo = detectFirefox();
    } 
    if (browserInfo.found !== true) {
       browserInfo = detectOpera();
    } 
    if (DEBUG === 1) {writeToConsole("After Opera! ");}
    if (browserInfo.found !== true){
       browserInfo = detectSafari();
    }  
    if (DEBUG === 1){writeToConsole("After Safari! ");}
    if (browserInfo.found !== true) {
         browserInfo = detectChrome();     
    }
     if (DEBUG === 1){writeToConsole("After Chrome! ");}
     if (DEBUG === 1){writeToConsole(browserInfo.name +browserInfo.found 
         + browserInfo.compatible);}
     
    if (browserInfo.found !== true) {
       browserInfo = detectEdge();    
    }
    if (DEBUG === 1) {writeToConsole("After Edge! ");}
    
    if ((browserInfo.found === true) && 
        (browserInfo.compatible === COMPATIBLE_YES)){
      if (DEBUG === 1) {writeToConsole("found true & compatible yes!");}
      return;
    } else if (browserInfo.found === false) { //Assumption--Entire browser code 
                                // was traversed, and the code did not find 
                                // the make of the browser. 
                               // Or, the browser is one for which we did not 
                               // test, which could be any of the following: 
                               // IOS, Blink, Facebook, Android, UC, and so on. 
      alert(STR_SOFTWARE_PROVIDED_AS_IS + STR_BROWSER_UNTESTED);
      // Permit script execution to continue with this unknown browser
      if (DEBUG===1) {writeToConsole('Unknown browser. User Agent= ' + 
          navigator.userAgent);}
    } else if (browserInfo.compatible === COMPATIBLE_NO) {              
      if (MY_TRACE === 1) {writeToConsole('Browser version is too early,\n\
          throwing exception!');}
      throw new Error(STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW);       
      // Added Nov 7
    } else if (browserInfo.compatible === COMPATIBLE_UNNOWN) {     
     if (DEBUG===1) {writeToConsole("COMPATIBLE_UNNOWN");}
    } else {
      if (MY_TRACE === 1) {writeToConsole('detectCompatibleBrowser() \n\
          produced an unexpected result');}
      throw new Error(STR_UNEXPECTED_PROGRAM_RESULT);
    } 
  } catch (e) {
    if (DEBUG===1) {writeToConsole('EXCEPTION in detectCompatibleBrowser()'+
        "name and message: " + e.name + " " + e.message);}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    throw e;
  }
}//end function detectCompatibleBrowser
             
      // Function TestViewportSize(): test for compatible viewport sizes
      // ISSUE: June 2017--for this Beta version, I didnt use the Bootstrap JS
      // so I do not have a tiny alert, warning or error dialog for small viewports.
      // Assumptions on function call:
      // Function detectBrowser() has already been called to do a browser test
      // that eliminates tiny mobile devices, and early versions of browsers that 
      // are not compatible to my Web page code. Therefore, the only issue remaining
      // for the Web page maybe the size of the viewport.
      // If the userÂ´s viewport is too small, the function asks the user
      // to increase the size of the browser window.
      // IF PROBLEM, throws and exception!
 function testViewportSize() {
    try {
       if (MY_TRACE===1){writeToConsole("TRACE: at Function testViewportSize()");}
        
       var viewportwidth;
       var viewportheight;
     
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight 
        if (typeof window.innerWidth !== 'undefined') {
          viewportwidth = window.innerWidth;
          viewportheight = window.innerHeight;
        } else if ((typeof document.documentElement !== 'undefined') &&
                 (typeof document.documentElement.clientWidth !=='undefined') && 
                 (document.documentElement.clientWidth !== 0)) {
              // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document
             viewportwidth = document.documentElement.clientWidth;
             viewportheight = document.documentElement.clientHeight;
        } else {// older versions of IE

           viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
           viewportheight = document.getElementsByTagName('body')[0].clientHeight;
        }
//12-31-17 RM TEST FOR VIEWPORT SIZE
//        if ((viewportwidth < TEST_WIDTH) || (viewportheight < TEST_HEIGHT)) {
//           // before responsive design w/breakpoints: I used 800 x 450 and 760 x 470
//           if (DEBUG===1){ (writeToConsole("Viewport size too small: width x height=" + viewportwidth +'x'+ 
//                     viewportheight));}
//           if (MY_TRACE === 1) {writeToConsole('Viewport size too small:, throwing exception.');}
//               throw new Error (STR_BROWSER_VIEWPORT_TOO_SMALL);
////
//            
            //'This page works better with a bigger window. Expand the \n\
            //window. The exact measurements are: ('+STR_TEST_WIDTH +'x'+ STR_TEST_HEIGHT + ' pixels.)');
            //    'x' + TEST_HEIGHT + ' pixels.' Thanks.');
            //For the demo, the window must be a minimum of '+ STR_TEST_WIDTH +
            //    'x' + STR_TEST_HEIGHT + ' pixels.'
            //    900 x 500pixels--about the size of a laptop.
            //ignore -->window.location.reload(true); this causes constant blinking
        // "The width and height of your browser window is " + viewportwidth +'x'+ 
          //   viewportheight +' pixels.' +
//        }
    } catch(e) {
        if (DEBUG===1){writeToConsole("EXCEPTION in testViewportSize()" + "name and message: " + e.name + " " + e.message);}
        if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
        throw e;
    }  
} // end func testViewportSize
  
/** 
* @summary Validates a price. 
* @description <b>Comments</b> <br><br>
* Determines whether <i>currPrice</i> is a number, and within the bounds set
* by the constants XBT_VALID_LOWER_BOUND and XBT_VALID_UPPER_BOUND.<br>
* The function is called by <i>function checkMessageForUpdate</i>
* to test the validity of the last transaction price extracted from the 
* server message.
*@returns {boolean} A boolean that indicates whether the price is valid.
*@param {number} currPrice The last transaction price.
**/
function isValidData(currPrice) {
  try {
    if (MY_TRACE === 1){ writeToConsole('TRACE: isValidData');}        
    // var price_from = $('.filter-price #price_from').val();
    // var price_to = $('.filter-price #price_to').val();
    var isNumberRegExp = new RegExp(/^[-+]?[0-9]+(\.[0-9]+)*$/);
    
    if (!isNumberRegExp.test(currPrice)) {
      if (DEBUG===1){writeToConsole ("Current price of " + currPrice + 
          "is not a number");}
         //alert("Price quote received, not a number (NaN).\n");
      return false;
             // bail out here, something isnÂ´t right!
    } 
    if (!((Number(currPrice).toFixed(2)> XBT_VALID_LOWER_BOUND) && 
            (Number(currPrice).toFixed(2) < XBT_VALID_UPPER_BOUND))) {
      if (DEBUG===1){writeToConsole("Current price of " + currPrice +
          "is not within bounds.");}
      return false;            
    } else { 
      return true;   
    }
  } catch(e) {
    if (DEBUG===1){writeToConsole("EXCEPTION in isValidData()+ name and \n\
        message: " + e.name + " " + e.message);}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
    return false;           
  }
}//end function isValidData()


//function requestData
// Assumptions:
// 1) Function detect_browser was executed
// BEFORE this function is called.
// Issue was: All browsers have a XMLHTTPRequest object
// And early versions of Internet Explorer (IE) that do 
// not support the object are prohibited from running 
// this code by function detect_browser.
// 2) Cross-origin-requests (CORS) errors are considered 
// data provider errors, i.e: The server at the data 
// provider has not implemented CORS, yet.
// As of June 2017,  all data providers used by this Web page
// have been tested with no CORS errors. Therefore, if 
// the browser believes there is a CORS error, then
// something recently has changed with the data provider.
function requestData() { 
    var xhr = null;
   
   if (MY_TRACE === 1) {writeToConsole('TRACE: at requestData()');}
   
   if (TEST_MODE===1) {
   
   get(arr_ExchangeNetworks[i_ExchangeIterator].req_URL)
   
    //get(arr_ExchangeNetworks[i_ExchangeIterator].req_URL).then(function(text) {
    //   writeToConsole("data.txt: " + text);
    //   }, function(error) {
    //     writeToConsole("Failed to fetch data.txt: " + error);
   // });
    
   i_ExchangeIterator++;
   if (i_ExchangeIterator === NUM_EXCHANGES_NETS){
      i_ExchangeIterator = 0;
      if (DEBUG === 1) {writeToConsole('iterator incremented');}
    }
  } //end if testmode == 1
 } //end request data     
    
 function get(url) {        
    if (MY_TRACE === 1) {writeToConsole('TRACE: at get() NOT RequestData()');}
    //return new Promise(function(succeed, fail) {
    //var req = new XMLHttpRequest();
    var xhr = new XMLHttpRequest();
    if (xhr === null) {if (DEBUG === 1) { writeToConsole('Yikes! xhr is NULL');}
        throw new UserException('xhr is NULL');
    }
    //req.open("GET", url, true);
    //FOR TEST of CORS ONLY xhr.open("GET","https://btc-e.com/api/3/ticker/btc_usd", true);
    //
    // true for 3rd arg means asynchronous!
    //xhr.open("GET", arr_ExchangeNetworks[i_ExchangeIterator].req_URL, true);  
    xhr.open("GET", url, true);

    xhr.onload = function () {

        if (MY_TRACE === 1) {writeToConsole('TRACE:at onload()');}
        if (DEBUG === 1) { writeToConsole('readystate is ' +
                    this.readyState + ' STATUS CODE=' + xhr.status + ' STATUS TEXT= ' +
                    JSON.stringify(xhr.statusText));
            writeToConsole(' RESPONSETEXTstringfied=  ' + JSON.stringify(xhr.responseText));
            writeToConsole(' RESPONSETEXT plain=  ' + xhr.responseText);

        }
        if (xhr.status < 400) {
          succeed(xhr); //need succeed method
        } else {
          fail(new Error("Request failed: " + xhr.statusText));
        }  
         // response = null; // we never use this!
         
        hTimer = setTimeout(requestData, NUM_MS_TIMEOUT_BEFORE_REQUESTDATA);
      }; //end onload func (nested function in func requestData)
      
      xhr.onerror = function ()  {
          if (MY_TRACE === 1) {writeToConsole('TRACE:at onerror()');}
          
          fail(new Error("Network error"));  
        
      };  //end oneerror
    
    xhr.send();
   }    //end function get NOT requestData()

//the call: fail(new Error("Request failed: " + xhr.statusText));
function fail(e) {
       
   if (e.message === "Network error") {
        showDialog("You are disconnected, or the network is slow...", STR_FOR_BROWSER_DISCONNECTED, 'prompt', false);
         
        stopDemo(STR_FOR_BROWSER_DISCONNECTED);
    } else {
    if (DEBUG === 1) {writeToConsole('BAD DATA--the data or data format does not match expected format.');}
        showDialog("Oops... an error occurred.", STR_GENERIC_ERROR, 'prompt', false);
        //alert(STR_GENERIC_ERROR);
        stopDemo(STR_GENERIC_ERROR);
    }
}//end function fail

// I am not sure where in the promise infrastructure this function
// should be called!
   function succeed (xhr) {     //analyze responseText        

    if (JS_CHART === null) {
        if (DEBUG === 1) {writeToConsole('CAUGHT USER EXCEPTION...MAIN CHART NULL.');}
        throw 'Main chart null, try again.';
    }
    if (((JS_CHART.series[0]) === null) || ((JS_CHART.series[1]) === null)) {
       if (DEBUG === 1) {writeToConsole('CAUGHT USER EXCEPTION...SERIES CHART NULL.');} 
        throw 'Series chart null, try again.';
    }

    var response_Source = "Do not know source data provider.";


// ***************** CHECK FOR WHO IS PRICE PROVIDER ***************** 
     if (('status')in JSON.parse(xhr.responseText)) {
                // if ((status_200 == true) && (('mining_difficulty')in JSON.parse(xhr.responseText[2])))
            if (DEBUG === 1) {writeToConsole('In ChainSo & response is:' +
                        JSON.stringify(xhr.responseText));}

            response_Source = "ChainSo";

            //Save/get last price for the %price +/- calculation
            var last_Price = document.getElementById('m-TableCell1-P2P-Price').firstChild.nodeValue;

            var price_BTC = JSON.parse(xhr.responseText).data.price;//a string

            // truncate as number and convert back to string
            var curr_Price = Number(price_BTC).toFixed(4);

            if (!(isValidData(curr_Price))) {//Check bounds
                   if (DEBUG === 1) {writeToConsole('Status passed the status \n\
                    test; however data is not valid' + STR_FOR_BAD_DATA); }
            }

            var price_Time = (JSON.parse(xhr.responseText)).data.price_update_time;

            // SET PRICE TABLE with new/current price (trunc at 2 decimal pts) 
            document.getElementById('m-TableCell1-P2P-Price').firstChild.nodeValue = Number(curr_Price).toFixed(2);
            if (MY_TRACE === 1) {writeToConsole('Set the value in price table');}

            //price_ToPrint = Number(Number(price_BTC).toFixed());
            if (DEBUG === 1) {writeToConsole('Price to set' + Number(curr_Price).toFixed(2));}
            
            // SET PRICE IN CHART SERIES
            // args list add point: point, bool redraw, bool shift; truncate to 2 decimal points
            JS_CHART.series[0].addPoint([Number(Number(curr_Price).toFixed(2))], false, true);

            // SET PERCENT CHANGE in price table
            // Check if first-time through this code--If so, there is no last price.
            if (last_Price !== STR_FOR_USERWAIT) {
                // Curr_Price is 4 decimal places, but last_Price is two decimal places.
                var diff_CurrMinusLast = curr_Price - last_Price;
                if (DEBUG === 1) {writeToConsole('diff_CurrMinusLast=' + diff_CurrMinusLast);}
                //Truncate and set color to green (#15F015,#20d020), red (#FF0000), or black #000000
                var n_X = Number((diff_CurrMinusLast / last_Price) * 100).toFixed(2);
                setPercentPriceChange(n_X, window.document.getElementById("m-TableCell2-P2P-Percent"));
            }
      // ***************** CHECK FOR WHO IS PRICE PROVIDER ***************** 
      } else if ("ok" in JSON.parse(xhr.responseText)) {
            // else if ((status_200 == true) && ((JSON.parse(xhr.responseText)).search"tickers")!= -1)
             //Data cleaning? # of decimals by data provider--CEX.IO: quotes at 4 decimal places
                // BTC-e: quotes at 3 and Chain.so quotes at 8 decimal places       
                if (DEBUG === 1) {writeToConsole('In CEX.IO & response is:' +
                            JSON.stringify(xhr.responseText));}
                response_Source = "CEX.IO";

                // Before update price field in table (new price)--
                // Get the (last, old) price in the table for the %+/- calculation
                var last_Price = document.getElementById('m-TableCell1-CEXIO-Price').firstChild.nodeValue;

                var price_BTC = Number((JSON.parse(xhr.responseText)).data[0].last);//a string
                var curr_Price = Number(price_BTC).toFixed(4);

                if (!(isValidData(curr_Price))) { //Check bounds
                    if (DEBUG === 1) {writeToConsole('Status passed the test; however data is not valid' +
                                STR_FOR_BAD_DATA);}
                }
                var price_Time = (JSON.parse(xhr.responseText)).data[0].timestamp;
                // SET PRICE TABLE with new/current price (trunc at 2 decimal pts) from CEX.IO response
                document.getElementById('m-TableCell1-CEXIO-Price').firstChild.nodeValue = Number(curr_Price).toFixed(2);
                if (DEBUG === 1) {writeToConsole('Set the value in price table');}
            
                //price_ToPrint = Number(Number(price_BTC).toFixed());
                if (DEBUG === 1) {writeToConsole('Price to set' + Number(curr_Price).toFixed(2));}

                /// SET PRICE IN CHART SERIES
                //param list: addPoint([Number(Number(val_series0))], bool redraw,bool shift);
                JS_CHART.series[1].addPoint([Number((Number(curr_Price).toFixed(2)))], false, true);
                // INSERT HERE FOR DO WORKAROUND Add else part for workaround.
                JS_CHART.redraw();

                // SET PERCENT INCREASE/DECREASE in price table
                // Price used includes to 4 decimals (all data providers provide this)
                if (last_Price !== STR_FOR_USERWAIT) {
                    //Truncate and set color to green (#15F015,#20d020), red (#FF0000), or black #000000
                    var diff_CurrMinusLast = curr_Price - last_Price;
                    var n_X = Number((diff_CurrMinusLast / last_Price) * 100).toFixed(2);
                    setPercentPriceChange(n_X, window.document.getElementById("m-TableCell2-CEXIO-Percent"));
                } // end last_Price !== STR_FOR_USERWAIT
            } else //end if CEX.IO origin
       { //****************** Who or what sent the data? The data did not match 
         //the data format from any of my service providers ****************** 
            if (DEBUG === 1) {writeToConsole('BAD DATA--the data or data format does not match expected format.');}
            showDialog("The price data was not parseable.", STR_FOR_BAD_DATA, 'prompt', false);
          
       }
  } //end function succeed
    
 
 
function setPercentPriceChange(n_X, element_ToSet) {
 try {
    if (MY_TRACE === 1) {writeToConsole('TRACE: at setPercentPriceChange()');}

    if ((n_X === 0.00) || (!isFinite(n_X))) {
        if (DEBUG === 1) {writeToConsole('DIFF EQ ZERO or NOT isFinite' + n_X);}

        element_ToSet.firstChild.nodeValue = " 0.00%";
        element_ToSet.style.color = "#000000";
    }
    if (n_X < 0) {
        //No prepend ¨-¨: negative already in the string
        element_ToSet.firstChild.nodeValue = n_X.concat("%");
        element_ToSet.style.color = "#FF0000";
    }
    if (n_X > 0) {
        element_ToSet.firstChild.nodeValue = ("+".concat(n_X)).concat("%");
        element_ToSet.style.color = "#20d020";
    }
  } catch (e) {
    if (DEBUG===1){writeToConsole("EXCEPTION:setPercentPriceChange(), name and message: " + e.name + " " + e.message);}
    if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}        
  }  
} //end func setPercentPriceChange                           

// JQuery--Resize event function--
// June 2017: I have not implemented a dialog (for alert, error, 
// prompt, or warning messages) for small devices. 
// The HTML code should break to accomodate a small view port.
// However, the custom dialog size in the code is too big the
// smallest smart phone. 
// Therefore, function testViewportSize() should deny 
// any size smaller than custom dialog box.
//Not running $(window).resize function because
// one Alert box is shown to the user in testViewportSize()
//$(window).resize(function()
//{
//testViewportSize();

// })


// JQuery
// Create the chart...On the window.load event call the RequestData function
// THIS IS the EVENTs variable OF THE OPTIONS defined for Highchart 
// in function createChart().
// At the end RequestData() set a timer to call requestData again to
// keep asking for the new price!
//$(document).ready: Executes when the HTML document is loaded & DOM tree created
// $(window).on("load", function() {
//     Executes when the COMPLETE PAGE is fully loaded (not just the DOM tree)}
// ---including all frames, objects and images of the tree.
$(document).ready(function () {
   // REST API Demo Version
   if (MY_TRACE === 1) {writeToConsole('TRACE; at document.ready');}
   var reason = "I LOVE YOU!";
   try  {
       //All of the following functions throw an error back 
       // if there is an issue. For example, in browser version or viewport size 
       // and compatibility with code, or in creating the initial chart.
       detectCompatibleBrowser();
       
       testViewportSize();
       
       createChart();
                 
    } catch (e) {
      if (DEBUG === 1) {writeToConsole ("EXCEPTION in document).ready anon function)(), name and message: " +
                  e.name + " " + e.message);}
      if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}         

      if (e.message === STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW) {
          if (DEBUG === 1) {writeToConsole('EXCEPTION in ready() event: '+ STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW);}
            alert(STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW);
            reason = STR_BROWSER_VERSION_TOO_EARLY_FOR_VIEW;

       } else if (e.message === STR_BROWSER_VIEWPORT_TOO_SMALL) {
          if (DEBUG === 1) {writeToConsole('EXCEPTION in ready() event: '+ STR_BROWSER_VIEWPORT_TOO_SMALL);}
          alert(STR_BROWSER_VIEWPORT_TOO_SMALL);
          reason = STR_BROWSER_VIEWPORT_TOO_SMALL;
       } else { //there could have been a STR_UNEXPECTED_PROGRAM_RESULT
                // something I didnt expect in detectBrowser()
           alert(STR_GENERIC_ERROR);
           reason = STR_GENERIC_ERROR;
       }
       stopDemo(reason);

    } //end catch
            
    if (DEBUG === 1) {writeToConsole('DOCUMENT IS READY: Setting options');}

  } // end of bracket to describe function

 ); //end anon func on document.ready  
    
    //////////////////////////////////////
// Create the initial HighChart´s chart, and setup to
// dynamically add values when a price update message is sent from 
// BitFinex
// returns nothing (that would be a JavaScript undefined);
// throws any exception back to caller
//          
/////////////////////////////////////
function createChart() {
    if (MY_TRACE === 1){writeToConsole('TRACE: at createChart()');}
    try {
    var options = {
        chart: {
            // To do: Legend and tooltip
            backgroundColor: '#c3c3c3', //scrub #c0b3a0 blue #BEC5D3
            borderColor: 'black', //'plum' #644f7f #ff6666Defaults to #335cad
            borderWidth: 3, //in pixels-In styled mode, the stroke is set with
            // the .highcharts-background class.
            renderTo: 'container_Chart',
            //defaultSeriesType: 'line', //changed from spline // deprecated-- 
            //type: line //default

            //className: String //A CSS class name to apply charts container div,
            //colorCount: Number -colors array
            //description: String  //accessibility mode
            type: 'spline',
            animation: Highcharts.svg,

            events: {
                // Fires when the chart is finished loading.
                // Load waits for images to be loaded
                load: requestData
            }
        },
        // added new color
        colors: ['#22252c',  '#644f7f', '#3b88ad', '#8cc83c', '#ee2c2c', '#3b88ad', '#c19fd0'],

        credits: {
            enabled: true,
            text: 'Providers: www.chain.so,www.cex.io',
            style: {"fontSize": "12px","font-weight": "bold"}

        },
        title: {
            text: 'Bitcoin Price',
            style: {"color": "#333333", "fontSize": "18px","font-weight": "bold"}
        },

        subtitle: {
            text: 'Updated every 10 seconds',
            margin: 5
        },

        xAxis: {
            tickInterval: 5, //interval of X values every pointInterval secs
            //min: 0, this maybe the problem!
            // type: 'datetime',
            //tickPixelInterval: 150,
            title: {
                text: 'Seconds',
                margin: 10
            }
        }, //end x-axis
        yAxis: {
            id: 'm_YAxis',
            minPadding: 0.0,
            maxPadding: 0.0,
            tickInterval: 5, //9-28 changed tick interval from 25 to 5
                             //(it is .5 in socket demo) 
                             // Controls the interval of the grid on y-axis
            endOnTick: true, //may round up or round down the axis
            startOnTick: true,
            //floor:2700,
            //ceiling: 2850,
            // max:2850,
            // min: 2700,
            //softMin:2700,
            //softMax:2850,

            title: {
                text: 'Last Transaction Price',
                margin: 10
            },
            plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
        }, //end y-axis

        // each series is a differnt line on the graph
        // Series is an array with brackets for each line
        // where each bracket has name and data
        // [{},{},{},{}]
        series:
                [// [0] Only one series for this demo.
          {   
           name: 'Bitcoin Peer-to-Peer (P2P)<br> Network',
           style:{ "color": "#ffffff", "fontSize": "14px" },
            
           /* Note that datetime axes are based on milliseconds, 
           * so for example an interval of one day is expressed 
           * as 24 * 3600 * 1000.
           */
           pointInterval: 10, //interval of X values every pointInterval secs
           pointStart: 0, 
           lineWidth: 1,
           data: [3860, 3779, 3850, 3779, 3845]
          },
          {   
           name: 'CEX.IO Exchange',
           //style:{ "color": "#ffffff", "fontSize": "14px" },
            
           /* Note that datetime axes are based on milliseconds, 
           * so for example an interval of one day is expressed 
           * as 24 * 3600 * 1000.
           */
           pointInterval: 10, //interval of X values every pointInterval secs
           pointStart: 0, 
           lineWidth: 1,
           data: [3870, 3800, 3895, 3800, 3880]
          }
       ]
                
    };// end options

    if (MY_TRACE === 1){writeToConsole('TRACE: before init js_chart');}
    JS_CHART = new Highcharts.Chart(options);
    
    if (JS_CHART !== null) {
      if (DEBUG===1) {writeToConsole('Created new HighChart object');}
    } else {
      throw new Error("Failed to create chart. JS_CHART is null.");  
    }
   } catch(e) {
       if (DEBUG === 1) {writeToConsole ("EXCEPTION in createChart(), name and message: " + e.name + " " + e.message);}
       if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
       throw e;
   }
} //end createChart

function stopDemo(reason) {
       
 try { 
       if (MY_TRACE === 1){writeToConsole('TRACE: at stopDemo().');}
       if (DEBUG === 1){writeToConsole('reason to end Demo:', reason);}
       //stop the setTimeoutInterval of client
       if (hTimer)  { 
           clearTimer(hTimer);
           hTimer = null;
       }
       
       //var str = new String(reason); 
       //if (str.indexOf(STR_UPDATES_WILL_PAUSE) !== -1) {
         //  reason =  " Updates should resume in 10 seconds. However, this version of the \n\
          //            demo (the Beta version) does not handle this case without shutting down first. Please wait\n\
            //            10 seconds, and then reload the page to resume price updates.";
       //}
       
       //Update GUI to say we are quitting
       var stopDemoDiv = document.createElement('div');
       stopDemoDiv.className = "alert-stop-demo";
       stopDemoDiv.style.fontSize="smaller";
       stopDemoDiv.innerHTML = "<strong>The demo has stopped. </strong>" + reason + " Thanks for visiting!"; //PROCESSES the HTML
       //var cc = document.getElementById("m-container-text");//THIS WORKED
       //var cc = document.getElementById("m-title-div-w-border");
       var cc = document.getElementById("m-hWelcome");
      // cc.append(stopDemoDiv);

       //LAST alternative document.write( "<br><br><br><br><br>" + "The demo will stop now. Thanks for visiting!"); 
      // alert("The demo will stop now. Thanks for visiting!");
          
      } catch (e) {
          
         if (DEBUG===1){writeToConsole("EXCEPTION in stopDemo(), name and message: " + e.name+ " " +e.message + " ");}
         if ((DEBUG===1) && (e.stack)){writeToConsole("stack: " + e.stack);}
         
      }
   } // end function stopDem()


// Function writeToConsole
// Assumptions: Function detect_browser is executed--before calling this function--to 
// eliminate early version of Internet Explorer (IE)--versions 10 and earlier are
// prohibited from running this function. (Early versions of browser may reject 
// the console code in this function). Permit only IE 11 or later--
// for all other browsers, assume console exists.
function writeToConsole(msg) {
    // detect_browser should be run before this function
    // to eliminate IE version < 11. Set empty function for definition
    if (!window.console) {
        window.console = {log: function () {}};
    } else
    {
        //if (window.console && window.console.log) {
        // console is available
        window.console.log(msg);

    }
} //end writeToConsole

// Hover takes two arguments!
$("#italic-hover").hover(function () {//the first func is what the text is changed to
    $(this).css("background-color", "#dcdce1");
    $(this).text("for the demo, the Bitcoin exchange is BitFinex"); // what it switches to
}, function () {
    $(this).css("background-color", "#c0b3a0"); // what is returns to is scrub
    $(this).text("Bitcoin exchange");
});


$("#m-TableCell1").hover(function () {//the first func is what the text is changed to
    //$(this).css("background-color", "#c3c3c3", "font-size", "6px", "color", "#000000");
    $(this).css(style = "background-color:#c3c3c3;color:#000000;font-size:4px");
    $(this).text("Peer-to-Peer (P2P) Network");
}, function () {
    $(this).css("background-color", "#22252c");
    $(this).text('Bitcoin P2P');
});



// drop-down info panel
$("#flip").click(function () {
    //  $("#panel").slideDown("slow"); .toggle();
    $("#panel").toggle("slow");
});

function alertX(msg) {
    if ((DEBUG === 1) && (SHOW_ALERTS === 1)) {
        alert('IN ALERTX, this is user notification:' + msg);

    }
}


///////////////////////////Dialog functions  /////////////////////////////////
//The following is custom-dialog code I downloaded from www.scriptiny.com/2008/04/custom-javascript-dialog-boxes/
// Issue: This code does does not create a modal dialog--stopping program execution
// while waiting for the user to respond. Therefore, I only use the code when there
// is an error that deadends the code, e.g. function onerror is called for a network error.
// In function detectBrowser I use the system Alert for notification of 
// browser incompatibilities so that the program first shows the bad browser Alert,
// and waits for user dismiss, so that I can close the page. If I use the code
// that follows, after the custom dialog shows, program execution goes ahead i.e.  
// running ahead to create the chart and make a network call for data, when
// I want the window to shut if the browser is not compatible.
// 
// calculate the current window width //
// 9/11 added strict equal to all comparisons that follow
// 9/11 changed all var to let
function pageWidth() {
  return window.innerWidth !== null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body !== null ? document.body.clientWidth : null;
}

// calculate the current window height //
function pageHeight() {
  return window.innerHeight !== null? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body !== null? document.body.clientHeight : null;
}

// calculate the current window vertical offset //
function topPosition() {
  return typeof window.pageYOffset !== 'undefined' ? window.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
}

// calculate the position starting at the left of the window //
function leftPosition() {
  return typeof window.pageXOffset !== 'undefined' ? window.pageXOffset : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
}

// build/show the dialog box, populate the data and call the fade_Dialog function //
// always call this with autohide false!
function showDialog(title,message,type,autohide) {
 /*showDialog("You are disconnected, or the network is slow...", STR_FOR_BROWSER_DISCONNECTED, 'prompt', false);*/
 try{
  alert(title + message);
  //if (MY_TRACE === 1){writeToConsole('TRACE: At showDialog()');}      
 
  //if(!type) {
  //  type = 'error';
 // }
      
  //var dialog;
  //var dialogheader;
  //var dialogclose;
  //var dialogtitle;
  //var dialogcontent;
  //var dialogmask;
  //if (!document.getElementById('dialog')) {
    //dialog = document.createElement('div'); //So NOT using the Dialog class
    //dialog.id = 'dialog';
    //dialogheader = document.createElement('div');
    //dialogheader.id = 'dialog-header';
    //dialogtitle = document.createElement('div');
    //dialogtitle.id = 'dialog-title';
    //dialogclose = document.createElement('div');
    //dialogclose.id = 'dialog-close';
    //dialogcontent = document.createElement('div');
    //dialogcontent.id = 'dialog-content';
    //dialogmask = document.createElement('div');
    //dialogmask.id = 'dialog-mask';
    //document.body.appendChild(dialogmask);// And the mask is also at the root
    //document.body.appendChild(dialog);  //SO THE DIALOG IS THE root or PARENT!
    //dialog.appendChild(dialogheader);
    //dialogheader.appendChild(dialogtitle);
    //dialogheader.appendChild(dialogclose);
    //dialog.appendChild(dialogcontent);;
    //dialogclose.setAttribute('onclick','hide_Dialog()');
    //dialogclose.onclick = hide_Dialog; 
    //var btn = document.createElement("BUTTON");        // Create a <button> element
    //btn.style.backgroundColor = "#ffe4fb";
    //btn.style.border = "1px solid black";
    //btn.style.padding = "5px";  
    //btn.style.fontsize = "12px";
    //btn.id = "close-button";
    //var t = document.createTextNode("OK");       // Create a text node
    //btn.appendChild(t);                          // Append the text to <button>
    //btn.addEventListener("click", function(){hide_Dialog();});
    //dialog.appendChild(btn);  
  //} else {  
    //if (DEBUG === 1){writeToConsole('AT ELSE no dialog!');}      
    //dialog = document.getElementById('dialog');
    //dialogheader = document.getElementById('dialog-header');
    //dialogtitle = document.getElementById('dialog-title');
    //dialogclose = document.getElementById('dialog-close');
    //dialogcontent = document.getElementById('dialog-content');
    //dialogmask = document.getElementById('dialog-mask'); //had this commented out
    //dialogmask.style.visibility = "visible";//had this commented out
    //dialog.style.visibility = "visible";
  //}
  //dialog.style.opacity = .00;
  //dialog.style.filter = 'alpha(opacity=0)';
  //dialog.alpha = 0;
  //var width = pageWidth();
  //var height = pageHeight();
  //var left = leftPosition();
  //var top = topPosition();
  //var dialogwidth = dialog.offsetWidth;
  //var dialogheight = 300; //or dialog.offsetHeight; 
  //var topposition = top + (height / 3) - (dialogheight / 2);
  //var leftposition = left + (width / 2) - (dialogwidth / 2);
  //dialog.style.top = topposition + "px";
  //dialog.style.left = leftposition + "px";
  //dialogheader.className = type + "header";
  //dialogtitle.innerHTML = title;
  //dialogcontent.innerHTML = message; //TEXT TEXT TEXT TEXT
  ////////var content = document.getElementById(WRAPPER); System does not use
  //dialogmask.style.height = '320' + 'px'; //CHANGE     
 // dialog.timer = setInterval("fade_Dialog(1)", TIMER); // YO: SHOW THE DIALOG?
  //if(autohide) {
    //dialogclose.style.visibility = "hidden";
    //window.setTimeout("hide_Dialog()", (autohide * 1000));
  //} else {
    //dialogclose.style.visibility = "visible";
  //}
 } catch(e)
 {
    if (DEBUG===1){writeToConsole('EXCEPTION CAUGHT: function showDialog()');}
     
 }
} // end function


// hide the dialog box //
function hide_Dialog() {
  if (MY_TRACE === 1){writeToConsole('TRACE: At hide_Dialog');}      
 
  var dialog = document.getElementById('dialog');
  dialog.style.display = "none";  //Yo: I added ..Ok the button disappears
  //how to lift the mask?//Yo: I added ..
  var dialogmask = document.getElementById('dialog-mask');//Yo: I added ..
  dialogmask.style.display = "none";  //Yo: I added ..
  //clearInterval(dialog.timer);
 // dialog.timer = setInterval("fade_Dialog(0)", TIMER);
}

// fade-in the dialog box //
//function fade_Dialog(flag) {
//  if (MY_TRACE === 1){writeToConsole('TRACE: At fade_Dialog');}
  
//  if(flag === null) {
//    flag = 1;
//  }
//  var dialog = document.getElementById('dialog');
//  var value;
//  if(flag === 1) {
//    value = dialog.alpha + SPEED;
//  } else {
//    value = dialog.alpha - SPEED;
//  }
//  dialog.alpha = value;
//  dialog.style.opacity = (value / 100);
//  dialog.style.filter = 'alpha(opacity=' + value + ')';
//  if(value >= 99) {
//    clearInterval(dialog.timer);
//    dialog.timer = null;
//  } else if(value <= 1) {
//    dialog.style.visibility = "hidden";
//    document.getElementById('dialog-mask').style.visibility = "hidden";
//    clearInterval(dialog.timer);
//  }
//}


function mail_To() {
  
  // The purpose of the mailTo script is to prevent
  //   email link harvesting by spammer's robots.
  //   Nothing shows in the file where this is used,
  //   other than an empty 'span' element. The mailto
  //   link is added dynamically, and will not show
  //   up even when you "View Source".
   try {
     if (MY_TRACE === 1){writeToConsole('TRACE: At mail_To');}
     var email = "recipient@website.com";
  
     if (!document.getElementById("mailTo")) return false;
  
     var spanobj = document.getElementById("mailTo");
     var anch = document.createElement("a");
     var mailto = "mailto:" + email;
     anch.setAttribute("href",mailto);
     anch.style.color = "#ffffff";
     spanobj.appendChild(anch);
     var txt = document.createTextNode(email);
     anch.appendChild(txt);
   } catch(e) {
    if (DEBUG===1){writeToConsole('EXCEPTION in function mail_TO()');}
 }
} // end function
// reference $(window).on('load', function (e) {})
$(window).on('load', mail_To); 

