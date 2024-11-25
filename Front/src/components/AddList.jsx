import React, { useState } from "react";
import axios from "axios";

const AddList = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleContentChange = (e, index) => {
    const updatedContent = [...content];
    updatedContent[index] = e.target.value;
    setContent(updatedContent);
  };

  const handleAddField = () => {
    setContent([...content, ""]);
  };

  const handleRemoveField = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const listData = {
      name,
      content,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("You need to be logged in to create a list.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/list/create",
        listData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setName("");
      setContent([""]);
      setErrorMessage("");
      setIsFormVisible(false);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        {isFormVisible ? "Close Form" : "Create New List"}
      </button>

      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded shadow-lg max-w-lg w-full"
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              Create New List
            </h2>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Name of List:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label>Content:</label>
                {content.map((item, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContentChange(e, index)}
                      required
                      placeholder={`Item ${index + 1}`}
                      className="border p-2 rounded w-full"
                    />
                    {content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="ml-2 text-red-500 text-xl"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddField}
                  className="mt-2 text-blue-500"
                >
                  Add another item
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded w-full mt-4"
              >
                Create List
              </button>
            </form>

            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 mt-2">{successMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;
