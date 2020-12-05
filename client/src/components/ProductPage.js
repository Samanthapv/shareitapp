
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getProfile,
  getProduct,
  getProductRequests,
} from "../services/requests";
import DateRange from "./DateRange";
import StarRatingComponent from "react-star-rating-component";
import MapContainer from "./MapContainer";
import ReviewCard from "./ReviewCard";
import ChatWindow from "./ChatWindow";
import Noty from "noty";
import "../../node_modules/noty/lib/noty.css";
import "../../node_modules/noty/lib/themes/relax.css";
import Footer from "./Footer";

export default function ProductPage() {
  let { id } = useParams();
  let [item, setItem] = useState("");
  let [pointTotal, setPointTotal] = useState(0);
  const [user, setUser] = useState("");
  let [hasEnoughPoints, setHasEnoughPoints] = useState(true);
  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);
  let [reserved, setReserved] = useState(false);
  let [requests, setRequests] = useState([]);
  let [avgRating, setAvgRating] = useState(0);
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Get owner and product data
    const res1 = await getProfile();
    const res2 = await getProduct(id);
    setUser(res1.data);
    setItem(res2.data);

    // Get all requests for this product
    const res3 = await getProductRequests(id);
    setRequests(res3.data);
    // Get all ratings, filter out nulls
    const ratings = res3.data
      .map((request) => request.rating)
      .filter((rating) => rating);
    // Calculate average rating
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    setAvgRating(Math.round(average));
  };

  useEffect(() => {
    // Calculate total price based on chosen dates
    if (startDate && endDate) {
      const daysDifference =
        // difference in milliseconds divided by amount of milliseconds in a day
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const PointTotal =
        // make sure point total doesn't go below 0
        daysDifference >= 0 ? daysDifference * item.pricePerDay : 0;
      setPointTotal(PointTotal);
    } else {
      setPointTotal(0);
    }
  }, [startDate, endDate]);

  //notifications

  let notification = (bool) => {
    new Noty({
      text: bool
        ? "Your request was sent to the owner"
        : "You do not have enought points",
      layout: "topRight",
      theme: "relax",
      type: bool ? "success" : "error",
      timeout: 3500,
      progressBar: true,
    }).show();
  };

  //fetch product

  let getOneProduct = () => {
    fetch(`/products/${id}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setItem(json);
      });
  };

  //add item to borrowed items

  let borrowItem = (productId) => {
    if (user.points < pointTotal) {
      notification(false);
      //setHasEnoughPoints(false);
    } else {
      fetch(`/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          productId,
          startDate: startDate,
          endDate: endDate,
        }),
      })
        .then((response) => {
          notification(true);
          // setReserved(true);
        })
        .catch((error) => {
          console.log(error);
        });

      // Deduct points from borrower (points are added to owner when request is confirmed)
      deductPoints();
    }
  };

  let deductPoints = () => {
    let newPoints = user.points - pointTotal;

    fetch(`/users/profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        points: newPoints,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //open and close chat pop up

  let showPopUp = (id) => {
    setProductId(id);
    setShow(true);
  };

  let hidePopUp = (id) => {
    setProductId(id);
    setShow(false);
  };

  return (
    <div>
    <div className="flex flex-col align-center mx-40 p-8 mt-5">
      {item && user && (
        <div>
          <ChatWindow
            show={show}
            handleClose={hidePopUp}
            sender={user.id}
            receiver={item.UserId}
            name={item.User.name}
            photo={item.User.picture}
            callback1={hidePopUp}
          />

          <div className="flex flex-col text-center h-height pt-3">
            <div className="flex flex-row justify-around gap-1">
              <img
                alt="product"
                className=" lg:w-1/2 w-64 object-cover object-center rounded border border-gray-200 mt-36"
                src={
                  item.picture.substring(0, 5) === "https"
                    ? item.picture
                    : `/../../../${item.picture.substring(
                        7,
                        item.picture.length
                      )}`
                }
              />

              <div className="flex flex-col text-center border rounded-md border-gray-700 w-50 pt-5">
                <div className="flex flex-row justify-center items-center gap-1 mb-1">
                  <img
                    alt="Placeholder"
                    className="block rounded-full h-8 w-8 object-cover"
                    src={ item.User.picture.substring(0, 5) === "https"
                    ? item.User.picture
                    : `/../../../${item.User.picture.substring(
                      7,
                      item.User.picture.length
                    )}`}
                  />

                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {item.User.name}
                  </h2>
                </div>

                <h1 className="text-indigo-700 text-3xl title-font font-medium">
                  {item.name}{" "}
                  <span className="text-sm text-black">
                    | {item.pricePerDay} <i className="fas fa-coins    "></i> /
                    day
                  </span>
                </h1>

                {avgRating ? (
                  <div>
                    <p className="px-80">Rating:</p>
                    <StarRatingComponent
                      name={item.id}
                      starCount={5}
                      value={avgRating}
                      editing={false}
                    />
                  </div>
                ) : (
                  <p>no ratings yet</p>
                )}

                <small className="text-muted mb-1">
                  added on {item.createdAt.substring(0, 10)}
                </small>
                <p className="leading-relaxed px-48 ">{item.description}</p>
                <p className="text-capitalize">Condition: {item.condition}</p>
                <div className="d-flex justify-content-center">
                  {item.UserId !== user?.id && !reserved && (
                    <div>
                      <h4 className="font-semibold mt-2 ">Select dates</h4>
                      <small>
                        Max availability: {item.numOfDaysAvailable} days
                      </small>
                      <div className="text-center ">
                        <DateRange
                          productId={item.id}
                          changeStartDate={setStartDate}
                          changeEndDate={setEndDate}
                          maxAvailableDays={item.numOfDaysAvailable}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row justify-around mt-3">
                  <span className="title-font font-medium text-xl text-gray-900">
                    Total: {pointTotal} <i className="fas fa-coins    "></i>
                  </span>
                  <div className="flex">
                    <button
                      onClick={() => borrowItem(item.id)}
                      className="btn btn-primary mb-2"
                      disabled={!(startDate && endDate) ? true : false}
                    >
                      Reserve
                    </button>
                    <button
                      className="btn mb-2 btn-primary"
                      onClick={() => showPopUp()}
                    >
                      <i className="far fa-comment"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-evenly  pr-3">
              <div className="w-1/2 overflow-hidden ml-1 pl-4 text-center">
                <div className="flex flex-col justify-center w-75 mt-1">
                  <p className="text-xl text-indigo-700 mt-1">Reviews</p>
                  {requests
                    .filter((request) => request.review)
                    .map((request) => (
                      <ReviewCard key={request.id} request={request} />
                    ))}
                </div>
              </div>

              <div
                className="w-1/2 overflow-hidden"
                style={{ marginBottom: "500px" }}
              >
                <div className="mt-3">
                  {item.User && (
                    <MapContainer lat={item.User.lat} lng={item.User.lng} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    
    </div>
      <Footer />
    </div>
  );
}
