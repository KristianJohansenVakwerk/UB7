export const fragmentShader = /* glsl */ `
uniform vec2 iResolution;
varying vec2 vUv;
uniform float uOffset;
uniform float uAlpha;
uniform float uSize;
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

    if (t <= p[0]) return colors[0];
    if (t >= p[3]) return colors[3];

    for (int i = 0; i < 3; i++) {
        if (t >= p[i] && t <= p[i + 1]) {
            float localT = (t - p[i]) / (p[i + 1] - p[i]);
            return mix(colors[i], colors[i + 1], localT);
        }
    }
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = vUv;
    uv.y += uOffset;

    uv = clamp(uv, 0.0, 1.0);

    const int colorCount = 4;
    vec3 colors[colorCount];
    colors[0] = color0;
    colors[1] = color1;
    colors[2] = color2;
    colors[3] = color3;

    float p[4];
    p[0] = pos0;
    p[1] = pos1;
    p[2] = pos2;
    p[3] = 1.0;

    // center at middle, map to -1..1
    vec2 center = vec2(0.5, 0.1);
    vec2 scaledUV = (uv - center) * 2.0;

    // Keep aspect ratio and stretch horizontally
    float stretchX = 0.5;

    // keep aspect ratio
    scaledUV.x *= iResolution.y / iResolution.x * stretchX;

    float dist = length(scaledUV);
    dist *= uSize;
    float t = smoothstep(0.0, 1.0, dist);

    vec3 col = multiGradient(t, colors, p);
    fragColor = vec4(col, uAlpha);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
