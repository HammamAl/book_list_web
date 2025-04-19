import api from "./api.js";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  try {
    console.log("Fetching category with ID:", id);
    const response = await api.get(`/categories/${id}`);
    console.log("Category data from API:", response.data);

    if (!response.data) {
      throw new Error("No data received from API");
    }

    return response.data;
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    throw error;
  }
};
export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.patch(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
