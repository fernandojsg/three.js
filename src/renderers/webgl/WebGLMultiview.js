/**
 * @author fernandojsg / http://fernandojsg.com
 * @author Takahiro https://github.com/takahirox
 */

import { WebGLMultiviewRenderTarget } from '../WebGLMultiviewRenderTarget.js';
import { Matrix3 } from '../../math/Matrix3.js';
import { Matrix4 } from '../../math/Matrix4.js';

function WebGLMultiview( renderer, requested, options ) {

	options = Object.assign( {}, { debug: false }, options );

	var DEFAULT_NUMVIEWS = 2;
	var gl = renderer.context;
	var canvas = renderer.domElement;
	var capabilities = renderer.capabilities;
	var properties = renderer.properties;

	var renderTarget, currentRenderTarget;
	var previousNumViews = 0;

	function setNumViews( numViews ) {

		renderTarget.setNumViews( numViews );

		if ( previousNumViews !== numViews ) {

			previousNumViews = numViews;
			mat4Array = new Float32Array( numViews * 16 );
			mat3Array = new Float32Array( numViews * 9 );

		}

	}

	function getCamerasArray( camera ) {

		if ( camera.isArrayCamera ) {

			return camera.cameras;

		} else {

			cameras[ 0 ] = camera;
			return cameras;

		}

	}

	this.getNumViews = function () {

		return renderTarget ? renderTarget.numViews : 1;

	};

	// Auxiliary matrices to be used when updating arrays of uniforms
	var mat4Array = null;
	var mat3Array = null;
	var mat3 = new Matrix3();
	var mat4 = new Matrix4();
	var cameras = [];

	//

	this.isAvailable = function () {

		return capabilities.multiview;

	};

	this.isEnabled = function () {

		return requested && this.isAvailable();

	};

	if ( options.debug ) {

		if ( requested && ! this.isAvailable() ) {

			console.warn( 'WebGLRenderer: Multiview requested but not supported by the browser' );

		} else if ( requested !== false && this.isAvailable() ) {

			console.info( 'WebGLRenderer: Multiview enabled' );

		}

	}

	function setUniform4fv( uniforms, name ) {

		if ( uniforms.map[ name ] ) {

			gl.uniformMatrix4fv( uniforms.map[ name ].addr, false, mat4Array );

		}

	}

	function setUniform3fv( uniforms, name ) {

		if ( uniforms.map[ name ] ) {

			gl.uniformMatrix3fv( uniforms.map[ name ].addr, false, mat3Array );

		}

	}

	this.updateCameraProjectionMatrices = function ( camera, uniforms ) {

		var offset = 0;
		var cameras = getCamerasArray( camera );

		for ( var i = 0; i < cameras.length; i ++ ) {

			cameras[ i ].projectionMatrix.toArray( mat4Array, offset );
			offset += 16;

		}

		setUniform4fv( uniforms, 'projectionMatrices' );

	};

	this.updateCameraViewMatrices = function ( camera, uniforms ) {

		var offset = 0;
		var cameras = getCamerasArray( camera );

		for ( var i = 0; i < cameras.length; i ++ ) {

			cameras[ i ].matrixWorldInverse.toArray( mat4Array, offset );
			offset += 16;

		}

		setUniform4fv( uniforms, 'viewMatrices' );

	};

	this.updateObjectMatrices = function ( object, camera, uniforms ) {

		var offset3 = 0;
		var offset4 = 0;
		var cameras = getCamerasArray( camera );

		for ( var i = 0; i < cameras.length; i ++ ) {

			mat4.multiplyMatrices( camera.cameras[ i ].matrixWorldInverse, object.matrixWorld );
			mat3.getNormalMatrix( mat4 );

			mat4.toArray( mat4Array, offset4 );
			offset4 += 16;

			mat3.toArray( mat3Array, offset3 );
			offset3 += 9;

		}

		setUniform4fv( uniforms, 'modelViewMatrices' );
		setUniform3fv( uniforms, 'normalMatrices' );

	};

	this.attachRenderTarget = function ( camera ) {

		currentRenderTarget = renderer.getRenderTarget();

		// Resize if needed
		var width = canvas.width;
		var height = canvas.height;

		if ( camera.isArrayCamera ) {

			// Every camera must have the same size, so we just get the size from the first one
			var bounds = camera.cameras[ 0 ].bounds;

			width *= bounds.z;
			height *= bounds.w;

			setNumViews( camera.cameras.length );

		} else {

			setNumViews( DEFAULT_NUMVIEWS );

		}

		renderTarget.setSize( width, height );

		renderer.setRenderTarget( renderTarget );

	};

	this.detachRenderTarget = function ( camera ) {

		var viewFramebuffers = properties.get( renderTarget ).__webglViewFramebuffers;

		// @todo Use actual framebuffer
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

		if ( camera.isArrayCamera ) {

			for ( var i = 0; i < camera.cameras.length; i ++ ) {

				var bounds = camera.cameras[ i ].bounds;

				var x = bounds.x * canvas.width;
				var y = bounds.y * canvas.height;
				var width = bounds.z * canvas.width;
				var height = bounds.w * canvas.height;

				gl.bindFramebuffer( gl.READ_FRAMEBUFFER, viewFramebuffers[ i ] );
				gl.blitFramebuffer( 0, 0, width, height, x, y, x + width, y + height, gl.COLOR_BUFFER_BIT, gl.NEAREST );

			}

		} else {

			// If no array camera, blit just one view
			gl.bindFramebuffer( gl.READ_FRAMEBUFFER, viewFramebuffers[ 0 ] );
			gl.blitFramebuffer( 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height, gl.COLOR_BUFFER_BIT, gl.NEAREST );

		}

		renderer.setRenderTarget( currentRenderTarget );

	};


	if ( this.isEnabled() ) {

		renderTarget = new WebGLMultiviewRenderTarget( canvas.width, canvas.height, this.numViews );

	}

}

export { WebGLMultiview };
