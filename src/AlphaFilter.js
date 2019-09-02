import { Filter } from "pixi.js"

const FragShader = `
  varying vec2 vTextureCoord;
  
  uniform sampler2D uSampler;
  uniform float colorDecay;

  void main(void)
  {
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if(all(equal(pixel.rgb, vec3(0.0, 0.0, 0.0)))){
      pixel.rgb += vec3(colorDecay, colorDecay, colorDecay);
    }

    gl_FragColor = pixel;
  }
`

class AlphaFilter extends Filter {
  constructor(colorDecay){
    super(null, FragShader, {colorDecay: {type: "float", value: colorDecay}})
  }
}

export default AlphaFilter