"use client";

import { useParams } from 'next/navigation';
import { CITY_REGIONS } from '@/constants/cityData';
import CityPageTemplate from '@/components/CityPageTemplate';

export default function SubCityExplorer() {
    const params = useParams();
    const regionSlug = params?.slug as string;
    const subSlug = params?.subSlug as string;

    // Find the region and then the sub-city data
    const region = CITY_REGIONS[regionSlug];
    const subCity = region?.subAreas.find(s => s.slug === subSlug);

    if (!region || !subCity) {
        return <div className="min-h-screen bg-asphalt-black text-white flex items-center justify-center">Location not found</div>;
    }

    return (
        <CityPageTemplate
            data={subCity}
            isSubCity={true}
            parentRegion={region}
            regionSlug={regionSlug}
        />
    );
}
