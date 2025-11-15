import Apartment from '../models/Apartment.js';
import asyncHandler from '../middleware/async.js';
import { normalizeApartmentBody } from '../utils/normalize.js';
import ErrorResponse from '../utils/errorResponse.js';
export const createApartment = asyncHandler(async (req, res, next) => {
    const imageUrls = req.files.map((file) => file.path);
    const cleanBody = normalizeApartmentBody(req.body);
    const apt = await Apartment.create({
        ...cleanBody,
        images: imageUrls,
        user: req.user._id,
    });
    res.status(201).json({
        success: true,
        data: apt,
    });
});
export const getApartments = asyncHandler(async (req, res, next) => {
    const apartments = await Apartment.find().populate({
        path: 'user',
        select: 'firstName lastName email',
    });
    res.status(200).json({
        success: true,
        count: apartments.length,
        data: apartments,
    });
});
export const getApartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const apartment = await Apartment.findById(id).populate({
        path: 'user',
        select: 'firstName lastName email',
    });
    if (!apartment) {
        return next(new ErrorResponse('Apartment not found', 404));
    }
    res.status(200).json({
        success: true,
        data: apartment,
    });
});
export const checkReferenceNo = asyncHandler(async (req, res, next) => {
    const { referenceNo } = req.query;
    if (!referenceNo) {
        return res.status(400).json({
            success: false,
            message: "referenceNo is required"
        });
    }
    const exists = await Apartment.findOne({ referenceNo });
    return res.status(200).json({
        success: true,
        exists: !!exists
    });
});
export const searchApartments = asyncHandler(async (req, res) => {
    const { search, compound } = req.query;
    const query = {};
    if (search && search.trim().length > 0) {
        const s = search;
        query.$or = [
            { title: { $regex: s, $options: "i" } },
            { referenceNo: { $regex: s, $options: "i" } },
            { compound: { $regex: s, $options: "i" } }
        ];
    }
    if (compound) {
        query.compound = compound;
    }
    const apartments = await Apartment.find(query)
        .sort({ createdAt: -1 })
        .populate({
        path: "user",
        select: "firstName lastName email",
    });
    res.status(200).json({
        success: true,
        count: apartments.length,
        data: apartments,
    });
});
export const getCompounds = asyncHandler(async (req, res) => {
    const compounds = await Apartment.distinct("compound");
    res.status(200).json({
        success: true,
        data: compounds
    });
});
//# sourceMappingURL=apartmentController.js.map