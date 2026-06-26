import { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Star, Clock, MapPin, Check, X, Users, Calendar, Compass, ArrowUpRight, Sunrise, Loader2 } from 'lucide-react';
import { packageService } from '../services/packageService';

/* ---- Animation Variants ---- */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ========================================
   PACKAGE DATA — 9 Unique Itineraries
   ======================================== */
const packageData = {
  1: {
    title: 'Complete Chardham Yatra', subtitle: 'Sacred Journey',
    location: 'Uttarakhand, India', duration: '12 Days / 11 Nights', maxGroup: 20, rating: 4.9, reviews: 150, price: '45,999', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-primary-900 to-secondary-700',
    itinerary: [
      { day: 1, title: 'Arrival in Haridwar', desc: 'Arrive at Dehradun airport, transfer to Haridwar. Evening Ganga Aarti at Har Ki Pauri — a soul-stirring experience on the banks of the holy Ganges.', highlights: ['Har Ki Pauri', 'Ganga Aarti', 'Hotel check-in'] },
      { day: 2, title: 'Haridwar to Barkot (via Yamunotri)', desc: 'Drive to Barkot through scenic mountain roads. Early morning start with packed breakfast for the journey ahead.', highlights: ['Mountain drive', 'Barkot arrival', 'Overnight stay'] },
      { day: 3, title: 'Yamunotri Darshan', desc: 'Trek 6km to Yamunotri temple. Take a holy dip in Surya Kund hot spring before darshan of Goddess Yamuna. Return to Barkot.', highlights: ['Yamunotri Temple', 'Surya Kund', '6km trek'] },
      { day: 4, title: 'Barkot to Uttarkashi', desc: 'Drive to Uttarkashi, visit the ancient Vishwanath Temple dedicated to Lord Shiva. Explore the local market and ashrams.', highlights: ['Vishwanath Temple', 'Local market', 'Ashram visit'] },
      { day: 5, title: 'Gangotri Darshan', desc: 'Drive to Gangotri (100km). Perform rituals and attend the evening Aarti at the source of River Ganga. Surrounded by snow-clad peaks.', highlights: ['Gangotri Temple', 'Ganga Aarti', 'Bhagirathi River'] },
      { day: 6, title: 'Uttarkashi to Guptkashi', desc: 'Long scenic drive through the Garhwal region via Tehri Dam. Arrive at Guptkashi, visit Ardhnarishwar Temple.', highlights: ['Tehri Dam', 'Ardhnarishwar Temple', 'Scenic drive'] },
      { day: 7, title: 'Guptkashi to Kedarnath', desc: 'Drive to Sonprayag, trek 16km or take helicopter to Kedarnath. Evening darshan at the sacred Jyotirlinga temple. Overnight near the temple.', highlights: ['Kedarnath Darshan', '16km trek', 'Temple Aarti'] },
      { day: 8, title: 'Kedarnath Exploration', desc: 'Morning visit to Bhairavnath Temple and Gandhi Sarovar. Second darshan opportunity at Kedarnath. Enjoy the majestic Himalayan backdrop.', highlights: ['Bhairavnath Temple', 'Gandhi Sarovar', 'Mountain views'] },
      { day: 9, title: 'Kedarnath to Badrinath', desc: 'Return trek to Sonprayag, drive to Badrinath via Joshimath. Visit Narsingh Temple in Joshimath. Evening Aarti at Badrinath Temple.', highlights: ['Badrinath Darshan', 'Tapt Kund', 'Joshimath'] },
      { day: 10, title: 'Badrinath Sightseeing', desc: 'Visit Mana village (last Indian village before Tibet), Vyas Gufa, Bheem Pul, and Saraswati River. Afternoon free for personal prayer at the temple.', highlights: ['Mana Village', 'Vyas Gufa', 'Bheem Pul'] },
      { day: 11, title: 'Badrinath to Rudraprayag', desc: 'Morning pooja at Badrinath, then drive to Rudraprayag — the confluence of Alaknanda and Mandakini rivers. Visit Dhari Devi Temple.', highlights: ['River confluence', 'Dhari Devi', 'Rudraprayag'] },
      { day: 12, title: 'Departure from Rishikesh', desc: 'Drive to Rishikesh via Devprayag (confluence of Bhagirathi & Alaknanda). Visit Ram Jhula, Laxman Jhula, and depart from Dehradun.', highlights: ['Devprayag', 'Ram Jhula', 'Departure'] },
    ],
    inclusions: ['4-star hotels & premium camps', 'All meals (B/L/D)', 'AC Toyota Innova / Tempo Traveller', 'Professional English-speaking guide', 'All temple entry tickets & permits', 'Helicopter tickets (optional add-on)', 'Travel insurance with medical coverage', 'Welcome kit with yatra essentials'],
    exclusions: ['Airfare / Train tickets to Dehradun', 'Personal expenses & shopping', 'Tips & gratuities', 'Optional pony/palanquin rides', 'Visa fees (international travelers)'],
  },
  2: {
    title: 'Do Dham Yatra', subtitle: 'Divine Duo',
    location: 'Uttarakhand, India', duration: '7 Days / 6 Nights', maxGroup: 15, rating: 4.8, reviews: 98, price: '28,999', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-orange-900 to-orange-600',
    itinerary: [
      { day: 1, title: 'Arrival in Haridwar', desc: 'Arrive at Dehradun airport, transfer to Haridwar. Evening attend the mesmerizing Ganga Aarti at Har Ki Pauri. Rest and prepare for the yatra.', highlights: ['Har Ki Pauri', 'Ganga Aarti', 'Briefing'] },
      { day: 2, title: 'Haridwar to Guptkashi', desc: 'Long scenic drive (220km) through Devprayag and Rudraprayag. Pass through stunning river confluences and mountain valleys.', highlights: ['Devprayag', 'River confluence', 'Mountain drive'] },
      { day: 3, title: 'Guptkashi to Kedarnath', desc: 'Early drive to Sonprayag, then 16km trek or helicopter ride to Kedarnath. Evening darshan at the sacred Jyotirlinga of Lord Shiva.', highlights: ['Kedarnath Temple', 'Trek/Helicopter', 'Evening Aarti'] },
      { day: 4, title: 'Kedarnath to Guptkashi', desc: 'Morning visit to Bhairavnath Temple. Return trek to Sonprayag. Drive back to Guptkashi. Visit the ancient Ardhnarishwar Temple.', highlights: ['Bhairavnath Temple', 'Return trek', 'Ardhnarishwar'] },
      { day: 5, title: 'Guptkashi to Badrinath', desc: 'Drive to Badrinath via Joshimath. Visit Narsingh Temple. Evening attend the grand Badrinath Aarti at the temple of Lord Vishnu.', highlights: ['Badrinath Darshan', 'Joshimath', 'Temple Aarti'] },
      { day: 6, title: 'Badrinath & Mana Village', desc: 'Morning holy dip in Tapt Kund. Visit Mana village, Vyas Gufa, Bheem Pul. Afternoon free for temple visit and meditation.', highlights: ['Tapt Kund', 'Mana Village', 'Vyas Gufa'] },
      { day: 7, title: 'Departure via Rishikesh', desc: 'Drive back via Joshimath and Rudraprayag. Stop at Rishikesh for Ram Jhula and Laxman Jhula. Transfer to Dehradun for departure.', highlights: ['Rishikesh', 'Ram Jhula', 'Departure'] },
    ],
    inclusions: ['3-star hotels & camps', 'All meals (B/L/D)', 'AC vehicle transfers', 'Experienced tour guide', 'Temple entry tickets', 'Helicopter option (add-on)', 'Travel insurance'],
    exclusions: ['Airfare / Train to Dehradun', 'Personal expenses', 'Tips & gratuities', 'Pony/palanquin charges', 'Visa fees'],
  },
  3: {
    title: 'Manali & Shimla Escape', subtitle: 'Himalayan Retreat',
    location: 'Himachal Pradesh', duration: '7 Days / 6 Nights', maxGroup: 25, rating: 4.8, reviews: 210, price: '22,499', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-emerald-900 to-emerald-600',
    itinerary: [
      { day: 1, title: 'Arrival in Shimla', desc: 'Arrive at Chandigarh airport, scenic drive to Shimla (120km). Evening stroll on The Mall Road and Ridge. Check into heritage hotel.', highlights: ['Mall Road', 'The Ridge', 'Heritage hotel'] },
      { day: 2, title: 'Shimla Sightseeing', desc: 'Full day exploring Shimla — visit Jakhu Temple (Hanuman), Christ Church, Viceregal Lodge, and Kufri for snow activities and horse riding.', highlights: ['Jakhu Temple', 'Kufri', 'Christ Church'] },
      { day: 3, title: 'Shimla to Manali', desc: 'Scenic drive (270km) through Kullu Valley. Stop at Pandoh Dam and Beas River. Arrive Manali by evening. Overnight at resort.', highlights: ['Kullu Valley', 'Pandoh Dam', 'Beas River'] },
      { day: 4, title: 'Manali Local Exploration', desc: 'Visit Hadimba Temple, Manu Temple, Vashisht Hot Springs, and Old Manali. Evening explore the vibrant Mall Road cafes and shops.', highlights: ['Hadimba Temple', 'Vashisht Springs', 'Old Manali'] },
      { day: 5, title: 'Solang Valley Adventure', desc: 'Full day at Solang Valley — paragliding, zorbing, skiing (winter), and cable car rides. Breathtaking views of glaciers and snow peaks.', highlights: ['Solang Valley', 'Paragliding', 'Snow activities'] },
      { day: 6, title: 'Rohtang Pass / Atal Tunnel', desc: 'Excursion to Rohtang Pass (subject to permit) or Atal Tunnel. Visit Sissu village in Lahaul Valley. Return to Manali for farewell dinner.', highlights: ['Rohtang Pass', 'Atal Tunnel', 'Sissu village'] },
      { day: 7, title: 'Departure from Manali', desc: 'Morning at leisure for last-minute shopping. Drive back to Chandigarh or Bhuntar airport for departure. End of a memorable trip.', highlights: ['Free morning', 'Shopping', 'Departure'] },
    ],
    inclusions: ['Heritage hotels & mountain resorts', 'Daily breakfast & dinner', 'AC Volvo / private vehicle', 'Sightseeing as per itinerary', 'Rohtang Pass permits', 'Professional tour guide', 'Travel insurance'],
    exclusions: ['Airfare to Chandigarh/Bhuntar', 'Lunch & personal expenses', 'Adventure activity charges', 'Tips & gratuities', 'Camera fees at monuments'],
  },
  4: {
    title: 'Kerala Backwater Bliss', subtitle: 'God\'s Own Country',
    location: 'Kerala', duration: '5 Days / 4 Nights', maxGroup: 12, rating: 4.7, reviews: 175, price: '18,999', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-teal-900 to-teal-600',
    itinerary: [
      { day: 1, title: 'Arrival in Kochi', desc: 'Arrive at Cochin airport. Explore Fort Kochi — Chinese fishing nets, St. Francis Church, Mattancherry Palace, and Jewish Synagogue. Evening Kathakali dance show.', highlights: ['Fort Kochi', 'Chinese Nets', 'Kathakali show'] },
      { day: 2, title: 'Kochi to Munnar', desc: 'Drive to Munnar (130km) through tea plantations and waterfalls. Visit Cheeyappara and Valara waterfalls en route. Check into hill resort.', highlights: ['Tea gardens', 'Waterfalls', 'Hill station'] },
      { day: 3, title: 'Munnar Exploration', desc: 'Visit Eravikulam National Park (Nilgiri Tahr), Tea Museum, Top Station for panoramic views, and Echo Point. Evening at leisure.', highlights: ['Eravikulam Park', 'Tea Museum', 'Top Station'] },
      { day: 4, title: 'Munnar to Alleppey Houseboat', desc: 'Drive to Alleppey (200km). Board a traditional Kettuvallam houseboat for overnight cruise through serene backwaters, lagoons, and coconut groves.', highlights: ['Houseboat cruise', 'Backwaters', 'Kerala cuisine'] },
      { day: 5, title: 'Alleppey to Kochi Departure', desc: 'Disembark after breakfast on the houseboat. Drive to Kochi (60km) for departure. Optional spice market visit before heading to the airport.', highlights: ['Spice market', 'Sunrise cruise', 'Departure'] },
    ],
    inclusions: ['Heritage hotels & houseboat stay', 'All meals on houseboat', 'Daily breakfast at hotels', 'AC private vehicle', 'Kathakali show tickets', 'Tea plantation visit', 'Travel insurance'],
    exclusions: ['Airfare to Kochi', 'Lunch & dinner (except houseboat)', 'Entry fees at monuments', 'Personal expenses', 'Tips & gratuities'],
  },
  5: {
    title: 'Golden Triangle Tour', subtitle: 'Heritage Circuit',
    location: 'Delhi-Agra-Jaipur', duration: '6 Days / 5 Nights', maxGroup: 30, rating: 4.6, reviews: 230, price: '15,999', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-amber-900 to-amber-600',
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', desc: 'Arrive at IGI Airport. Visit India Gate, Rashtrapati Bhavan (exterior), and Raj Ghat. Evening explore Connaught Place and enjoy street food at Chandni Chowk.', highlights: ['India Gate', 'Raj Ghat', 'Chandni Chowk'] },
      { day: 2, title: 'Old & New Delhi', desc: 'Morning visit Red Fort, Jama Masjid, and Humayun\'s Tomb. Afternoon explore Qutub Minar, Lotus Temple, and drive past diplomatic area.', highlights: ['Red Fort', 'Qutub Minar', 'Lotus Temple'] },
      { day: 3, title: 'Delhi to Agra', desc: 'Drive to Agra (230km) via Yamuna Expressway. Visit the iconic Taj Mahal at sunset — the most photographed monument in the world.', highlights: ['Taj Mahal sunset', 'Yamuna Expressway', 'Agra arrival'] },
      { day: 4, title: 'Agra to Jaipur via Fatehpur Sikri', desc: 'Morning visit Agra Fort and Mehtab Bagh (Taj reflection point). Drive to Jaipur via Fatehpur Sikri — Emperor Akbar\'s abandoned capital.', highlights: ['Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh'] },
      { day: 5, title: 'Jaipur — Pink City', desc: 'Full day in Jaipur — Amber Fort (elephant/jeep ride), City Palace, Jantar Mantar observatory, and Hawa Mahal. Evening bazaar shopping.', highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace'] },
      { day: 6, title: 'Jaipur to Delhi Departure', desc: 'Morning visit Albert Hall Museum and local craft markets. Drive to Delhi (280km) or take the train. Transfer to airport for departure.', highlights: ['Craft markets', 'Albert Hall', 'Departure'] },
    ],
    inclusions: ['4-star heritage hotels', 'Daily breakfast', 'AC Tempo Traveller / car', 'English-speaking guide at each city', 'All monument entry tickets', 'Fatehpur Sikri entry', 'Travel insurance'],
    exclusions: ['Airfare to/from Delhi', 'Lunch & dinner', 'Camera fees at monuments', 'Elephant ride charges', 'Personal shopping & tips'],
  },
  6: {
    title: 'Ladakh Adventure', subtitle: 'Land of High Passes',
    location: 'Ladakh', duration: '8 Days / 7 Nights', maxGroup: 15, rating: 4.9, reviews: 120, price: '35,499', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-blue-900 to-blue-600',
    itinerary: [
      { day: 1, title: 'Arrival in Leh', desc: 'Fly into Leh (3,524m). Complete rest for acclimatization — crucial for high-altitude travel. Evening stroll on Leh Main Market. Light dinner.', highlights: ['Acclimatization', 'Leh Market', 'Rest day'] },
      { day: 2, title: 'Leh Local Sightseeing', desc: 'Visit Shanti Stupa for panoramic views, Leh Palace, Hall of Fame Museum, and Sankar Monastery. Inner Line Permits arranged for the trip.', highlights: ['Shanti Stupa', 'Leh Palace', 'Permits'] },
      { day: 3, title: 'Leh to Nubra Valley', desc: 'Drive over Khardung La Pass (5,359m) — the world\'s highest motorable road. Descend into Nubra Valley. Enjoy double-humped camel safari at Hunder sand dunes.', highlights: ['Khardung La', 'Camel safari', 'Hunder dunes'] },
      { day: 4, title: 'Nubra Valley Exploration', desc: 'Visit Diskit Monastery (largest in Nubra), 108ft Maitreya Buddha statue. Explore Turtuk village — the last village before LoC. Overnight in camp.', highlights: ['Diskit Monastery', 'Maitreya Buddha', 'Turtuk village'] },
      { day: 5, title: 'Nubra to Pangong Lake', desc: 'Drive via Shyok Valley to Pangong Tso (4,350m). The lake changes colors from blue to green to red. Camp by the lakeshore under star-filled skies.', highlights: ['Pangong Tso', 'Shyok Valley', 'Lakeside camping'] },
      { day: 6, title: 'Pangong to Leh via Chang La', desc: 'Sunrise at Pangong Lake. Drive back to Leh via Chang La Pass (5,360m). Stop at Thiksey and Hemis monasteries en route. Overnight in Leh.', highlights: ['Pangong sunrise', 'Chang La', 'Thiksey Monastery'] },
      { day: 7, title: 'Magnetic Hill & Sangam', desc: 'Visit Magnetic Hill (gravity-defying phenomenon), Gurudwara Patthar Sahib, and Sangam (confluence of Indus & Zanskar rivers). Afternoon free for shopping.', highlights: ['Magnetic Hill', 'Sangam point', 'Indus-Zanskar'] },
      { day: 8, title: 'Departure from Leh', desc: 'Morning at leisure. Transfer to Leh airport for your flight. Carry memories of the most surreal landscapes you\'ve ever witnessed.', highlights: ['Free morning', 'Airport transfer', 'Departure'] },
    ],
    inclusions: ['Hotels & premium camps', 'All meals (B/L/D)', '4x4 SUV / Tempo Traveller', 'Inner Line Permits', 'Oxygen cylinders & medical kit', 'Professional Ladakh guide', 'Travel insurance'],
    exclusions: ['Airfare to/from Leh', 'Personal expenses', 'Camera fees at monasteries', 'Tips & gratuities', 'Bike rental charges'],
  },
  7: {
    title: 'Goa Beach Getaway', subtitle: 'Sun, Sand & Soul',
    location: 'Goa', duration: '4 Days / 3 Nights', maxGroup: 20, rating: 4.5, reviews: 290, price: '12,999', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-cyan-900 to-cyan-600',
    itinerary: [
      { day: 1, title: 'Arrival in North Goa', desc: 'Arrive at Goa airport, transfer to beachside resort in North Goa. Relax and unwind. Evening explore Baga Beach and enjoy Goan seafood at a beachfront shack.', highlights: ['Beach resort', 'Baga Beach', 'Seafood dinner'] },
      { day: 2, title: 'North Goa Sightseeing', desc: 'Visit Aguada Fort, Anjuna Flea Market, Vagator Beach, and Chapora Fort (Dil Chahta Hai fame). Evening sunset cruise on the Mandovi River.', highlights: ['Aguada Fort', 'Anjuna Market', 'Sunset cruise'] },
      { day: 3, title: 'South Goa Heritage', desc: 'Drive to South Goa — visit Basilica of Bom Jesus, Se Cathedral, Mangeshi Temple. Explore Colva and Palolem beaches. Evening Goan Feni tasting.', highlights: ['Old Goa churches', 'Palolem Beach', 'Heritage walk'] },
      { day: 4, title: 'Beach Morning & Departure', desc: 'Free morning for water sports — parasailing, jet ski, banana ride. Optional spice plantation visit. Transfer to airport for departure.', highlights: ['Water sports', 'Spice plantation', 'Departure'] },
    ],
    inclusions: ['Beachside resort (3-star+)', 'Daily breakfast', 'AC vehicle for sightseeing', 'Sunset cruise tickets', 'Water sports package (basic)', 'Airport transfers', 'Travel insurance'],
    exclusions: ['Airfare to/from Goa', 'Lunch & dinner', 'Premium water sports', 'Nightclub entry charges', 'Personal shopping & tips'],
  },
  8: {
    title: 'Rishikesh & Haridwar Spiritual', subtitle: 'Soul Awakening',
    location: 'Uttarakhand', duration: '4 Days / 3 Nights', maxGroup: 20, rating: 4.7, reviews: 165, price: '11,499', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-purple-900 to-purple-600',
    itinerary: [
      { day: 1, title: 'Arrival in Rishikesh', desc: 'Arrive at Dehradun airport, drive to Rishikesh (30km). Check into riverside ashram/resort. Evening attend the Ganga Aarti at Triveni Ghat — lamps, chanting, and devotion.', highlights: ['Triveni Ghat', 'Ganga Aarti', 'Ashram check-in'] },
      { day: 2, title: 'Rishikesh Spiritual Day', desc: 'Morning yoga session at Parmarth Niketan. Visit Ram Jhula, Laxman Jhula, Beatles Ashram. Afternoon meditation at Vashisht Gufa. Evening river rafting (optional).', highlights: ['Yoga session', 'Beatles Ashram', 'River rafting'] },
      { day: 3, title: 'Rishikesh to Haridwar', desc: 'Morning trek to Neer Garh waterfall. Drive to Haridwar (25km). Visit Mansa Devi Temple (cable car), Chandi Devi, and Bharat Mata Temple. Evening Ganga Aarti at Har Ki Pauri.', highlights: ['Neer Garh', 'Mansa Devi', 'Har Ki Pauri'] },
      { day: 4, title: 'Haridwar & Departure', desc: 'Early morning dip in the Ganges. Visit Shantikunj Ashram and Patanjali Yogpeeth. Transfer to Dehradun airport for departure.', highlights: ['Morning dip', 'Patanjali Yogpeeth', 'Departure'] },
    ],
    inclusions: ['Riverside resort / ashram stay', 'Daily breakfast & dinner', 'Yoga & meditation sessions', 'AC vehicle transfers', 'Rafting experience (optional)', 'Temple entry tickets', 'Travel insurance'],
    exclusions: ['Airfare to Dehradun', 'Lunch', 'Personal puja charges', 'Adventure activity fees', 'Tips & donations'],
  },
  9: {
    title: 'Darjeeling & Gangtok', subtitle: 'Eastern Himalayas',
    location: 'West Bengal & Sikkim', duration: '6 Days / 5 Nights', maxGroup: 18, rating: 4.7, reviews: 140, price: '19,999', priceNote: 'per person (twin sharing)',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1400&h=600&fit=crop',
    gradient: 'from-[#2B3A52] via-lime-900 to-lime-600',
    itinerary: [
      { day: 1, title: 'Arrival in Gangtok', desc: 'Arrive at Bagdogra airport, drive to Gangtok (125km). Check into hotel with Kanchenjunga views. Evening stroll on MG Marg — the vibrant pedestrian street.', highlights: ['MG Marg', 'Kanchenjunga views', 'Hotel check-in'] },
      { day: 2, title: 'Gangtok Sightseeing', desc: 'Visit Tsomgo Lake (12,400ft), Baba Mandir, and Nathula Pass (India-China border). Enjoy yak rides and snow activities at Tsomgo.', highlights: ['Tsomgo Lake', 'Nathula Pass', 'Baba Mandir'] },
      { day: 3, title: 'Gangtok to Darjeeling', desc: 'Drive to Darjeeling (100km) through lush tea gardens and river valleys. Arrive and visit the Himalayan Mountaineering Institute and Padmaja Naidu Zoo (Red Pandas).', highlights: ['Tea gardens', 'HMI Museum', 'Red Pandas'] },
      { day: 4, title: 'Tiger Hill Sunrise & Darjeeling', desc: 'Pre-dawn excursion to Tiger Hill for the legendary Kanchenjunga sunrise. Visit Batasia Loop, Ghoom Monastery. Afternoon ride the iconic Darjeeling Toy Train (UNESCO).', highlights: ['Tiger Hill sunrise', 'Toy Train', 'Batasia Loop'] },
      { day: 5, title: 'Darjeeling Tea & Culture', desc: 'Visit Happy Valley Tea Estate for a factory tour and tasting. Explore Peace Pagoda, Japanese Temple, and Observatory Hill. Evening at Glenary\'s bakery.', highlights: ['Tea estate', 'Peace Pagoda', 'Glenary\'s'] },
      { day: 6, title: 'Departure from Darjeeling', desc: 'Morning at leisure for souvenir shopping. Drive to Bagdogra airport (90km) for departure. Carry the taste of world-famous Darjeeling tea with you.', highlights: ['Shopping', 'Airport transfer', 'Departure'] },
    ],
    inclusions: ['3-star hotels with mountain views', 'Daily breakfast', 'AC vehicle (Innova/Xylo)', 'Tsomgo Lake & Nathula permits', 'Toy Train tickets', 'Professional local guide', 'Travel insurance'],
    exclusions: ['Airfare to Bagdogra', 'Lunch & dinner', 'Entry fees at museums', 'Personal expenses', 'Tips & gratuities'],
  },
};

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await packageService.getById(id);
        // Axios interceptor unwraps response.data, so res = { success, data: pkgDoc }
        const data = res?.data || res;
        if (data) {
          // Map API data to the expected format
          setPkg({
            title: data.title,
            subtitle: data.subtitle || '',
            location: data.location,
            duration: data.duration,
            maxGroup: data.group || 20,
            rating: data.rating || 4.5,
            reviews: data.reviewCount || 0,
            price: typeof data.basePrice === 'number' ? data.basePrice.toLocaleString('en-IN') : (data.basePrice || '0'),
            priceNote: 'per person (twin sharing)',
            image: data.images?.[0] || data.images?.[1] || '',
            gradient: data.gradient || 'from-[#2B3A52] via-primary-900 to-secondary-700',
            description: data.description || '',
            itinerary: data.itinerary || [],
            inclusions: data.inclusions || [],
            exclusions: data.exclusions || [],
          });
        } else {
          // Fallback to hardcoded data
          setPkg(packageData[id] || null);
        }
      } catch {
        // Fallback to hardcoded data on error
        setPkg(packageData[id] || null);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 pb-24 bg-surface-dim min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="pt-24 pb-24 bg-surface-dim min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl font-heading font-bold text-gradient-warm mb-4">404</p>
          <p className="text-gray-400 mb-6">Package not found</p>
          <Link to="/packages" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold">
            <ArrowLeft className="w-4 h-4" /> Browse Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className="absolute top-40 right-[5%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/packages" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="border-b border-gray-300 group-hover:border-primary-400 pb-0.5 transition-colors">Back to Packages</span>
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Hero with Parallax */}
          <motion.div ref={heroRef} variants={scaleIn} className="relative h-[320px] md:h-[440px] rounded-3xl overflow-hidden mb-12">
            <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient}`} />
              <img
                src={pkg.image}
                alt={pkg.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
              <Compass className="w-64 h-64 text-white" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-10">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-xs font-medium uppercase tracking-wider mb-4">
                  <Compass className="w-3.5 h-3.5" />
                  {pkg.title}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-4">
                  {pkg.title} — <span className="italic font-normal text-gradient-warm">{pkg.subtitle}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {pkg.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {pkg.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Max {pkg.maxGroup} people</span>
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-accent-400 fill-accent-400" /> {pkg.rating} ({pkg.reviews} reviews)</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-14">
              {/* Description */}
              {pkg.description && (
                <motion.div variants={reveal}>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.5 }} className="h-[2px] bg-primary-500" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Overview</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-6">
                    About this <span className="italic font-normal text-gradient-warm">journey</span>
                  </h2>
                  <p className="leading-relaxed text-gray-500">{pkg.description}</p>
                </motion.div>
              )}

              {/* Itinerary */}
              <motion.div variants={reveal}>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.5 }} className="h-[2px] bg-primary-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Day-wise Plan</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-10">
                  Your <span className="italic font-normal text-gradient-warm">itinerary</span>
                </h2>

                <div className="space-y-0">
                  {pkg.itinerary.map((item, i) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative flex gap-6 pb-8 last:pb-0"
                    >
                      {i < pkg.itinerary.length - 1 && (
                        <motion.div
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                          className="absolute left-[22px] top-[48px] bottom-0 w-px bg-gradient-to-b from-primary-300 to-transparent origin-top"
                        />
                      )}
                      <div className="relative z-10 shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20"
                        >
                          {String(item.day).padStart(2, '0')}
                        </motion.div>
                      </div>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                      >
                        <h3 className="font-heading font-semibold text-lg text-heading mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-3">{item.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.highlights.map((h) => (
                            <span key={h} className="text-[11px] px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 font-medium">
                              {h}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Inclusions / Exclusions */}
              <motion.div variants={reveal}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                        <Check className="w-5 h-5 text-secondary-500" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-heading">Included</h3>
                    </div>
                    <ul className="space-y-3.5">
                      {pkg.inclusions.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-3 text-sm text-gray-500"
                        >
                          <div className="w-5 h-5 rounded-full bg-secondary-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-secondary-500" />
                          </div>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <X className="w-5 h-5 text-red-400" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-heading">Not Included</h3>
                    </div>
                    <ul className="space-y-3.5">
                      {pkg.exclusions.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-3 text-sm text-gray-500"
                        >
                          <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-red-400" />
                          </div>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar — Booking Card */}
            <motion.div variants={reveal} className="space-y-6">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-[#2B3A52] rounded-3xl p-8 sticky top-28 overflow-hidden relative"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-500/10 blur-[60px]" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent-500/10 blur-[50px]" />

                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Starting from</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                    className="text-4xl font-heading font-bold text-white mb-1"
                  >
                    ₹{pkg.price}
                  </motion.p>
                  <p className="text-sm text-white/30 mb-8">{pkg.priceNote}</p>

                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Calendar, text: 'Flexible dates available' },
                      { icon: Users, text: `Small groups (max ${pkg.maxGroup})` },
                      { icon: Check, text: 'Free cancellation (7 days)' },
                    ].map((item) => (
                      <motion.div
                        key={item.text}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 text-sm text-white/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary-400" />
                        </div>
                        {item.text}
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    to={`/booking/${id}`}
                    className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300"
                  >
                    Book Now
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                  </Link>

                  <p className="text-center text-xs text-white/20 mt-4">No payment required today</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageDetail;
