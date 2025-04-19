import React from "react";
import BookForm from "../components/books/BookForm";
import { useParams } from "react-router-dom";

const BookFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  console.log("BookFormPage - ID:", id, "isEditMode:", isEditMode);

  return <BookForm id={id} isEditMode={isEditMode} />;
};

export default BookFormPage;
