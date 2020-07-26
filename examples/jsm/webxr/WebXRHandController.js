import {
	Object3D,
	SphereBufferGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion
} from "../../../build/three.module.js";

import { GLTFLoader } from "../loaders/GLTFLoader.js";
import { FBXLoader } from "../loaders/FBXLoader.js";

const gltf = false;

function XRHandModel( controller ) {

	Object3D.call( this );

	this.controller = controller;
	this.envMap = null;

	this.mesh = null;

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
		loader.load( '/examples/models/fbx/hand.fbx', object => {

			const model = object; // object.scene.children[ 0 ];
			model.scale.setScalar( 0.01 );

			const bonesMapping = [
				'b_r_wrist', // XRHand.WRIST,

				'b_r_thumb0', // XRHand.THUMB_METACARPAL,
				'b_r_thumb1', // XRHand.THUMB_PHALANX_PROXIMAL,
				'b_r_thumb2', // XRHand.THUMB_PHALANX_DISTAL,
				'b_r_thumb3', // XRHand.THUMB_PHALANX_TIP,

				'b_r_index1', // XRHand.INDEX_METACARPAL,
				'b_r_index2', // XRHand.INDEX_PHALANX_PROXIMAL,
				'b_r_index3', // XRHand.INDEX_PHALANX_INTERMEDIATE,
				'b_r_index3', // XRHand.INDEX_PHALANX_DISTAL,
				'b_r_index_null', // XRHand.INDEX_PHALANX_TIP,

				'b_r_middle1', // XRHand.MIDDLE_METACARPAL,
				'b_r_middle2', // XRHand.MIDDLE_PHALANX_PROXIMAL,
				'b_r_middle3', // XRHand.MIDDLE_PHALANX_INTERMEDIATE,
				'b_r_middle3', // XRHand.MIDDLE_PHALANX_DISTAL,
				'b_r_middlenull', // XRHand.MIDDLE_PHALANX_TIP,

				'b_r_ring1', // XRHand.RING_METACARPAL,
				'b_r_ring2', // XRHand.RING_PHALANX_PROXIMAL,
				'b_r_ring3', // XRHand.RING_PHALANX_INTERMEDIATE,
				'b_r_ring3', // XRHand.RING_PHALANX_DISTAL,
				'b_r_ring_inull', // XRHand.RING_PHALANX_TIP,

				'b_r_pinky0', // XRHand.LITTLE_METACARPAL,
				'b_r_pinky1', // XRHand.LITTLE_PHALANX_PROXIMAL,
				'b_r_pinky2', // XRHand.LITTLE_PHALANX_INTERMEDIATE,
				'b_r_pinky3', // XRHand.LITTLE_PHALANX_DISTAL,
				'b_r_pinky_null', // XRHand.LITTLE_PHALANX_TIP
			];

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

		this.updateMesh();

	},

	updateMesh: function () {

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

					if (bone) {

						bone.position.copy( position.clone().multiplyScalar(100) );
						bone.quaternion.copy( XRJoint.quaternion );
/*
						if (i===0) {
							let offsetRotation = new Quaternion();
							var handModelOrientation = Math.PI;
							offsetRotation.setFromAxisAngle(new THREE.Vector3(0,0,1).normalize(), handModelOrientation);

							var offsetRotationY = new Quaternion();
							offsetRotationY.setFromAxisAngle(new THREE.Vector3(1,0,0).normalize(), Math.PI / 2);
							offsetRotation = offsetRotation.multiply(offsetRotationY);

							bone.quaternion.multiply(offsetRotation);

							bone.quaternion.multiply(quaternion);
							quaternion = new Quaternion().setFromAxisAngle( {x:1, y:0, z:0}, -Math.PI/2 );
							bone.quaternion.multiply(quaternion);

						} else if (i === 20) {

							var offsetRotation = new Quaternion();
							var handModelOrientation = Math.PI;
							offsetRotationY.setFromAxisAngle(new Vector3(0,0,1).normalize(), handModelOrientation);
							bone.quaternion.multiply(offsetRotation);

						}
*/
						//let quaternion = new Quaternion().setFromAxisAngle( {x:0, y:1, z:0}, Math.PI/2 );
/*
						let quaternion = new Quaternion().setFromAxisAngle( {x:0, y:1, z:0}, Math.PI );
						bone.quaternion.multiply(quaternion);
						quaternion = new Quaternion().setFromAxisAngle( {x:1, y:0, z:0}, -Math.PI/2 );
						bone.quaternion.multiply(quaternion);
						*/
				}

					//bone.scale.setScalar( XRJoint.jointRadius || defaultRadius );

				}

				// bone.visible = XRJoint.visible;

			}

			if ( i >= limit ) {

				return;

			}

		}

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
} );


var XRHandModelFactory = ( function () {

	function XRHandModelFactory() {}

	XRHandModelFactory.prototype = {

		constructor: XRHandModelFactory,

		createHandModel: function ( controller ) {

			const handModel = new XRHandModel( controller );
			let scene = null;

			controller.addEventListener( 'connected', ( event ) => {

				const xrInputSource = event.data;
				console.log( "Connected!", xrInputSource );

				if ( xrInputSource.hand ) {

					handModel.xrInputSource = xrInputSource;

				}

			} );

			controller.addEventListener( 'disconnected', () => {

				handModel.motionController = null;
				handModel.remove( scene );
				scene = null;

			} );

			return handModel;

		}

	};

	return XRHandModelFactory;

} )();


export { XRHandModelFactory };
