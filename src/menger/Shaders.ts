export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;   
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
		
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;

// TODO: Write the fragment shader

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;    
	
    
    void main () {
        float diffuse = dot(normalize(lightDir.xyz), normalize(normal.xyz));
        gl_FragColor = vec4(abs(normal).xyz*max(diffuse, 0.0), 1.0);
        // gl_FragColor = vec4(abs(normal).xyz, 1.0);
    }
`;

// TODO: floor shaders

export let floorVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;

    varying vec4 lightDir;
    varying vec4 normal;   

    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    varying vec4 position; 

    void main () {
        //  Convert vertex to camera coordinates and the NDC
        position = vec4 (vertPosition, 1.0);
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
        
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;

        position = vec4 (vertPosition, 1.0);
        
    }
`;

export let floorFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;  
    varying vec4 position;  
	
    
    // void main () {
    //     // float diffuse = dot(normalize(lightDir.xyz), normalize(normal.xyz));
    //     // gl_FragColor = vec4(abs(normal).xyz*max(diffuse, 0.0), 1.0);
    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // }

    void main() {
        // Define checkerboard pattern size
        float checkerSize = 5.0; // Size of the checkerboard squares

        // Compute checkerboard pattern
        float checkerX = floor(mod(position.x / checkerSize, 2.0));
        float checkerZ = floor(mod(position.z / checkerSize, 2.0));
        float checkerPattern = abs(checkerX - checkerZ);
        
        if (checkerPattern < 1.0) {
            float diffuse = dot(normalize(lightDir.xyz), normalize(normal.xyz));
            gl_FragColor = vec4(vec4(1.0, 1.0, 1.0, 1.0).xyz*max(diffuse, 0.0), 1.0);
            // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // White square
        } else {
            float diffuse = dot(normalize(lightDir.xyz), normalize(normal.xyz));
            gl_FragColor = vec4(vec4(0.0, 0.0, 0.0, 1.0).xyz*max(diffuse, 0.0), 1.0);
            // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black square
        }
    }
`;


// precision mediump float;

// varying vec4 lightDir;
// varying vec4 normal;    


// void main () {
//     // float diffuse = dot(normalize(lightDir.xyz), normalize(normal.xyz));
//     // gl_FragColor = vec4(abs(normal).xyz*max(diffuse, 0.0), 1.0);
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// }

