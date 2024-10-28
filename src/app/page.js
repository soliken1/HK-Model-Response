"use client";
import { useState } from "react";
import { db } from "../configs/firebaseConfigs";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [responseData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(
      "https://cors-anywhere.herokuapp.com/https://hk-recommender.vercel.app/recommend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputText }),
      }
    );
    const data = await response.json();
    setResponseData(data.response);
    setLoading(false);

    try {
      await addDoc(collection(db, "recommender-dataset"), {
        input: inputText,
        response: data.response,
      });
      console.log("Document written successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <form
        className="flex flex-col justify-center items-center gap-5"
        onSubmit={handleSubmit}
      >
        {loading ? (
          <div
            className="w-96 h-10 animate-pulse rounded-full
          
           bg-gray-500 duration-300"
          ></div>
        ) : responseData ? (
          <div className="text-white mb-4">{responseData}</div>
        ) : (
          <div className="text-gray-500 mb-4">
            By Using This Web Application, You Agree That Your Data Being
            Inputted Is Being Used
          </div>
        )}
        <div className="flex flex-row gap-5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text"
            className="w-96 px-2 rounded-md"
          />
          <button
            type="submit"
            className="px-10 py-2 bg-blue-500 rounded-md text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
