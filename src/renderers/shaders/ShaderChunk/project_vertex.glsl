#ifdef MULTIVIEW
    mat4 viewMatrixEye = gl_ViewID_OVR == 0u ? leftViewMatrix : rightViewMatrix;
    mat4 projectionMatrixEye = gl_ViewID_OVR == 0u ? leftProjectionMatrix : rightProjectionMatrix;
#endif

vec4 mvPosition = viewMatrix * modelMatrix * vec4( transformed, 1.0 );

gl_Position = projectionMatrix * mvPosition;