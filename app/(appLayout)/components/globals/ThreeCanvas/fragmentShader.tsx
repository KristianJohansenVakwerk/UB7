export const fragmentShader = /* glsl */ `
uniform vec2 iResolution;
varying vec2 vUv;
uniform float uOffset;
uniform float uSize;
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
    colors[0] = vec3(0.0157, 0.4627, 0.2314);
    colors[1] = vec3(0.4941, 0.9804, 0.3137);
    colors[2] = vec3(0.996, 1.0, 0.761);
    colors[3] = vec3(0.8510, 0.8510, 0.8510);

    float p[4];
    p[0] = 0.1;
    p[1] = 0.538462;
    p[2] = 0.817308;
    p[3] = 1.0;

    // center at middle, map to -1..1
    vec2 center = vec2(0.5, 0.1);
    vec2 scaledUV = (uv - center) * 2.0;

    // keep aspect ratio
    scaledUV.x *= iResolution.y / iResolution.x;

    float dist = length(scaledUV);
    dist *= uSize;
    float t = smoothstep(0.0, 1.0, dist);

    vec3 col = multiGradient(t, colors, p);
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
