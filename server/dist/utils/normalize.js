export const normalizeApartmentBody = (body) => {
    return {
        title: body.title,
        referenceNo: body.referenceNo,
        compound: body.compound,
        finished: body.finished,
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        deliverIn: Number(body.deliverIn),
        location: {
            description: body['location[description]'] || body.location?.description,
            lat: Number(body['location[lat]'] || body.location?.lat),
            long: Number(body['location[long]'] || body.location?.long),
        },
        amenities: {
            undergroundParking: body['amenities[undergroundParking]'] === 'true' ||
                body.amenities?.undergroundParking === 'true',
            medicalCare: body['amenities[medicalCare]'] === 'true' ||
                body.amenities?.medicalCare === 'true',
            commercialStrip: body['amenities[commercialStrip]'] === 'true' ||
                body.amenities?.commercialStrip === 'true',
            businessHub: body['amenities[businessHub]'] === 'true' ||
                body.amenities?.businessHub === 'true',
            outdoorPool: body['amenities[outdoorPool]'] === 'true' ||
                body.amenities?.outdoorPool === 'true',
            joggingTrails: body['amenities[joggingTrails]'] === 'true' ||
                body.amenities?.joggingTrails === 'true',
        }
    };
};
//# sourceMappingURL=normalize.js.map