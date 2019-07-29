<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta name="robots" content="noindex,nofollow">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet"> 
        <link rel="stylesheet" media="all" href="styles.css">
        <title>Demos</title>
        <meta charset="Windows-1252"> 
        <style>
        ul li {
             padding: 5px 5px 5px 5px;
         }
        </style>
    </head>
    <body> 
        
        <div class="wrap-centered-content">    
        <div class="m-container-text">
        <span class="m-i-by"><b>My answer to the Google Prescreen Questions</b>:
        All the work presented on this Portfolio page, including the creation of this Web page, was  
        written by me from scratch without any edits by an editor, or programmed by me without any help from
        a software developer. I have software development experience.</span><br><br>
        <hr style="border:2px solid #ff0000;">
        <!--Sincerely,<span class="m-i-by"> Ash Morgan</span-->
        <h1>Portfolio of Ash Morgan</h1>
        <p>The sections that follow provide access to and describe my portfolio, which consists of a programming demo, a Swagger demo,
            and writing samples. The content is not optimized for a hi-res device, 
        such as a device with Retina display.</p>
        <!--[if IE lte 9]><br><br><p style="background-color:#c0b3a0;color:blue;padding:.94rem;">
         The Web page cannot be
         displayed in your browser. Upgrade your browser to the recent Chrome,
         Internet Explorer, Opera, Firefox or Safari. Thanks!</p><br><br><![endif]-->
<a id="documentationSamples"></a>
     <h2>A Programming Demo: Bitcoin Price in Real Time&mdash;an Implementation of REST APIs</h2>
     <p>I wanted to get hands-on experience with REST API. So I built this programming demo for which I am solely responsible:
     I conceived of the idea and wrote the code. If I had a technical question, I consulted StackOverflow.com or an official
     documentation set.</p> 
     <p>The demo is responsive to changes in screen size (viewport size).</p>
         <p>My demo runs from its <a class="my-link" href="https://github.com/cryptoEstudiante/rest-api-demo">
       GitHub repository</a> using GitHub Pages.
         To see my demo click
       <a class="my-link" href="https://cryptoestudiante.github.io/rest-api-demo/">
        here. </a>
       </p>
        <h3>Writing Sample: Design Overview of the Demo</h3>
       <p>I programmed my JavaScript client (client) to implement the 
       REST APIs of two data providers: a bitcoin exchange (<a class="my-link" href="https://cex.io/">CEX.IO</a>)
       and a blockchain reader.
      The APIs enable the client to request real-time last transaction prices for bitcoin from the data providers. The client
      displays the prices in a chart on its Web page using the
       <a class="my-link" href="https://www.highcharts.com">
       Highcharts</a> JavaScript code library.</p>
       <h4>Every 5 Seconds the Client Requests the Last Transaction Price for Bitcoin from a Data Provider</h4>
       <p>The requests are periodic because the client uses a timer 
       and sets the timeout period to 5 seconds as the following sample code shows:<p>
       <pre>
     var hTimer = setTimeout(requestData, NUM_MS_TIMEOUT_BEFORE_REQUESTDATA);
     </pre>
       where the constant NUM_MS_TIMEOUT_BEFORE_REQUESTDATA has a value of 5000 (in milliseconds) or 5 seconds.
    <p> At every timeout, the browser calls function <i>requestData</i> that sets up and makes a HTTP Get request to a provider.
        For example, to get the last transaction price from CEX.IO for bitcoin (BTC) in terms of the U.S. dollar 
        (USD), function <i>requestData</i> makes a <i>tickers</i> call on the CEX.IO endpoint as the following
        sample code shows: 
        </p>
       <pre>         var xhr = new XMLHttpRequest();
          if (xhr === null) {
             if (DEBUG === 1) { writeToConsole('xhr is NULL');}
               throw new UserException('xhr is NULL');
          }
          xhr.open("GET", "https://cex.io/api/tickers/BTC/USD", true);
          xhr.send();
       </pre>
        [Note: The CEX.IO API documentation does not use the term <i>method</i> for the callable units of their API,
        instead the term <i>call</i> is used.]
        
          <p>For more information on the <i>tickers</i> call, see <a class="my-link" href="https://cex.io/rest-api#tickers-for-all-pairs-by-markets">
           Tickers for all pairs by markets</a>.</p>
                  
        <!--The client instantiates a <a class="my-link" href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest?redirectlocale=en-US&redirectslug=DOM%2FXMLHttpRequest"> 
           XMLHttpRequest</a> object-->
           <p>Function <i>requestData</i> rotates between data providers at every timeout; for example, if the current
               request for the last transaction price is to CEX.IO, at the next five second timeout Function <i>requestData()</i>
                   requests the last transaction price from the blockchain reader.</p>
           <p>The value of "true" for the last parameter of method <i>xhr.open</i> indicates the call is
            asynchronous (async). The browser calls the client method <i>xhr.onload</i> at the callback from the server.</p> 
        <p>
       If the HTTP status code from the server indicates success (<i>xhr.status < 400</i>), the client calls 
       function <i>succeed</i>; otherwise the client calls function <i>fail</i>, which ends the demo.
       Function <i>succeed</i> calls <a class="my-link" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse">
      JSON<i>.parse</i></a> to convert the <i>xhr.responseText</i> of type <i>string</i> to a JavaScript-compatible object.
      The <i>data field</i> of the object contains the result of the call; that is, prices structured according to the <a class="my-link" href="https://cex.io/rest-api#/definitions/Ticker">    
    Ticker</a> schema. Therefore, the
      last transaction price is accessible as the <i>last</i> property of the <i>data</i> field, as follows:</p>
       <pre> 
         var price_BTC = Number((JSON.parse(xhr.responseText)).data[0].last);
       </pre> 
         <h4>Every 10 Seconds the Client Updates its Web Page Chart with the Last Transaction Prices for Bitcoin 
             and Sets the Timeout for the Next Request</h4>
       <p> The value of variable <i>price_BTC</i> for each provider is stored as a chart point in 
           a <i>series</i> array of the HighCharts
        chart object. Shifting the chart points forward in time is managed by Highcharts. The client calls method 
        <i>addPoint</i>
        that appends a chart point to the end of the series while shifting off the chart point at the start of the series.
        </p>
        
        <p>Every 10 seconds, the client displays the values in the <i>series</i> array for each provider. The 
            client calls a HighCharts method to update and redraw the chart in the 
            <i>activity box</i> of its Web page.
                Then the client sets another timeout to request data again from a price provider. <p>
                <h4>Exception Handling at Run Time</h4>
 <p>If an exception occurs at run time, a catch statement in the client tries to determine
 the cause of the exception. The client displays an error message on its Web page and calls function <i>stopDemo</i>. 
<!--The first object in the <i>data</i> array, <i>data[0]</i>, contains the properties for bitcoin in the format of the 
<a class="my-link" href="https://cex.io/rest-api#/definitions/Ticker">Ticker</a> schema.
The <i>last</i> property is the last transaction price, as follows:
       <a class="my-link" href="https://cex.io/rest-api#APIResponse"></a> object.
      The format of the operation result that contains the last transation price is the 
     <!--ul>
      <li-->
      <!--/li>
     </ul-->  
      <h2>Writing Samples: Markdown file and Demo Function Reference for WebSockets Programming Demo</h2>
      <p>
      I wanted to get hands-on experience with WebSockets, too. I programmed another demo in which my
      JavaScript client (client) implements the HTML 5 WebSocket interface to get real-time bitcoin prices. 
      I programmed the demo two years ago. Unfortunately, <b>this demo now has a bug</b>: the server pushes a few prices
      to the client and then quits. You will not
      have a run-time view of the demo. However, what is the purpose of documentation? See if the documentation
      that follows helps you understand the demo.
      </p>
         <ul>
          <li>In the <a class="my-link" href="https://github.com/cryptoEstudiante/xbt-websocket-with-server/blob/master/README.md">
                  README.md file</a>, I describe in Markdown format the functionality and appearance of the WebSocket demo at startup.
          </li>
          <li>Links to the <i>Demo Function Reference</i>:
          <ul>
              <li>At the JQuery <i>ready event</i>, the browser calls  
              function<a class="my-link" href="http://jsdoc-sample.s3-website-us-west-2.amazonaws.com/global.html#verifyRequirements">
              <i>verifyRequirements</i></a>. The graphic in this section 
              illustrates the logical view of verifying requirements at startup.
             </li>
             <li> After the client opens a WebSocket with a BitFinex WebSocket server, 
              function <a class="my-link" href="http://jsdoc-sample.s3-website-us-west-2.amazonaws.com/global.html#onmessage">
             <i>onmessage</i></a> is the entry point into the client and handles BitFinex events from the server.
              </li>  
              <li> See the <a class="my-link" href="http://jsdoc-sample.s3-website-us-west-2.amazonaws.com/">Home</a>
                  page for audience, terminology, scope, and perspective.
             </li>
         </ul>
        </li>
      </ul>        
      <p>(Note: <img src="google-rain-umbrella.png" style="padding:2px;height:30px;width:30px;"> If you said that documenting your own code for a writing sample was a "You´re so Vain" moment (as in the song by Carly Simon), I´d agree! I should have documented
          an open source project. Unfortunately, at the time of my REST API and WebSocket explorations I wasn´t thinking "open source.")
          <!--img src="1206567239782949660Anonymous_heart_1_svg_thumb.png" style="padding:3px;height:30px;width:40px;"-->
      </p>       
     <p> I generated the <i>Demo Function Reference</i> with <a class="my-link" href="https://github.com/jsdoc3/jsdoc">JSDoc</a>.
      However, I made some undocumented changes to the JSDoc CSS files.
     </p>
      <a name="swagger"></a>
      <h2>A Swagger Demo<img src="images/new-gr.png" style="padding:3px;height:30px;width:40px;" ></h2> 
       <!--b>Porting Two Calls from the CEX.IO REST API to the OpenAPI Specification Version 3.0 (OAS3)</b><br><br-->
       <!--To show I understand the composition of a REST API and can use the Swagger Editor, I prepared this demo.
       <!--Documentation of a REST API requires an understanding of its composition.-->
       <!--<br><br-->
       <a class="my-link" href="https://swagger.io/">Swagger</a> is a framework of API developer tools for the 
       <a class="my-link" href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md">
       OpenAPI specification</a> (OAS). Using Swagger, you generate documentation of an API from its OpenAPI definition.
       The Swagger demo is a port.
       <br><br>
       <b>I ported</b> the following two <b>non-OAS</b> REST API calls to the OpenAPI specification version 3.0 (OAS3):
       <ol>
        <li><a class="my-link" href="https://cex.io/rest-api#last-price">Last price</a>- Gets the last transaction price 
               for a specified currency. 
        </li>
        <li> <a class="my-link" href="https://cex.io/rest-api#chart">Chart</a> - Gets a chart
             of last transaction prices for a specified currency.
        </li>     
       </ol>
    <p>I wrote OAS3 definitions of the two calls in YAML format.
    To see my call definitions in the Swagger editor (center panel) and their generated documentation (rightmost panel)
    click <a class="my-link"
    href="https://app.swaggerhub.com/apis/demoDelphi/cex-io-rest-api-subset-for-demo/1.0.9#/">here</a>.
    <br><br> 
    </p>
    <a name="view-swagger-demo"></a>  
        <a name="footnote"></a>
     <footer>  
        <hr style="border:2px solid #ff0000;"> 
        Thank you for taking the time to look at my portfolio!<br><br>
          <span class="m-i-by">July 29, 2019</span>
    </footer>
       <br>
       </div>
      </div>
   </body>
</html>
