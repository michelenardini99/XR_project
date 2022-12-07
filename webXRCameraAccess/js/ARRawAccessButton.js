import * as THREE from 'three';
import {MyScene} from './MyScene.js';
import {MqttClient} from './MqttClient.js';
import {Marker} from './Marker.js'



class ARRawAccessButton {

	static createButton( renderer, sessionInit = {} ) {

		const button = document.createElement( 'button' );
		let myScene;
		let gl, glBinding;
		let lastLampSelected = null;
		let raycaster;
		let client;
		let takeImage=false;
		const tempMatrix = new THREE.Matrix4();
		let markers = [];





		init();
		//initMarker();

		function init(/*startX, startY*/){
			client = new MqttClient();

			myScene = new MyScene(renderer, -10.5, -13);
			myScene.configScene();

			myScene.initMeshInScene()

			myScene.getController().addEventListener( 'selectstart', onSelectStart );


			raycaster = new THREE.Raycaster();

		}

		/* function initMarker(){
			markers[0] = new Marker('./asset/pattern-marker.patt');
			markers[1] = new Marker('./asset/alexide-marker.patt');
			predict()
		}

		function predict(imgPred){
			var param = new ARCameraParam('Data/camera_para.dat');
			let count=0;
		  
			param.onload = function () {
			  var img = document.getElementById('imgTest');
			  var ar = new ARController(img, param);
		  

		  
			  ar.addEventListener('markerNum', function (ev) {
				console.log('got markers', markerNum);
			  });
			  ar.addEventListener('getMarker', function (ev) {
				console.log('found marker?', ev);
			  });
			  for(let i=0;i<markers.length;i++){
				ar.loadMarker(markers[i].url, function (marker) {
					console.log('loaded marker', marker);
					count++;
					if(count==markers.length){
						ar.process(img);
					}
				  });
			  }
			 
			  
		  };
		} */

		function onSelectStart( event ) {

			const controller = event.target;

			intersectLamp(controller);
			if(lastLampSelected != null){
				intersectLink(controller);
			}
			takeImage=true;

		}

		function intersectLamp(controller){
			const intersections = getIntersections(controller, lampIntersection);

			if ( intersections.length > 0 ) {

				const intersection = intersections[ 0 ];

				const object = intersection.object;

				const lampSelected=myScene.getLamps().filter((lamp) => lamp.getMesh() == object);

				if(lastLampSelected != lampSelected[0] ){
					configTextLamp(lampSelected[0]);
					if(lastLampSelected != null){
						lastLampSelected.getMesh().remove(lastLampSelected.getMesh().children[0]);
					}
					
					lastLampSelected = lampSelected[0];
				}
			}
		}

		function intersectLink(controller){
			const intersections = getIntersections(controller, linkIntersection);

			if ( intersections.length > 0 ) {

				const intersection = intersections[ 0 ];

				const object = intersection.object;

				window.open(object.userData.URL);
			}
		}

		function configTextLamp(lampSelected){
			const lampData = client.getData()[lampSelected.getName()];

			if(lastLampSelected != null){
				lampSelected.getMesh().remove(lampSelected.getMesh().children[0]);
			}
			

			myScene.captureTextLamp(lampData["Brightness"], lampData["BallastStatus"], lampSelected.getMesh());

			if(client.getNeedToUpdate() == true){
				client.setNeedToUpdate(false);
			}
		}

		function getIntersections(controller, intersectFunction) {

			tempMatrix.identity().extractRotation( controller.matrixWorld );

			raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
			raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

			return intersectFunction();

		}

		function lampIntersection(){
			return raycaster.intersectObjects( myScene.getGroup().children, false );
		}

		function linkIntersection(){
			return raycaster.intersectObjects( lastLampSelected.getMesh().children, false );
		}



		function showStartAR( /*device*/ ) {

			if ( sessionInit.domOverlay === undefined ) {

				const overlay = document.createElement( 'div' );
				overlay.style.display = 'none';
				document.body.appendChild( overlay );

				const svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
				svg.setAttribute( 'width', 38 );
				svg.setAttribute( 'height', 38 );
				svg.style.position = 'absolute';
				svg.style.right = '20px';
				svg.style.top = '20px';
				svg.addEventListener( 'click', function () {

					currentSession.end();

				} );
				overlay.appendChild( svg );

				const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
				path.setAttribute( 'd', 'M 12,12 L 28,28 M 28,12 12,28' );
				path.setAttribute( 'stroke', '#fff' );
				path.setAttribute( 'stroke-width', 2 );
				svg.appendChild( path );

				if ( sessionInit.optionalFeatures === undefined ) {

					sessionInit.optionalFeatures = [];

				}

				sessionInit.optionalFeatures.push( 'dom-overlay' );
				sessionInit.domOverlay = { root: overlay };

			}

			let currentSession = null;

			async function onSessionStarted( session ) {


				session.addEventListener( 'end', onSessionEnded );
				

				renderer.xr.setReferenceSpaceType( 'local' );

				gl = renderer.getContext();

				await renderer.xr.setSession( session ).then(ses => {
					gl.makeXRCompatible().then((x)=>{
						glBinding = new XRWebGLBinding(session, gl);
					});
				});
	


			
				button.textContent = 'STOP AR';

				document.getElementById("container").style.display="none";
				
				sessionInit.domOverlay.root.style.display = '';

				currentSession = session;

				currentSession.requestAnimationFrame(onXRFrame);

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				sessionInit.domOverlay.root.style.display = 'none';

				document.getElementById("container").style.display="";

				currentSession = null;

			}

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';

			button.textContent = 'START AR';

			button.onmouseenter = function () {

				button.style.opacity = '1.0';

			};

			button.onmouseleave = function () {

				button.style.opacity = '0.5';

			};

			button.onclick = function () {
				if ( currentSession === null ) {
					navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

				} else {

					currentSession.end();

				}

			};
			

		}

		function onXRFrame(time, frame) {
			const session = frame.session;
			session.requestAnimationFrame(onXRFrame);

			if(client.getNeedToUpdate()==true && lastLampSelected != null){
				configTextLamp(lastLampSelected);
				client.setNeedToUpdate(false);
			}

			
			if(lastLampSelected != null && lastLampSelected.getMesh().children[0]){
				lastLampSelected.getMesh().children[0].lookAt(myScene.getCamera().position);
			} 

			if (frame) {

				const referenceSpace = renderer.xr.getReferenceSpace();
				let pose = frame.getViewerPose(referenceSpace);

				if(pose && takeImage==true){
					for(const view of pose.views){
						if(view.camera){
							const cameraTexture=glBinding.getCameraImage(view.camera);
							const img = createImageFromTexture(gl, cameraTexture, screen.width, screen.height);
							takeImage = false;
						}
					}
				} 
		
			} 

			renderer.render(myScene.getScene(), myScene.getCamera());
		}

		function createImageFromTexture(gl, texture, width, height) {
			// Create a framebuffer backed by the texture
			var framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
		
			// Read the contents of the framebuffer
			var data = new Uint8Array(width * height * 4);
			gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
		
			gl.deleteFramebuffer(framebuffer);
		
			// Create a 2D canvas to store the result 
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			var context = canvas.getContext('2d');
		
			// Copy the pixels to a 2D canvas
			var imageData = context.createImageData(width, height);
			imageData.data.set(data);
			context.putImageData(imageData, 0, 0);
		
			var img = new Image();
			img.src = canvas.toDataURL();
			return img;
		}

		window.addEventListener('resize', function(){
			myScene.getCamera().aspect = window.innerWidth/window.innerHeight;
			myScene.getCamera().updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});

		function disableButton() {

			button.style.display = '';

			button.style.cursor = 'auto';
			button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

		}

		function showARNotSupported() {

			disableButton();

			button.textContent = 'AR NOT SUPPORTED';

		}

		function showARNotAllowed( exception ) {

			disableButton();

			console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

			button.textContent = 'AR NOT ALLOWED';

		}

		function stylizeElement( element ) {

			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'blue';
			element.style.color = 'white';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';
			element.style.marginTop = "5%";

		}

		
		if ( 'xr' in navigator ) {

			button.id = 'ARButton';
			button.style.display = 'none';

			stylizeElement( button );

			navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {

				supported ? showStartAR() : showARNotSupported();

			} ).catch( showARNotAllowed );

			return button;

		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;

		}

	}

}

export { ARRawAccessButton };