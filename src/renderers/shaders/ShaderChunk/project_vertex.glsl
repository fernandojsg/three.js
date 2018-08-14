mat4 viewMatrixEye = gl_ViewID_OVR == 0u ? leftViewMatrix : rightViewMatrix;
mat4 projectionMatrixEye = gl_ViewID_OVR == 0u ? leftProjectionMatrix : rightProjectionMatrix;

vec4 mvPosition = viewMatrixEye * modelMatrix * vec4( transformed, 1.0 );

gl_Position = projectionMatrixEye * mvPosition;