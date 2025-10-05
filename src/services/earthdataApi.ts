// src/services/earthdataApi.ts
const EARTHDATA_API = 'https://cmr.earthdata.nasa.gov/search';

export async function searchLunarData(date: Date) {
  const response = await fetch(
    `${EARTHDATA_API}/granules.json?temporal=${date.toISOString()}&keyword=lunar`
  );
  return await response.json();
}