import type { Assignment, AssignmentId } from "../../types/assignment";

export interface IAssignmentRepository {

  create(
    data: Omit<Assignment, "_id" | "isDeleted" | "createdAt" | "updatedAt">
  ): Promise<Assignment>;

  findByTopic(topicId: string): Promise<Assignment[]>;

  /**
   * Get one active (isDeleted=false) assignment by id.
   */
  findById(id: AssignmentId): Promise<Assignment | null>;

  /**
   * Update fields on an active assignment.
   */
  update(
    id: AssignmentId,
    update: Partial<Omit<Assignment, "_id" | "createdAt" | "updatedAt">>
  ): Promise<Assignment | null>;

  /**
   * Soft-delete (set isDeleted=true). Returns true if modified.
   */
  softDelete(id: AssignmentId): Promise<boolean>;
}
