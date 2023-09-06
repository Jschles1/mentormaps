import axios from "axios";

export async function fetchRoadmaps() {
  try {
    const response = await axios.get("/api/roadmaps");
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching Roadmaps :", error);
  }
}

export async function fetchRoadmapInvites() {
  try {
    const response = await axios.get("/api/roadmap-invites");
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching Roadmap Invites :", error);
  }
}
