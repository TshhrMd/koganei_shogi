
var outputArea = $("#chat-output");
var kb;
var i;
var message;
var botMessage;
var botContext;
var botT;

$(document).ready(function(){
  $.getJSON("kb.json" , function(data) {
     kb = data;
  });
});

$("#user-input-form").on("submit", function(e) {

  e.preventDefault();
  i = 0;
  message = $("#user-input").val();
  
  selectMessage();


});

function selectMessage(){
    botMessage = "";
    if (/平野/.test(message)) {
		i = 0;
		botT = "";
		localStorage.setItem('contact_person_id', i);
    }else if (/まいっちんぐ/.test(message)) {
		i = 1;
		botT = "30";
		localStorage.setItem('contact_person_id', i);
    }else if (/関西/.test(message)) {
		i = 2;
		botT = "20";
		localStorage.setItem('contact_person_id', i);
	}else {
		i = localStorage.getItem('contact_person_id');
		if (i==null){
			i=0;
		}
	}
	if (/使い方/.test(message)) {
		botMessage += "\"料金\"とか\"場所\"とか、知りたいことを適当に入力すれば適当に回答します。<br/>なお、\"小金井将棋研究会\"と\"小金井こども教室\"以外のことについてはDoCoMoのAPIが応答します。";
	}
	else if (/料金|値段|いくら|費用/.test(message)) {
	    if (/こども教室/.test(message)){
			botMessage += kb[i].howMuchC;
	    }else if (/研究会/.test(message)){
			botMessage += kb[i].howMuchK;
	    }else{
			botMessage += kb[i].howMuch;
		}
	}
	else if (/時間|いつ|何時|開始/.test(message)) {
	    if (/こども教室/.test(message)){
			botMessage += kb[i].whenC;
	    }else if (/研究会/.test(message)){
			botMessage += kb[i].whenK;
	    }else{
			botMessage += kb[i].when;
		}
	}
	else if (/予定|今度|何日|何曜日/.test(message)) {
		botMessage += kb[i].nextPlan;
	}
	else if (/場所|どこ|何処/.test(message)) {
		botMessage += kb[i].where;
	}
	else if (/誰|だれ|参加/.test(message)) {
	    if (/こども教室/.test(message)){
			botMessage += kb[i].whoC;
	    }else if (/研究会/.test(message)){
			botMessage += kb[i].whoK;
	    }else{
			botMessage += kb[i].who;
		}
	}
	else if (/指導|先生|棋士/.test(message)) {
	    if (/こども教室/.test(message)){
			botMessage += kb[i].masterC;
	    }else if (/研究会/.test(message)){
			botMessage += kb[i].masterK;
	    }else{
			botMessage += kb[i].master;
		}
	}
	else if (/７六歩/.test(message)) {
		botMessage += kb[i].f34;
	}else if (/２六歩/.test(message)) {
		botMessage += kb[i].f84;
	}
	else if (/何を/.test(message)) {
	    if (/こども教室/.test(message)){
			botMessage += kb[i].whatC;
	    }else if (/研究会/.test(message)){
			botMessage += kb[i].whatK;
	    }else{
			botMessage += kb[i].what;
		}
	}
	else if (/どんな|どのように|どうやって/.test(message)) {
		botMessage += kb[i].how;
	}
	
	else if (botMessage=="" && /子供教室|こども将棋|こども教室/.test(message)){
	    if (/料金/.test(message)){
			botMessage += kb[i].howMuchC;
	    }else if (/場所/.test(message)){
			botMessage += kb[i].where;
	    }else if (/時間/.test(message)){
			botMessage += kb[i].whenC;
	    }else if (/誰/.test(message)){
			botMessage += kb[i].whoC;
	    }else if (/先生/.test(message)){
			botMessage += kb[i].masterC;
	    }else if (/何を/.test(message)){
			botMessage += kb[i].masterC;
	    }else{
			botMessage += kb[i].child;
		}
	}
	else if (botMessage=="" && /小金井研|小金井将棋|研究会/.test(message)){
	    if (/料金/.test(message)){
			botMessage += kb[i].howMuchK;
	    }else if (/場所/.test(message)){
			botMessage += kb[i].where;
	    }else if (/時間/.test(message)){
			botMessage += kb[i].whenK;
	    }else if (/誰/.test(message)){
			botMessage += kb[i].whoK;
	    }else if (/先生/.test(message)){
			botMessage += kb[i].masterK;
	    }else if (/何を/.test(message)){
			botMessage += kb[i].masterK;
	    }else{
			botMessage += kb[i].adult;
		}
	}
	else if (/を調べて$/.test(message)) {
    	$.ajax({
    		type: "GET",
    		url: 'https://api.apigw.smt.docomo.ne.jp/knowledgeQA/v1/ask?APIKEY=47775049666c6b5a4d30766e626d7549776b6b63644a524d374a7376503058664343643252324c46354e36&q='+message.slice(0, 5),
    		async: false,
    		success: function(data){
    			botMessage +=  data.message.textForDisplay;
    			$(data.answers).each(function(){
		   			botMessage +=  "<br/>";
    				botMessage +=  this.answerText;
		   			botMessage +=  "<br/>";
    				botMessage +=  "<a href='" + this.linkUrl + "' target='_blank'>" + this.linkText + "</a>";
		   			botMessage +=  "<br/>";
    			});
    		},
    		failure: function(errMsg){
    			alert(errMsg);
    			botMessage +=  kb[i].other;
    		}
    	});
	}
	else if (/局面図$/.test(message)) {
		botMessage +=  "<figcaption>局面図</figcaption>";
		botMessage +=  "<pre class='shogizumen'>";
		botMessage +=  message.slice(0, 5);
		botMessage +=  "</pre>";
		botMessage +=  "</figure>";
	}
  outputArea.append(`

    <div class='user-message'>

      <div class='message'>

        ${message}
        
      </div>

    </div>

  `);
	if (botMessage==""){
		var req = {
  "utt": message,
  "context": botContext,
  "nickname": "",
  "nickname_y": "",
  "sex": "",
  "bloodtype": "",
  "birthdateY": "",
  "birthdateM": "",
  "birthdateD": "",
  "age": "",
  "constellations": "",
  "place": "",
  "mode": "dialog",
  "t": botT
};
		// botMessage +=  kb[i].other;
    	$.ajax({
    		type: "POST",
    		url: 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=47775049666c6b5a4d30766e626d7549776b6b63644a524d374a7376503058664343643252324c46354e36',
    		data: JSON.stringify(req),
    		contentType: "application/json; characterset=utf-9",
    		async: false,
    		dataType: "json",
    		success: function(data){
    			botMessage +=  data.utt;
    			//botMessage +=  kb[i].other;
    			botContext = data.context
    		},
    		failure: function(errMsg){
    			alert(errMsg);
    			botMessage +=  kb[i].other;
    		}
    	});
	}

  setTimeout(function() {

    outputArea.append(`

      <div class='bot-message'>

        <div class='message'>

          ${botMessage}

        </div>

      </div>

    `);

  }, 250);

  $("#user-input").val("");

};

function choiceMessage(msg){
    message = msg;
    selectMessage();
    return false;
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }


