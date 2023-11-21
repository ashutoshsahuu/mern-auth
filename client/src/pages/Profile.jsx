import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut
} from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const deleteUserHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const signOutHandler = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="w-[80%] bg-slate-400 h-[89vh] mx-auto">
        <h1 className="text-3xl font-bold text-center py-5 underline">
          Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[50%] mx-auto gap-4"
        >
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />

          <img
            src={formData.profilePicture || currentUser.profilePicture}
            className="h-24 w-24 self-center object-cover rounded-full mt-5 cursor-pointer"
            alt="profile"
            accept="image/*"
            onClick={() => fileRef.current.click()}
          />

          <p className="text-sm self-center">
            {imageError ? (
              <span className="text-red-700">
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className="text-green-700">
                Image uploaded successfully
              </span>
            ) : (
              ""
            )}
          </p>

          <input
            defaultValue={currentUser.username}
            type="text"
            placeholder="username"
            id="username"
            className="p-3 bg-slate-100 rounded "
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            placeholder="email"
            id="email"
            className="p-3 bg-slate-100 rounded  "
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="p-3 bg-slate-100 rounded   "
            onChange={handleChange}
          />

          <button className=" bg-slate-700 p-3 rounded text-white hover:opacity-90">
            {loading ? "Loading..." : "Update"}
          </button>
        </form>

        <div className="w-[50%] mx-auto mt-3 flex justify-between">
          <span onClick={deleteUserHandler} className="text-red-700 cursor-pointer">
            Delete Account
          </span>
          <span onClick={signOutHandler} className="text-red-700 cursor-pointer">Sign Out</span>
        </div>

        <div className="w-[50%] mx-auto mt-3">
          <p className="text-red-700 ">{error && "Something Went Wrong"}</p>
          <p className="text-green-700 ">
            {updateSuccess && "Profile Updated Successfully"}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
