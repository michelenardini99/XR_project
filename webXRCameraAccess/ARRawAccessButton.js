class ARRawAccessButton{
    static createButton(renderer, sessionInit={}){
        const button = document.createElement('button');
        
        if('xr' in navigator){
            button.id='ARButton';
            button.style.display='none';

            stylizeElement(button);
            navigator.xr.isSessionSupported('immersive-ar').then(function(supported){
                supported ? showStartAR() : showARNotSupported();
            }).catch(showARNotAllowed);
            return button;
        }else{
            const message = document.createElement('a');

            if(window.isSecureContext == false){
                message.href=document.location.href.replace(/^http:/,'https.');
                message.innerHTML='WEBXr NEEDS HTML';
            }else{
                message.href='https://immersiveweb.dev/';
                message.innerHTML='WEBXR NOT AVAILABLE';
            }

            message.style.left='calc(50% - 90px)';
            message.style.width='180px';
            message.style.textDecoration='none';

            stylizeElement(message);

            return message;
        }

        function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '20px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'rgba(0,0,0,0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';

		}

        function showStartAR(){
            console.log("Supported");
        }

        function showARNotSupported(){
            console.log("not supported");
        }

        function showARNotAllowed(){

        }

    }
}

export {ARRawAccessButton};