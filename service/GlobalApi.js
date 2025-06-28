import axios from "axios";

// Load the API key and base URL from environment variables
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

// ✅ Create a new resume
const CreateNewResume = (data) => axiosClient.post('/user-resumes', data);

// ✅ Get all resumes for a specific user by email
const GetUserResumes = (userEmail) =>
  axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);

// ✅ Update resume by Strapi's internal ID
const UpdateResumeDetail = (id, data) =>
  axiosClient.put(`/user-resumes/${id}`, data);

// ✅ Get resume by Strapi's internal numeric ID (used during updates)
const GetResumeById = (id) =>
  axiosClient.get(`/user-resumes/${id}?populate=*`);

// ✅ Get resume by custom UUID (`resumeId` field from Strapi)
const GetResumeByResumeId = (resumeId) =>
  axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}&populate=*`);

// ✅ Delete a resume by internal Strapi ID
const DeleteResumeById = (id) =>
  axiosClient.delete(`/user-resumes/${id}`);

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  GetResumeByResumeId,
  DeleteResumeById
};
