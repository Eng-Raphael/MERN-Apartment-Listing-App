import mongoose, { Document } from 'mongoose';

export interface IApartment extends Document {
    title: string;
    referenceNo: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    deliverIn: number;
    compound: string;
    finished: 'FULLY' | 'HALF';

    location: {
        description: string;
        lat: number;
        long: number;
    };

    amenities: {
        undergroundParking: boolean;
        medicalCare: boolean;
        commercialStrip: boolean;
        businessHub: boolean;
        outdoorPool: boolean;
        joggingTrails: boolean;
    };

    user: mongoose.Types.ObjectId;
}
