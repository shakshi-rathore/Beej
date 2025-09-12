import type { Question, CropType } from './types';

export const questionsByCrop: Record<CropType, Question[]> = {
  rice: [
    { id: 'rice_1', question: 'Are there yellow patches on leaves?',image:require('../assets/diamondlesion.png') },
    { id: 'rice_2', question: 'Is there a white powdery coating?',image:require('../assets/yellowtip.png')  },
    { id: 'rice_3', question: 'Are stems weak or breaking easily?',image:require('../assets/ovallesion.png')  },
  ],
  wheat: [
    { id: 'wheat_1', question: 'Are there black or brown spots on leaves?',image:require('../assets/brownpustules.png')  },
    { id: 'wheat_2', question: 'Is there rust-colored powder on leaves?' ,image:require('../assets/blackwheat.png') },
    { id: 'wheat_3', question: 'Are heads of wheat discolored or shriveled?' ,image:require('../assets/wheatyellowstripes.png') },
  ],
  maize: [
    { id: 'maize_1', question: 'Are there holes in leaves?' ,image:require('../assets/graygreenlesion.png') },
    { id: 'maize_2', question: 'Is there mold on the ears?',image:require('../assets/whitedowny.png')  },
    { id: 'maize_3', question: 'Are stalks bending or broken?',image:require('../assets/tanlesion.png')  },
  ],
  potato: [
    { id: 'potato_1', question: 'Are leaves yellowing and wilting?',image:require('../assets/darkringpotato.png')  },
    { id: 'potato_2', question: 'Is there black rot on tubers?' ,image:require('../assets/yellowhalopotato.png') },
    { id: 'potato_3', question: 'Are there dark lesions on stems?',image:require('../assets/blackcrustypatch.png')  },
  ],
  muskmelon: [
    { id: 'muskmelon_1', question: 'Is there powdery mildew on leaves?' ,image:require('../assets/stickywhite.png') },
    { id: 'muskmelon_2', question: 'Are fruits showing sunken spots?',image:require('../assets/spotring.png')  },
    { id: 'muskmelon_3', question: 'Is vine growth stunted or dying?',image:require('../assets/wiltedwine.png')  },
  ],
  watermelon: [
    { id: 'watermelon_1', question: 'Are leaves curling or yellowing?',image:require('../assets/brownblackspot.png')  },
    { id: 'watermelon_2', question: 'Is there gummy ooze on stems?',image:require('../assets/discolorleaf.png')  },
    { id: 'watermelon_3', question: 'Are fruits soft or rotten inside?',image:require('../assets/rotting.png')  },
  ],
};
