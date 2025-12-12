export const fragmentShader = /* glsl */ `
uniform vec2 iResolution;
varying vec2 vUv;
uniform float uOffset;
uniform float uAlpha;
uniform float uSize;
uniform float uInvert;
uniform float uFlipColors; // Keep uniform but don't use it
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float pos0;
uniform float pos1;
uniform float pos2;
uniform float pos3;

vec3 multiGradient(float t, vec3 colors[4], float p[4]) {
    t = clamp(t, 0.0, 1.0);

    // Handle edge cases - use < instead of <= for p[0] to allow t to reach p[0]
    if (t < p[0]) return colors[0];
    if (t >= p[3]) return colors[3];

    // Find which segment t falls into with better precision
    for (int i = 0; i < 3; i++) {
        float segmentStart = p[i];
        float segmentEnd = p[i + 1];
        
        // Use epsilon for better boundary handling
        // Include the start point but use < for end to avoid overlap
        if (t >= segmentStart && t < segmentEnd) {
            float localT = (t - segmentStart) / max(segmentEnd - segmentStart, 0.0001);
            localT = clamp(localT, 0.0, 1.0);
            // Use smoothstep for smoother interpolation
            localT = smoothstep(0.0, 1.0, localT);
            return mix(colors[i], colors[i + 1], localT);
        }
    }
    
    // Fallback (shouldn't reach here)
    return colors[3];
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = vUv;
    uv.y += uOffset;

    uv = clamp(uv, 0.0, 1.0);

    const int colorCount = 4;
    vec3 colors[colorCount];
    
    // No color flipping - use colors as provided
    colors[0] = color0;
    colors[1] = color1;
    colors[2] = color2;
    colors[3] = color3;

    float p[4];
    p[0] = pos0;
    p[1] = pos1;
    p[2] = pos2;
    p[3] = pos3;

    float t;
    
    // For SVG (uInvert > 0), use vertical gradient based on uv.y
    // For background (uInvert = 0), use radial gradient
    if (uInvert > 0.5) {
        // Vertical gradient for SVG: use uv.y directly
        t = uv.y;
    } else {
        // Radial gradient for background
        vec2 center = vec2(0.5, 0.1);
        vec2 scaledUV = (uv - center) * 1.0;
        float stretchX = 0.5;
        scaledUV.x *= iResolution.y / iResolution.x * stretchX;
        float dist = length(scaledUV);
        vec2 aspectScale = vec2(iResolution.y / iResolution.x * stretchX, 1.0);
        vec2 corners[4];
        corners[0] = (vec2(0.0, 0.0) - center) * aspectScale;
        corners[1] = (vec2(1.0, 0.0) - center) * aspectScale;
        corners[2] = (vec2(0.0, 1.0) - center) * aspectScale;
        corners[3] = (vec2(1.0, 1.0) - center) * aspectScale;
        float maxDist = 0.0;
        for (int i = 0; i < 4; i++) {
            maxDist = max(maxDist, length(corners[i]));
        }
        dist = dist / maxDist;
        dist *= uSize;
        t = smoothstep(0.0, 1.0, dist);
        t = 1.0 - t;
    }

    // Apply inversion for SVG
    if (uInvert > 0.5) {
        t = 1.0 - t; // Invert so darkest is at top
    }

    float offsetFactor = clamp(uOffset, 0.0, 1.0);
    
    // Original offset logic: force t to 0.0 when offset is high (shows color0/initial color)
    if (uInvert > 0.5) {
        // SVG: force t to 0.0 to show color0 (grey) when offset is high
        t = mix(t, 0.0, offsetFactor);
    } else {
        // Background: mix towards 0.0 (grey) when offset is high
        t = mix(t, 0.0, offsetFactor);
    }

    vec3 col = multiGradient(t, colors, p);
    
    fragColor = vec4(col, uAlpha);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
