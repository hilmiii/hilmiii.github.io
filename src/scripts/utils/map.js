let mapInstance = null;

export const initMap = (elementId) => {
    if (mapInstance) {
        mapInstance.remove();
    }
    
    mapInstance = L.map(elementId).setView([-2.5489, 118.0149], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    return mapInstance;
};


export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation tidak didukung oleh browser ini.'));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
};

export const getLocationName = async (lat, lon) => {
  try {
    if (!isValidCoordinate(lat, lon)) {
      throw new Error('Koordinat tidak valid');
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your@email.com)'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return formatAddress(data);
  } catch (error) {
    console.error('Error in getLocationName:', error);
    throw error;
  }
};

function isValidCoordinate(lat, lon) {
  return lat !== undefined && lon !== undefined &&
         !isNaN(lat) && !isNaN(lon) &&
         lat >= -90 && lat <= 90 &&
         lon >= -180 && lon <= 180;
}

function formatAddress(data) {
  if (!data.address) return data.display_name || null;

  const { address } = data;
  const addressParts = [
    address.road,
    address.village,
    address.town,
    address.city,
    address.state,
    address.country
  ].filter(Boolean);

  return addressParts.length > 0 ? addressParts.join(', ') : data.display_name;
}

export const showStoriesOnMap = (map, stories) => {
  stories.forEach(story => {
    if (isValidCoordinate(story.lat, story.lon)) {
      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`<b>${story.name}</b><br>${story.description.substring(0, 50)}...`);
    }
  });
};