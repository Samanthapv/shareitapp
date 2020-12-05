import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/requests";
import ProductList from "./ProductList";
import BorrowedProductList from "./BorrowedProductList";
import UpdatePicture from "./UpdatePicture";
import Footer from "./Footer";

const apiKey = "AIzaSyCY5W1P8DPRt-14tjH8O4jiLsFxxRp2Jl8";

export default function ProfilePage(props) {
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [load, setLoad] = useState();

  // Fetch user data when component mounts
  useEffect(() => {
    fetchData();
  }, [update]);

  let showPopUp = () => {
    setShow(true);
  };

  let hidePopUp = () => {
    setShow(false);
  };

  let changeEditMode = () => {
    setEditMode(!editMode);
  };

  const fetchData = async () => {
    const res = await getProfile();
    setUser(res.data);
    setAddress(res.data.address);
  };

  // Get coordinates of user's address

  const getCoords = (address) => {
    const formattedAddress = address.split(" ").join("+");

    const location = {};

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`
    )
      .then((res) => res.json())
      .then((response) => {
        location.lat = response.results[0].geometry.location.lat;
        location.lng = response.results[0].geometry.location.lng;

        setLocation(location);
      })
      .catch((err) => console.log(err));
  };

  const addressSubmit = async (event) => {
    event.preventDefault();

    getCoords(address);

    try {
      await updateProfile({ address });
    } catch (error) {
      console.log(error);
    }

    changeEditMode();
  };

  useEffect(() => {
    storeLocationCoords();
  }, [location]);

  const storeLocationCoords = async () => {
    await updateProfile(location);
  };

  return (
    <div className="text-center mt-4 ">
      <UpdatePicture
        show={show}
        handleClose={hidePopUp}
        userID={user.id}
        callback1={hidePopUp}
        callback2={setLoad}
      />

      {user && (
        <div>
          <div className="mainProfileDiv py-4 flex justify-center gap-4">
            {user.picture && (
              <img
                onClick={showPopUp}
                className="rounded-full cursor w-32 h-32 self-center object-fit border-4 border-indigo-500 border-opacity-50 hover:opacity-75"
                src={
                  user.picture.substring(0, 5) === "https"
                    ? user.picture
                    : `/../../../${user.picture.substring(
                        7,
                        user.picture.length
                      )}`
                }
                alt="profile-pic"
              />
            )}

            <div className=" flex flex-col justify-around">
              <h2 className="title">Hi there, {user.name}!</h2>
              {!user.address ? (
                <p>let us know the location of your products!</p>
              ) : (
                <p>your products location:</p>
              )}
              <div className="flex flex-row justify-center">
                <input
                  className="cursor text-center border-b-2 border-black border-dotted w-100 "
                  type="text"
                  defaultValue={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onClick={changeEditMode}
                />
                {editMode && (
                  <button className="btn  btn-link" onClick={addressSubmit}>
                    <i className="fas fa-check-circle"></i>
                  </button>
                )}{" "}
              </div>
            </div>
          </div>

          <div className="container flex flex-row justify-center mt-8">
            <ProductList show={show} /> <BorrowedProductList id={user.id} />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
