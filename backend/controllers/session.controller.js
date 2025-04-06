// import SessionModel from "../models/session.model.js";
import { SessionModel } from "../models/session.model.js";
export const createSession = async (req, res) => {
    try {
        const { name, value, url, description, isActive } = req.body;

        if (!name || !value) {
            return res.status(400).json({
                status: 400,
                message: "Name and value are required fields.",
            });
        }

        const existingSession = await SessionModel.findOne({
            name,
            isDeleted: false,
        });

        if (existingSession) {
            return res.status(202).json({
                status: 202,
                message:
                    "Session with this name already exists. Please choose a different name.",
            });
        }

        const newSession = new SessionModel({
            name,
            value,
            url,
            description,
            // image: req.file?.filename ?? null,
            isActive: isActive ?? true,
        });

        const result = await newSession.save();

        return res.status(200).json({
            status: 200,
            message: "Session has been created successfully.",
            data: result,
        });
    } catch (error) {
        console.log("Error creating session:", error.message);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later." });
    }
};

export const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, value, url, description, isActive } = req.body;

        const existingSession = await SessionModel.findById(id);
        if (!existingSession) {
            return res.status(404).json({ message: "Session not found." });
        }

        const updatedData = {
            name,
            value,
            url,
            description,
            // image: isEdit ? req.file?.filename : req.body?.filename,
            isActive,
        };

        const result = await SessionModel.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        // generateNotification(
        //     req,
        //     "Admin has updated your account details.",
        //     req?.user?.id,
        //     id
        // );
        // generateAuditTrail(
        //     req,
        //     "User has been updated successfully",
        //     "Update",
        //     "User Module",
        //     req?.user?.id,
        //     "Success",
        //     req?.headers?.ipaddress
        // );

        return res.status(200).json({
            status: 200,
            message: "User has been updated successfully.",
            data: result,
        });
    } catch (error) {
        console.log("error----------->", error);
        // createErrorAuditTrail(
        //     error.message,
        //     "Update",
        //     "User Module",
        //     req?.user?.id,
        //     req?.headers?.domainurl,
        //     "Error",
        //     req?.headers?.ipaddress
        // );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later." });
    }
};

export const listSession = async (req, res) => {
    try {
        const {
            page,
            perPage,
            getAll,
            searchValue,
            getSessionsWithoutWorkflow,
        } = req.body;
        const filter = { isDeleted: false };

        if (searchValue) {
            filter.$or = [
                { name: { $regex: searchValue, $options: "i" } },
                { value: { $regex: searchValue, $options: "i" } },
                { description: { $regex: searchValue, $options: "i" } },
            ];
        }

        if (getAll) {
            const result = await SessionModel.find(filter);
            return res.status(200).json({
                status: 200,
                message: "Session retrieved successfully.",
                data: result,
            });
        }

        const actualPage = parseInt(page, 10) || 1;
        const actualPerPage = parseInt(perPage, 10) || 25;

        const [data, count] = await Promise.all([
            SessionModel.find(filter)
                .skip((actualPage - 1) * actualPerPage)
                .limit(actualPerPage)
                .sort({ _id: -1 }),
            SessionModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            status: 200,
            message: "Session retrieved successfully.",
            data: { rows: data, count },
        });
    } catch (error) {
        console.log("error=========>", error);

        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later." });
    }
};

export const getSessionById = async (req, res) => {
    try {
        const id = req.params.id === "detail" ? req.user.id : req.params.id;

        const session = await SessionModel.findById(id);
        if (!session) {
            return res.status(404).json({
                status: 404,
                message: "Session not found.",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Session retrieved successfully.",
            data: session,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later." });
    }
};

export const getAllSessions = async (req, res) => {
    try {
        const sessions = await SessionModel.find({ isDeleted: false });
        return res.status(200).json({
            status: 200,
            message: "Session retrieved successfully.",
            data: sessions,
        });
    } catch (error) {
        console.log("error================>", error);
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later." });
    }
};
