import {createPlaneMarker, createMesh} from './scene.js';
import * as THREE from 'https://unpkg.com/three@0.146.0/build/three.module.js';

class ARRawAccessButton {

	static createButton( renderer, sessionInit = {} ) {

		const button = document.createElement( 'button' );
		let hitTestSource = null;
		let hitTestSourceRequested = false;
		let camera, scene, box, container;
		let controller;
		let gl, glBinding;

		init();

		function init(){
			container = document.createElement('div');
			document.body.appendChild(container);

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 20);


			const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
			scene.add(ambientLight);

			box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xff0000}));
			box.position.z =-3;
			scene.add(box);
			container.appendChild(renderer.domElement);

			
			controller = renderer.xr.getController(0);

			controller.addEventListener('select', function () {
				if (planeMarker.visible) {
					scene.add(createMesh(planeMarker.matrix));
				}
			});

			scene.add(controller);
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

			//

			let currentSession = null;

			async function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );
				

				renderer.xr.setReferenceSpaceType( 'local' );

				gl = renderer.getContext();

				await renderer.xr.setSession( session ).then(ses => {
					gl.makeXRCompatible().then((x)=>{
						console.log(session);
						glBinding = new XRWebGLBinding(session, gl);
					}).catch(e=>{
						console.log(e);
					});
				});

			
				button.textContent = 'STOP AR';
				sessionInit.domOverlay.root.style.display = '';

				currentSession = session;

				currentSession.requestAnimationFrame(onXRFrame);

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'START AR';
				sessionInit.domOverlay.root.style.display = 'none';

				currentSession = null;

			}

			//

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
			if (frame) {

				const referenceSpace = renderer.xr.getReferenceSpace();
				let pose = frame.getViewerPose(referenceSpace);

				if(pose){
					for(const view of pose.views){
						if(view.camera){
							const cameraTexture=glBinding.getCameraImage(view.camera);
							const texture = new THREE.TextureLoader().load(cameraTexture);

							
							const material = new THREE.MeshBasicMaterial( { map: texture } );

							
							box.material = material;
						}
					}
				}
		
			}
			renderer.render(scene, camera);
		}

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