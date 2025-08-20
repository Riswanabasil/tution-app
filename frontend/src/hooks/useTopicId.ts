import { useParams } from "react-router-dom";

export default function useTopicId() {
  const { topicId } = useParams<{ topicId: string }>();
  if (!topicId) throw new Error("topicId missing in route");
  return topicId;
}
