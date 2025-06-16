import { Request, Response } from "express";
import { getAllStudentsService, toggleBlockStudentService } from "../../../services/admin/student/AdminStudentService";

export const getAllStudentsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const sort = (req.query.sort as string) || "createdAt";
    const order = (req.query.order as string) === "asc" ? 1 : -1;

    const result = await getAllStudentsService(page, limit, search, sort, order);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch students" });
  }
};

export const toggleBlockStudentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    await toggleBlockStudentService(id, isBlocked);
    res.status(200).json({ message: `Student ${isBlocked ? "blocked" : "unblocked"} successfully` });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update student status" });
  }
};

