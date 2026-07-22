export interface District {
  id: string;
  nameEn: string;
  nameTa: string;
  lat: number;
  lng: number;
}

export interface State {
  id: string;
  nameEn: string;
  nameTa: string;
  districts: District[];
}

export const indianStates: State[] = [
  {
    id: 'tamil_nadu',
    nameEn: 'Tamil Nadu',
    nameTa: 'தமிழ்நாடு',
    districts: [
      { id: 'thanjavur', nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்', lat: 10.7870, lng: 79.1378 },
      { id: 'madurai', nameEn: 'Madurai', nameTa: 'மதுரை', lat: 9.9252, lng: 78.1198 },
      { id: 'trichy', nameEn: 'Trichy', nameTa: 'திருச்சி', lat: 10.7905, lng: 78.7047 },
      { id: 'coimbatore', nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', lat: 11.0168, lng: 76.9558 },
      { id: 'tirunelveli', nameEn: 'Tirunelveli', nameTa: 'திருநெல்வேலி', lat: 8.7139, lng: 77.7567 },
      { id: 'salem', nameEn: 'Salem', nameTa: 'சேலம்', lat: 11.6643, lng: 78.1460 }
    ]
  },
  {
    id: 'andhra_pradesh',
    nameEn: 'Andhra Pradesh',
    nameTa: 'ஆந்திரப் பிரதேசம்',
    districts: [
      { id: 'guntur', nameEn: 'Guntur', nameTa: 'குண்டூர்', lat: 16.3067, lng: 80.4365 },
      { id: 'nellore', nameEn: 'Nellore', nameTa: 'நெல்லூர்', lat: 14.4426, lng: 79.9865 },
      { id: 'kurnool', nameEn: 'Kurnool', nameTa: 'கர்னூல்', lat: 15.8281, lng: 78.0373 },
      { id: 'krishna', nameEn: 'Krishna', nameTa: 'கிருஷ்ணா', lat: 16.1685, lng: 81.1311 },
      { id: 'chittoor', nameEn: 'Chittoor', nameTa: 'சித்தூர்', lat: 13.2172, lng: 79.1003 },
      { id: 'visakhapatnam', nameEn: 'Visakhapatnam', nameTa: 'விசாகப்பட்டினம்', lat: 17.6868, lng: 83.2185 }
    ]
  },
  {
    id: 'karnataka',
    nameEn: 'Karnataka',
    nameTa: 'கர்நாடகா',
    districts: [
      { id: 'bengaluru', nameEn: 'Bengaluru', nameTa: 'பெங்களூரு', lat: 12.9716, lng: 77.5946 },
      { id: 'mysore', nameEn: 'Mysore', nameTa: 'மைசூரு', lat: 12.2958, lng: 76.6394 },
      { id: 'belagavi', nameEn: 'Belagavi', nameTa: 'பெலகாவி', lat: 15.8497, lng: 74.4977 },
      { id: 'mandya', nameEn: 'Mandya', nameTa: 'மாண்டியா', lat: 12.5218, lng: 76.8951 },
      { id: 'shimoga', nameEn: 'Shimoga', nameTa: 'ஷிமோகா', lat: 13.9299, lng: 75.5681 }
    ]
  },
  {
    id: 'kerala',
    nameEn: 'Kerala',
    nameTa: 'கேரளா',
    districts: [
      { id: 'palakkad', nameEn: 'Palakkad', nameTa: 'பாலக்காடு', lat: 10.7867, lng: 76.6548 },
      { id: 'wayanad', nameEn: 'Wayanad', nameTa: 'வயநாடு', lat: 11.6854, lng: 76.1320 },
      { id: 'idukki', nameEn: 'Idukki', nameTa: 'இடுக்கி', lat: 9.8504, lng: 76.9744 },
      { id: 'alappuzha', nameEn: 'Alappuzha', nameTa: 'ஆலப்புழா', lat: 9.4981, lng: 76.3388 }
    ]
  },
  {
    id: 'maharashtra',
    nameEn: 'Maharashtra',
    nameTa: 'மகாராஷ்டிரா',
    districts: [
      { id: 'pune', nameEn: 'Pune', nameTa: 'புனே', lat: 18.5204, lng: 73.8567 },
      { id: 'nashik', nameEn: 'Nashik', nameTa: 'நாசிக்', lat: 19.9975, lng: 73.7898 },
      { id: 'nagpur', nameEn: 'Nagpur', nameTa: 'நாக்பூர்', lat: 21.1458, lng: 79.0882 },
      { id: 'satara', nameEn: 'Satara', nameTa: 'சதாரா', lat: 17.6805, lng: 73.9918 }
    ]
  }
];
