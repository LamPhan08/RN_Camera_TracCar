export interface StoreData {
    id: string;
    name: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    description: string;
  }
  
  export const storesData: readonly StoreData[] = [
    {
      id: '1',
      name: 'Store in Chemnitz',
      imageUrl: 'https://images4.alphacoders.com/869/869425.jpg',
      latitude: 12.916667, // Đổi giá trị này
      longitude: 106.833332, // Đổi giá trị này
      description: '...',
    },
    {
      id: '2',
      name: 'Store in Heidelberg',
      imageUrl: 'https://e0.pxfuel.com/wallpapers/674/159/desktop-wallpaper-night-aesthetic-dekstop-at-street-aesthetic.jpg',
      latitude: 12.69079, // Đổi giá trị này
      longitude: 106.40768, // Đổi giá trị này
      description: '...',
    },
    {
      id: '3',
      name: 'Store in Zwickau',
      imageUrl: 'https://e0.pxfuel.com/wallpapers/847/1017/desktop-wallpaper-in-some-districts-urban-anime-life-live-wall.jpg',
      latitude: 12.4941442, // Đổi giá trị này
      longitude: 106.7150571, // Đổi giá trị này
      description: '...',
    },
    {
      id: '4',
      name: 'Store in Leipzig',
      imageUrl: 'https://images.wallpapersden.com/image/download/night-in-neon-city_bWhmZWyUmZqaraWkpJRmZWdprWpsaw.jpg',
      latitude: 12.3730747, // Đổi giá trị này
      longitude: 106.3396955, // Đổi giá trị này
      description: '...',
    },
    {
      id: '5',
      name: 'Store in Munich',
      imageUrl: 'https://img.freepik.com/premium-photo/night-city-neon-lights-metropolis-reflection-neon-lights-water-modern-city-with-highrise-buildings-night-street-scene-city-ocean-3d-illustration_129911-3475.jpg',
      latitude: 12.5819805, // Đổi giá trị này
      longitude: 106.1351253, // Đổi giá trị này
      description: '...',
    },
    // Add more store entries as needed
  ];
  