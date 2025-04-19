import api from "./api";

export const getBooks = async (filters = {}) => {
  const { categoryId, search, publicationDate } = filters;
  let url = "/books";

  const params = new URLSearchParams();
  if (categoryId) params.append("categoryId", categoryId);
  if (search) params.append("search", search);
  if (publicationDate) params.append("publicationDate", publicationDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getBookById = async (id) => {
  try {
    console.log("Fetching book with ID:", id);
    const response = await api.get(`/books/${id}`);
    console.log("Book data from API:", response.data);

    if (!response.data) {
      throw new Error("No data received from API");
    }

    return response.data;
  } catch (error) {
    console.error("Error in getBookById:", error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  const response = await api.post("/books", bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.patch(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};
