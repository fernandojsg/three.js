import {
	Object3D,
	SphereBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	CanvasTexture,
	Quaternion
} from "../../../build/three.module.js";

import * as THREE from "../../../build/three.module.js";

import { GLTFLoader } from "../loaders/GLTFLoader.js";
import { FBXLoader } from "../loaders/FBXLoader.js";

const gltf = false;

class OculusMeshHand {

	constructor( controller, handedness ) {

		this.controller = controller;
		this.bones = [];
		var loader = new FBXLoader();

		loader.load( `/examples/models/fbx/OculusHand_${handedness === "right" ? "R" : "L"}.fbx`, object => {

			this.controller.add( object );
			object.scale.setScalar( 0.01 );
			object.frustumCulled = false;

			const bonesMapping = [
				'b_%_wrist', // XRHand.WRIST,

				'b_%_thumb1', // XRHand.THUMB_METACARPAL,
				'b_%_thumb2', // XRHand.THUMB_PHALANX_PROXIMAL,
				'b_%_thumb3', // XRHand.THUMB_PHALANX_DISTAL,
				'b_%_thumb_null', // XRHand.THUMB_PHALANX_TIP,

				null, //'b_%_index1', // XRHand.INDEX_METACARPAL,
				'b_%_index1', // XRHand.INDEX_PHALANX_PROXIMAL,
				'b_%_index2', // XRHand.INDEX_PHALANX_INTERMEDIATE,
				'b_%_index3', // XRHand.INDEX_PHALANX_DISTAL,
				'b_%_index_null', // XRHand.INDEX_PHALANX_TIP,

				null, //'b_%_middle1', // XRHand.MIDDLE_METACARPAL,
				'b_%_middle1', // XRHand.MIDDLE_PHALANX_PROXIMAL,
				'b_%_middle2', // XRHand.MIDDLE_PHALANX_INTERMEDIATE,
				'b_%_middle3', // XRHand.MIDDLE_PHALANX_DISTAL,
				'b_%_middlenull', // XRHand.MIDDLE_PHALANX_TIP,

				null, //'b_%_ring1', // XRHand.RING_METACARPAL,
				'b_%_ring1', // XRHand.RING_PHALANX_PROXIMAL,
				'b_%_ring2', // XRHand.RING_PHALANX_INTERMEDIATE,
				'b_%_ring3', // XRHand.RING_PHALANX_DISTAL,
				'b_%_ring_inull', // XRHand.RING_PHALANX_TIP,

				'b_%_pinky0', // XRHand.LITTLE_METACARPAL,
				'b_%_pinky1', // XRHand.LITTLE_PHALANX_PROXIMAL,
				'b_%_pinky2', // XRHand.LITTLE_PHALANX_INTERMEDIATE,
				'b_%_pinky3', // XRHand.LITTLE_PHALANX_DISTAL,
				'b_%_pinkynull', // XRHand.LITTLE_PHALANX_TIP
			];
			bonesMapping.forEach( boneName => {

				if ( boneName ) {

					const bone = object.getObjectByName( boneName.replace( "%", handedness === "right" ? "r" : "l" ) );
					this.bones.push( bone );

				} else {

					this.bones.push( null );

				}

			} );

			var loader2 = new GLTFLoader();
			loader2.load( '/examples/models/gltf/watch.glb', object => {

				if ( handedness === "left" ) {

					let watch = object.scene;
					window.watch = watch;
					watch.rotation.y = - 0.2;
					watch.rotation.x = - 1.6;
					watch.scale.set( 0.02, 0.015, 0.015 );
					this.controller.joints[ 0 ].add( watch );


					const canvas = document.createElement( 'canvas' );
					const ctx = canvas.getContext( '2d' );
					this.watchContext = ctx;
					ctx.canvas.width = 512;
					ctx.canvas.height = 512;
					ctx.fillStyle = '#000';
					//ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
					document.body.appendChild( canvas );
					//for (var i=0;i<20;i++) drawRandomDot();

					this.watchTexture = new CanvasTexture( ctx.canvas );
					this.watchTexture.minFilter = THREE.LinearFilter;
					this.watchTexture.magFilter = THREE.LinearFilter;


					watch.children[ 1 ].material.map = this.watchTexture;
					this.watchTexture.needsUpdate = true;

				}

			} );


		} );

	}

	updateMesh() {

		const defaultRadius = 0.008;
		const limit = 30;

		// XR Joints
		const XRJoints = this.controller.joints;
		for ( var i = 0; i < this.bones.length; i ++ ) {

			const bone = this.bones[ i ];
			const XRJoint = XRJoints[ i ];

			if ( XRJoint ) {

				if ( XRJoint.visible ) {

					let position = XRJoint.position;

					if ( bone ) {

						bone.position.copy( position.clone().multiplyScalar( 100 ) );
						bone.quaternion.copy( XRJoint.quaternion );
						// bone.scale.setScalar( XRJoint.jointRadius || defaultRadius );

					}

				}


			}

			if ( i >= limit ) {

				return;

			}

		}

		// WATCH
		let canvass = stats.dom.querySelector( "canvas" );
		const ctx = this.watchContext;
		if ( ! ctx ) {

			return;

		}
		ctx.fillStyle = "#000000";
		ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
		ctx.drawImage( canvass, 0, 0, 512, 360 );

		ctx.fillStyle = "#ffffff";
		ctx.font = "20px Impact";
		//ctx.fillText("Hello World!", 10, 50);
		ctx.textAlign = "center";

		var gradient = ctx.createLinearGradient( 0, 0, canvass.width, 0 );
		gradient.addColorStop( "0", " #0000ff" );
		gradient.addColorStop( "0.5", "#2222ff" );
		gradient.addColorStop( "1.0", "#5555ff" );
		ctx.fillStyle = gradient;
		const d = new Date();
		const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
		const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
		const s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
		ctx.font = "120px Verdana";
		ctx.fillText( h + ":" + m + ":" + s, canvass.width / 2 + 220, 470 );

		this.watchTexture.needsUpdate = true;


		/*
		for ( var i = 0; i < this.children.length; i ++ ) {

			const jointMesh = this.children[ i ];
			const XRJoint = XRJoints[ i ];

			if ( XRJoint ) {

				if ( XRJoint.visible ) {

					jointMesh.position.copy( XRJoint.position );
					jointMesh.quaternion.copy( XRJoint.quaternion );
					jointMesh.scale.setScalar( XRJoint.jointRadius || defaultRadius );

				}

				jointMesh.visible = XRJoint.visible;

			}

		}
*/

	}

}


function XRHandModel( controller ) {

	Object3D.call( this );

	this.controller = controller;
	this.motionController = null;
	this.envMap = null;

	this.mesh = null;

	return;
	/*
	if ( window.XRHand ) {

		var geometry = new SphereBufferGeometry( 1, 10, 10 );
		var jointMaterial = new MeshStandardMaterial( { color: 0x000000, roughness: 0.2, metalness: 0.8 } );
		var tipMaterial = new MeshStandardMaterial( { color: 0x333333, roughness: 0.2, metalness: 0.8 } );

		const tipIndexes = [
			XRHand.THUMB_PHALANX_TIP,
			XRHand.INDEX_PHALANX_TIP,
			XRHand.MIDDLE_PHALANX_TIP,
			XRHand.RING_PHALANX_TIP,
			XRHand.LITTLE_PHALANX_TIP
		];
		for ( let i = 0; i <= XRHand.LITTLE_PHALANX_TIP; i ++ ) {

			var cube = new Mesh( geometry, tipIndexes.indexOf( i ) !== - 1 ? tipMaterial : jointMaterial );
			cube.castShadow = true;
			this.add( cube );

		}

	}
*/

	this.bones = [];

	if ( ! gltf ) {

		var loader = new FBXLoader();
		loader.load( '/examples/models/fbx/OculusHand_L.fbx', object => {

			const model = object; // object.scene.children[ 0 ];
			model.scale.setScalar( 0.01 );


			/*
			const bonesMapping = [
				'handsb_r_hand', // XRHand.WRIST,

				'handsb_r_thumb1', // XRHand.THUMB_METACARPAL,
				'handsb_r_thumb2', // XRHand.THUMB_PHALANX_PROXIMAL,
				'handsb_r_thumb3', // XRHand.THUMB_PHALANX_DISTAL,
				'handsb_r_thumb_ignore', // XRHand.THUMB_PHALANX_TIP,

				null,//'handsb_r_index1', // XRHand.INDEX_METACARPAL,
				'handsb_r_index2', // XRHand.INDEX_PHALANX_PROXIMAL,
				'handsb_r_index3', // XRHand.INDEX_PHALANX_INTERMEDIATE,
				'handsb_r_index3', // XRHand.INDEX_PHALANX_DISTAL,
				'handsb_r_index_ignore', // XRHand.INDEX_PHALANX_TIP,

				null,//'handsb_r_middle1', // XRHand.MIDDLE_METACARPAL,
				'handsb_r_middle2', // XRHand.MIDDLE_PHALANX_PROXIMAL,
				'handsb_r_middle3', // XRHand.MIDDLE_PHALANX_INTERMEDIATE,
				'handsb_r_middle3', // XRHand.MIDDLE_PHALANX_DISTAL,
				'handsb_r_middle_ignore', // XRHand.MIDDLE_PHALANX_TIP,

				null,//'handsb_r_ring1', // XRHand.RING_METACARPAL,
				'handsb_r_ring2', // XRHand.RING_PHALANX_PROXIMAL,
				'handsb_r_ring3', // XRHand.RING_PHALANX_INTERMEDIATE,
				'handsb_r_ring3', // XRHand.RING_PHALANX_DISTAL,
				'handsb_r_ring_ignore', // XRHand.RING_PHALANX_TIP,

				'handsb_r_pinky0', // XRHand.LITTLE_METACARPAL,
				'handsb_r_pinky1', // XRHand.LITTLE_PHALANX_PROXIMAL,
				'handsb_r_pinky2', // XRHand.LITTLE_PHALANX_INTERMEDIATE,
				'handsb_r_pinky3', // XRHand.LITTLE_PHALANX_DISTAL,
				'handsb_r_pinky_ignore', // XRHand.LITTLE_PHALANX_TIP
			];
*/
			bonesMapping.forEach( boneName => {

				const bone = model.getObjectByName( boneName );
				this.bones.push( bone );

			} );

			//model.children[0].scale.setScalar(0.01);
			window.model = model;
			this.add( model );

		} );

	} else {

		var loader = new GLTFLoader();

		loader.load( '/examples/models/gltf/XRHandRightv6.glb', object => {

			const model = object.scene.children[ 0 ];

			const bonesMapping = [
				'WRIST',

				'THUMB_METACARPAL',
				'THUMB_PHALANX_PROXIMAL',
				'THUMB_PHALANX_DISTAL',
				'THUMB_PHALANX_TIP',

				'INDEX_METACARPAL',
				'INDEX_PHALANX_PROXIMAL',
				'INDEX_PHALANX_INTERMEDIATE',
				'INDEX_PHALANX_DISTAL',
				'INDEX_PHALANX_TIP',

				'MIDDLE_METACARPAL',
				'MIDDLE_PHALANX_PROXIMAL',
				'MIDDLE_PHALANX_INTERMEDIATE',
				'MIDDLE_PHALANX_DISTAL',
				'MIDDLE_PHALANX_TIP',

				'RING_METACARPAL',
				'RING_PHALANX_PROXIMAL',
				'RING_PHALANX_INTERMEDIATE',
				'RING_PHALANX_DISTAL',
				'RING_PHALANX_TIP',

				'LITTLE_METACARPAL',
				'LITTLE_PHALANX_PROXIMAL',
				'LITTLE_PHALANX_INTERMEDIATE',
				'LITTLE_PHALANX_DISTAL',
				'LITTLE_PHALANX_TIP'
			];

			bonesMapping.forEach( boneName => {

				const bone = model.getObjectByName( boneName );
				this.bones.push( bone );

			} );

			window.model = model;
			this.add( model );

		} );

	}

}

XRHandModel.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: XRHandModel,

	updateMatrixWorld: function ( force ) {

		Object3D.prototype.updateMatrixWorld.call( this, force );

		if ( this.motionController ) {

			this.motionController.updateMesh();

		}

	},
} );


var XRHandModelFactory = ( function () {

	function XRHandModelFactory() {}

	XRHandModelFactory.prototype = {

		constructor: XRHandModelFactory,

		createHandModel: function ( controller, profile ) {

			const handModel = new XRHandModel( controller );
			let scene = null;

			controller.addEventListener( 'connected', ( event ) => {

				const xrInputSource = event.data;
				console.log( "Connected!", xrInputSource );

				if ( xrInputSource.hand && ! handModel.motionController ) {

					handModel.visible = true;
					handModel.xrInputSource = xrInputSource;

					if ( xrInputSource.handedness === 'any' ) {
					} else {

						handModel.motionController = new OculusMeshHand( controller, xrInputSource.handedness );

					}

					// profile ?


				}

			} );

			controller.addEventListener( 'disconnected', () => {

				handModel.visible = false;
				//handModel.remove( scene );
				scene = null;

			} );

			return handModel;

		}

	};

	return XRHandModelFactory;

} )();


export { XRHandModelFactory };
