import axios from 'axios';

const api = axios.create({
    baseURL: "/api"
})

export interface Region {
    id: string;
    name: string;
    currentPrice: number;
    unit?: string;
}

interface RegionResponse {
    regions: Region[];
    nextPage?: number;
}

const extractRegions = (htmlString: string): Region[] => {
    const regex = /\b([A-Z0-9]+)\s*-\s*([A-Za-z\0-9]+)(?=<br>|\s\(click to show all available bidding zones)/g;
    const regions: Region[] = [];
    let match:any;
  
    while ((match = regex.exec(htmlString)) !== null) {
      const regionNames = match[2];
      const regionId = match[0].split(" ")[0].trim();
        if (regionNames) {
          regions.push({ id: regionId, name:regionNames, currentPrice: Math.floor(Math.random() * 100,)});
        }
    }
    return regions;
  };



export default {
    async getRegionWithPrices(): Promise<RegionResponse> {
        const response = await api.get('/openapi.json');
        const htmlString = response.data.info.description;
        const regions = extractRegions(htmlString);
         // Fetch prices for all regions in parallel
         const regionPricePromises = regions.map(region =>
          api.get(`/price?bzn=${region.id}`)
            .then(res => ({
              ...region,
              currentPrice: res.data.price[res.data.price.length - 1],
              unit:res.data.unit
            }))
            .catch(err => ({
              ...region,
              currentPrice: 'Error fetching price'
            }))
        );
    
        const regionsWithPrices = await Promise.all(regionPricePromises);
        return { regions: regionsWithPrices };
    }
}