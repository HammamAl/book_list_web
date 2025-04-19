// src/pages/CategoryFormPage.js
import React from "react";
import CategoryForm from "../components/categories/CategoriesForm.js";
import { useParams } from "react-router-dom";

const CategoryFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  console.log("CategoryFormPage - ID:", id, "isEditMode:", isEditMode);

  return <CategoryForm id={id} isEditMode={isEditMode} />;
};

export default CategoryFormPage;
