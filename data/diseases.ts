import type { Disease, CropType } from './types';

export const diseasesByCrop: Record<CropType, Disease[]> = {
  rice: [
    {
      name: 'Rice Blast',
      symptoms: ['rice_1', 'rice_3'],
      cause: 'Fungus Magnaporthe oryzae causes leaf and stem lesions.',
      treatment: 'Use fungicides and resistant varieties.',
      prevention: 'Avoid excessive nitrogen fertilizer and water management.',
      image:require('../assets/riceblast.png') 
    },
    {
      name: 'Rice Powdery Mildew',
      symptoms: ['rice_2'],
      cause: 'Fungal disease causing white powder on leaves.',
      treatment: 'Apply sulfur-based fungicides.',
      prevention: 'Ensure good air circulation and avoid overcrowding.',
      image:require('../assets/ricepowderymildew.png')
    },
  ],
  wheat: [
    {
      name: 'Wheat Leaf Rust',
      symptoms: ['wheat_2'],
      cause: 'Fungus Puccinia triticina causes rust colored spots.',
      treatment: 'Use fungicides and resistant varieties.',
      prevention: 'Rotate crops and remove volunteer wheat.',
      image:require('../assets/wheatrust.png')
    },
    {
      name: 'Wheat Spot Blotch',
      symptoms: ['wheat_1', 'wheat_3'],
      cause: 'Fungal disease causing dark spots and shriveled heads.',
      treatment: 'Fungicides application and resistant varieties.',
      prevention: 'Crop rotation and clean seed use.',
      image:require('../assets/spotbloch.png')
    },
  ],
  maize: [
    {
      name: 'Maize Leaf Spot',
      symptoms: ['maize_1'],
      cause: 'Fungal infection causing holes and spots on leaves.',
      treatment: 'Fungicides and crop residue management.',
      prevention: 'Remove infected debris and rotate crops.',
      image:require('../assets/maizeleafspot.png')
    },
    {
      name: 'Maize Ear Mold',
      symptoms: ['maize_2', 'maize_3'],
      cause: 'Fungal growth on ears and stalks.',
      treatment: 'Use resistant hybrids and fungicides.',
      prevention: 'Timely harvest and avoid mechanical damage.',
      image:require('../assets/maizeearmold.png')
    },
  ],
  potato: [
    {
      name: 'Potato Late Blight',
      symptoms: ['potato_1', 'potato_3'],
      cause: 'Phytophthora infestans causes dark lesions and wilting.',
      treatment: 'Use fungicides and remove infected plants.',
      prevention: 'Crop rotation and proper irrigation.',
      image:require('../assets/late_blight.png')
    },
    {
      name: 'Potato Blackleg',
      symptoms: ['potato_2'],
      cause: 'Bacterial infection causing black rot on tubers.',
      treatment: 'Use certified seed and disinfect tools.',
      prevention: 'Avoid waterlogging and store tubers properly.',
      image:require('../assets/blackleg.png')
    },
  ],
  muskmelon: [
    {
      name: 'Muskmelon Powdery Mildew',
      symptoms: ['muskmelon_1'],
      cause: 'Fungal disease causing white powder on leaves.',
      treatment: 'Apply sulfur fungicides.',
      prevention: 'Ensure air circulation and avoid humidity.',
      image:require('../assets/muskmelonpowdery.jpg')
    },
    {
      name: 'Muskmelon Fruit Rot',
      symptoms: ['muskmelon_2', 'muskmelon_3'],
      cause: 'Fungal infection causing sunken spots and vine death.',
      treatment: 'Use fungicides and remove infected fruits.',
      prevention: 'Sanitation and crop rotation.',
     image:require('../assets/muskmelonrot.png')
    },
  ],
  watermelon: [
    {
      name: 'Watermelon Leaf Curl',
      symptoms: ['watermelon_1'],
      cause: 'Viral disease causing leaf curling and yellowing.',
      treatment: 'Control insect vectors.',
      prevention: 'Use resistant varieties and crop rotation.',
      image:require('../assets/watermelonleafcurl.png'),
    },
    {
      name: 'Watermelon Fruit Rot',
      symptoms: ['watermelon_2', 'watermelon_3'],
      cause: 'Fungal infection causing soft fruits and gummy ooze.',
      treatment: 'Apply fungicides and remove infected fruits.',
      prevention: 'Good field sanitation and proper irrigation.',
      image:require('../assets/watermelonrot.png'),
    },
  ],
};
