import mongoose, { Schema } from 'mongoose';
const ApartmentSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
    },
    referenceNo: {
        type: String,
        unique: true,
        required: [true, 'Reference number is required'],
    },
    images: {
        type: [String],
        validate: [
            (val) => val.length > 0,
            'At least one image is required',
        ],
    },
    bedrooms: {
        type: Number,
        required: true,
        min: [1, 'Bedrooms must be at least 1'],
    },
    bathrooms: {
        type: Number,
        required: true,
        min: [1, 'Bathrooms must be at least 1'],
    },
    deliverIn: {
        type: Number,
        required: true,
        validate: {
            validator: (year) => year >= 2025,
            message: 'Delivery year cannot be before 2025',
        },
    },
    compound: {
        type: String,
        required: [true, 'Compound name is required'],
    },
    finished: {
        type: String,
        enum: ['FULLY', 'HALF'],
        required: true,
    },
    location: {
        description: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
            min: [-90, 'Latitude cannot be less than -90'],
            max: [90, 'Latitude cannot be greater than 90'],
        },
        long: {
            type: Number,
            required: true,
            min: [-180, 'Longitude cannot be less than -180'],
            max: [180, 'Longitude cannot be greater than 180'],
        },
    },
    amenities: {
        undergroundParking: { type: Boolean, default: false },
        medicalCare: { type: Boolean, default: false },
        commercialStrip: { type: Boolean, default: false },
        businessHub: { type: Boolean, default: false },
        outdoorPool: { type: Boolean, default: false },
        joggingTrails: { type: Boolean, default: false },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
ApartmentSchema.index({
    title: "text",
    compound: "text",
});
ApartmentSchema.index({ referenceNo: 1 }, { unique: true });
const Apartment = mongoose.model('Apartment', ApartmentSchema);
export default Apartment;
//# sourceMappingURL=Apartment.js.map