export const fragmentShader = /* glsl */ `
// ============================================================================
// FRAGMENT SHADER - Creates a multi-color gradient effect
// ============================================================================
// This shader renders either:
// 1. A VERTICAL gradient (for SVG shapes) - when uSvg > 0.5
// 2. A RADIAL gradient (for backgrounds) - when uSvg <= 0.5
// The gradient interpolates between 4 colors at 4 specified positions.
// ============================================================================

// --- UNIFORMS (values passed from JavaScript) ---
uniform vec2 iResolution;     // Viewport resolution (width, height) in pixels
varying vec2 vUv;             // Interpolated UV coordinates from vertex shader (0-1 range)
uniform float uOffset;        // Vertical offset for the UV coordinates + controls color fade
uniform float uAlpha;         // Overall transparency of the output (0 = invisible, 1 = opaque)
uniform float uSize;          // Controls the size/spread of the radial gradient
uniform float uSvg;            // Controls if the shader renders a svg or background
uniform float uFlipColors;    // Keep uniform but don't use it (legacy/unused)

// --- COLOR STOPS ---
// 4 colors that define the gradient palette
uniform vec3 color0;          // First color (typically at position pos0)
uniform vec3 color1;          // Second color (at position pos1)
uniform vec3 color2;          // Third color (at position pos2)
uniform vec3 color3;          // Fourth color (at position pos3)

// --- POSITION STOPS ---
// 4 positions (0-1) defining where each color appears in the gradient
uniform float pos0;           // Position of color0 (usually 0.0)
uniform float pos1;           // Position of color1
uniform float pos2;           // Position of color2
uniform float pos3;           // Position of color3 (usually 1.0)

// ============================================================================
// MULTI-GRADIENT FUNCTION
// ============================================================================
// Takes a value 't' (0-1) and returns the interpolated color based on
// the 4 colors and their positions. Works like CSS linear-gradient stops.
// 
// Example: if colors are [red, green, blue, white] at positions [0, 0.3, 0.7, 1]
// - t=0.0 → red
// - t=0.15 → orange (between red and green)
// - t=0.5 → cyan (between green and blue)
// - t=1.0 → white
// ============================================================================
vec3 multiGradient(float t, vec3 colors[4], float p[4]) {
    // Ensure t is within valid range
    t = clamp(t, 0.0, 1.0);

    // Handle edge cases - return first/last color if t is outside gradient range
    if (t < p[0]) return colors[0];   // Before first stop → first color
    if (t >= p[3]) return colors[3];  // After last stop → last color

    // Find which segment t falls into and interpolate
    // Segments: [p[0]-p[1]], [p[1]-p[2]], [p[2]-p[3]]
    for (int i = 0; i < 3; i++) {
        float segmentStart = p[i];
        float segmentEnd = p[i + 1];
        
        // Check if t is within this segment
        if (t >= segmentStart && t < segmentEnd) {
            // Calculate local position within this segment (0-1)
            // The max() prevents division by zero for zero-width segments
            float localT = (t - segmentStart) / max(segmentEnd - segmentStart, 0.0001);
            localT = clamp(localT, 0.0, 1.0);
            
            // Apply smoothstep for eased interpolation (not linear)
            // This creates smoother color transitions
            localT = smoothstep(0.0, 1.0, localT);
            
            // Linearly interpolate between the two colors of this segment
            return mix(colors[i], colors[i + 1], localT);
        }
    }
    
    // Fallback - should never reach here due to edge case handling above
    return colors[3];
}

// ============================================================================
// MAIN IMAGE FUNCTION
// ============================================================================
// This is where the gradient type is determined and the final color is computed
// ============================================================================
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // --- UV SETUP ---
    // Start with the UV coordinates from the vertex shader
    vec2 uv = vUv;
    
    // Apply vertical offset (scrolls the gradient vertically)
    uv.y += uOffset;

    // Clamp UV to prevent sampling outside 0-1 range
    uv = clamp(uv, 0.0, 1.0);

    // --- BUILD COLOR ARRAY ---
    const int colorCount = 4;
    vec3 colors[colorCount];
    colors[0] = color0;
    colors[1] = color1;
    colors[2] = color2;
    colors[3] = color3;

    // --- BUILD POSITION ARRAY ---
    float p[4];
    p[0] = pos0;
    p[1] = pos1;
    p[2] = pos2;
    p[3] = pos3;

    // --- CALCULATE GRADIENT PARAMETER 't' ---
    // 't' determines which color from the gradient to use (0-1)
    float t;
    
    // ========================================
    // MODE 1: VERTICAL GRADIENT (for SVG shapes)
    // When uSvg > 0.5
    // ========================================
    if (uSvg > 0.5) {
        // Simply use the Y coordinate - creates a top-to-bottom gradient
        t = uv.y;
    } 
    // ========================================
    // MODE 2: RADIAL GRADIENT (for backgrounds)
    // When uSvg <= 0.5
    // ========================================
    else {
        // Define the center of the radial gradient
        // (0.5, 0.1) = horizontally centered, near the top
        vec2 center = vec2(0.5, 0.1);
        
        // Offset UV from center
        vec2 scaledUV = (uv - center) * 1.0;
        
        // Apply horizontal stretch factor (makes the gradient elliptical, not circular)
        float stretchX = 0.5;
        
        // Correct for aspect ratio so gradient appears circular on non-square screens
        // Then apply the stretch factor
        scaledUV.x *= iResolution.y / iResolution.x * stretchX;
        
        // Calculate distance from center (creates the radial effect)
        float dist = length(scaledUV);
        
        // --- NORMALIZE DISTANCE ---
        // Find the maximum possible distance to any corner (for normalization)
        // This ensures the gradient reaches the edges properly
        vec2 aspectScale = vec2(iResolution.y / iResolution.x * stretchX, 1.0);
        vec2 corners[4];
        corners[0] = (vec2(0.0, 0.0) - center) * aspectScale;  // Bottom-left
        corners[1] = (vec2(1.0, 0.0) - center) * aspectScale;  // Bottom-right
        corners[2] = (vec2(0.0, 1.0) - center) * aspectScale;  // Top-left
        corners[3] = (vec2(1.0, 1.0) - center) * aspectScale;  // Top-right
        
        // Find the farthest corner
        float maxDist = 0.0;
        for (int i = 0; i < 4; i++) {
            maxDist = max(maxDist, length(corners[i]));
        }
        
        // Normalize distance to 0-1 range
        dist = dist / maxDist;
        
        // Apply size multiplier (expands/contracts the gradient)
        dist *= uSize;
        
        // Apply smoothstep for softer gradient edges
        t = smoothstep(0.0, 1.0, dist);
        
        // Invert so center is at t=1 (brightest) and edges at t=0
        // This makes color3 appear at center, color0 at edges
        t = 1.0 - t;
    }

    // --- APPLY INVERSION FOR SVG MODE ---
    // Flip the gradient direction so darkest color appears at top
    if (uSvg > 0.5) {
        t = 1.0 - t;
    }

    // --- APPLY OFFSET-BASED FADE ---
    // When uOffset increases (e.g., during scroll), fade toward color0
    // This creates a "wash out" effect as the element scrolls
    float offsetFactor = clamp(uOffset, 0.0, 1.0);
    
    
    // Background: same behavior - fade toward color0
    t = mix(t, 0.0, offsetFactor);
    

    // --- COMPUTE FINAL COLOR ---
    // Sample the multi-color gradient at position t
    vec3 col = multiGradient(t, colors, p);
    
    // Output final color with alpha transparency
    fragColor = vec4(col, uAlpha);
}

// ============================================================================
// ENTRY POINT
// ============================================================================
// Standard GLSL main function - calls mainImage with the built-in fragment coord
// ============================================================================
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
