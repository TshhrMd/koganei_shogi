        var clientId = "659548277904-r7mh983gmc7u3gm0vl98tgm9708gnpbo.apps.googleusercontent.com";
        var scopes = ['https://www.googleapis.com/auth/gmail.send'].join(' ');

        function onLoadCallbackFunction() {
            gapi.auth.authorize({'client_id': clientId, 'scope': scopes, 'immediate': true}, handleAuthResult);
        }

        function callbackFunction() {
				window.alert('callbackFunction');
        }


        function handleAuthClick(event) {
            gapi.auth.authorize({'client_id': clientId, 'scope': scopes, 'immediate': false}, handleAuthResult);
            return false;
        }


      function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
          gapi.client.load('gmail', 'v1', callbackFunction);
        } else if (authResult['error'] == "immediate_failed"){
        	gapi.auth.authorize({'client_id': clientId, 'scope': scopes, 'immediate': false}, handleAuthResult);;
        } else {
				window.alert('auth error : ' + authResult.error);
        }
      }

        function sendMail() {
        try{
			if(window.confirm('メッセージを送信しますか？')){
	            var mimeData = ["To: koganeishogi@gmail.com",
    	        "Subject: =?utf-8?B?" + window.btoa(unescape(encodeURIComponent("お問い合わせ"))) + "?=",
        	    "MIME-Version: 1.0",
            	"Content-Type: text/plain; charset=UTF-8",
            "Content-Transfer-Encoding: 7bit",
            "",
            "ここから本文"].join("\n").trim();
 
            var raw = window.btoa(unescape(encodeURIComponent(mimeData))).replace(/\+/g, '-').replace(/\//g, '_');

            gapi.client.gmail.users.messages.send({
                'userId': 'me',
                'resource': {
                    'raw': raw
                }
            }).execute(function() {
				window.alert('送信しました');
            });
			}
			else{
				window.alert('キャンセルされました');
			}
		}catch(e){
		console.log(e);
		}
        }


