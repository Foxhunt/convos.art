import { Filter } from "pixi.js"

const FragShader = `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  void main(void)
  {
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if(all(equal(pixel.rgb, vec3(0.0, 0.0, 0.0)))){
      pixel.rgb += vec3(0.04, 0.04, 0.04);
    }

    gl_FragColor = pixel;
  }
`

class AlphaFilter extends Filter {
  constructor(){
    super(null, FragShader)
  }
}

export default AlphaFilter